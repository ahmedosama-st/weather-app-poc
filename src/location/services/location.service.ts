import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { LocationEnum } from '../enums/location.enum';
import { findOrCreate } from '@common/utils/database';
import { Data } from '@src/weather/types/responses/airvisual';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async createLocationHierarchy(data: Data) {
    const country = await findOrCreate(this.locationRepository, {
      name: data.country,
      type: LocationEnum.Country,
    });

    const city = await findOrCreate(this.locationRepository, {
      name: data.city,
      type: LocationEnum.City,
      parentId: country.id,
    });

    const state = await findOrCreate(this.locationRepository, {
      name: data.state,
      type: LocationEnum.State,
      parentId: city.id,
    });

    return { country, city, state };
  }
}
