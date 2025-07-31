import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from '@src/weather/services/weather.service';
import { GetWeatherPeakByCoordinatesQuery } from '@src/weather/queries/get-weather-peak-by-coordinates.query';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/coordinates/peak')
  getWeatherPeakByCoordinates(@Query() query: GetWeatherPeakByCoordinatesQuery) {
    return this.weatherService.getWeatherPeakByCoordinates(query);
  }

  @Get('/coordinates')
  getWeatherByCoordinates(@Query() query: GetWeatherPeakByCoordinatesQuery) {
    return this.weatherService.getWeatherStatusByCoordinates(query);
  }
}
