import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GetWeatherPeakByCoordinatesQuery } from '@src/weather/queries/get-weather-peak-by-coordinates.query';
import { CacheService } from '@common/services/cache.service';
import { env } from '@common/env';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NearestCityResponse, Pollution, Weather } from '../types/responses/airvisual';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherEntity } from '@src/weather/entities/weather.entity';
import { PollutionEntity } from '@src/weather/entities/pollution.entity';
import { Url } from '@common/utils/url';
import { LocationEnum } from '@src/location/enums/location.enum';
import { findOrCreate } from '@common/utils/database';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LocationService } from '@src/location/services/location.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly http: HttpService,
    @InjectRepository(WeatherEntity)
    private readonly weatherRepository: Repository<WeatherEntity>,
    @InjectRepository(PollutionEntity)
    private readonly pollutionRepository: Repository<PollutionEntity>,
    private readonly locationService: LocationService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async createParisWeatherAndPollutionRecords() {
    try {
      await this.getWeatherStatusByCoordinates(GetWeatherPeakByCoordinatesQuery.fromCoordinates(48.856613, 2.352222));
    } catch (error) {
      Logger.error('Error creating Paris weather and pollution records:', error);
    }
  }

  async getWeatherPeakByCoordinates(query: GetWeatherPeakByCoordinatesQuery) {
    const state = await this.getState(query);
    return this.findPollutionPeakByState(state);
  }

  async getWeatherStatusByCoordinates(query: GetWeatherPeakByCoordinatesQuery) {
    try {
      const apiResponse = await this.fetchNearestCityData(query);
      const locationHierarchy = await this.locationService.createLocationHierarchy(apiResponse.data.data);
      const pollution = await this.createPollutionRecord(
        apiResponse.data.data.current.pollution,
        locationHierarchy.state.id,
      );
      const weather = await this.createWeatherRecord(apiResponse.data.data.current.weather, locationHierarchy.state.id);

      return {
        location: apiResponse.data.data.location,
        pollution,
        weather,
      };
    } catch (e) {
      this.handleApiError(e);
    }
  }

  private async fetchNearestCityData(query: GetWeatherPeakByCoordinatesQuery) {
    const url = this.buildApiUrl(query);

    return (await firstValueFrom(this.http.get(url))) as unknown as { data: NearestCityResponse };
  }


  private async createPollutionRecord(pollutionData: Pollution, locationId: number) {
    const cleanedPollutionData = this.excludeTimestampFromData(pollutionData);

    return await findOrCreate(this.pollutionRepository, {
      ...cleanedPollutionData,
      locationId,
      createdAt: new Date(pollutionData.ts),
    });
  }

  private async createWeatherRecord(weatherData: Weather, locationId: number) {
    const cleanedWeatherData = this.excludeTimestampFromData(weatherData);

    return await findOrCreate(this.weatherRepository, {
      ...cleanedWeatherData,
      locationId,
      createdAt: new Date(weatherData.ts),
    });
  }

  private excludeTimestampFromData(data: Pollution | Weather): any {
    return Object.keys(data).reduce((prev, current) => {
      if (current !== 'ts') {
        prev[current] = data[current];
      }
      return prev;
    }, {});
  }

  private buildApiUrl(query: GetWeatherPeakByCoordinatesQuery): string {
    return Url.base(env('IQAIR_URL'))
      .version('v2')
      .path('nearest_city')
      .query({
        lat: query.latitude,
        lon: query.longitude,
        key: env('IQAIR_API_KEY'),
      })
      .toString();
  }

  private handleApiError(e: any): never {
    const message = e.response?.data?.data?.message || e.toString();
    throw new HttpException(`Something went wrong: ${message}`, HttpStatus.BAD_REQUEST);
  }

  private generateCacheKey(latitude: number, longitude: number): string {
    return `lat:${latitude}-long:${longitude}`;
  }

  private async getState(query: GetWeatherPeakByCoordinatesQuery): Promise<string> {
    const cacheKey = this.generateCacheKey(query.latitude, query.longitude);
    let state = await this.cacheService.get<string>(cacheKey);

    if (!state) {
      state = await this.fetchStateFromApi(query, cacheKey);
    }

    return state;
  }

  private async fetchStateFromApi(query: GetWeatherPeakByCoordinatesQuery, cacheKey: string): Promise<string> {
    try {
      const url = this.buildApiUrl(query);
      const res = (await firstValueFrom(this.http.get(url))) as unknown as { data: NearestCityResponse };
      const state = res.data.data.state;

      await this.cacheService.set(cacheKey, state);
      return state;
    } catch (e) {
      this.handleApiError(e);
    }
  }

  private findPollutionPeakByState(state: string) {
    return this.pollutionRepository
      .createQueryBuilder('pollution')
      .addSelect(['SUM(pollution.aqicn + pollution.aqius) AS peak'])
      .innerJoinAndSelect('pollution.location', 'location')
      .where('location.type = :type', { type: LocationEnum.State })
      .andWhere('location.name = :name', { name: state })
      .groupBy('pollution.id, location.id')
      .orderBy('peak', 'DESC')
      .getOne();
  }
}
