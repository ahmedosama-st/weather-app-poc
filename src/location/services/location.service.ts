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

  /**
   * Creates a location hierarchy (country, city, state) based on data from the API
   * @param data The data containing country, city, and state information
   * @returns An object containing the created country, city, and state entities
   */
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

  /**
   * Finds a location by its name and type
   * @param name The name of the location
   * @param type The type of the location
   * @returns The found location entity or null if not found
   */
  async findLocationByNameAndType(name: string, type: LocationEnum) {
    return this.locationRepository.findOne({
      where: { name, type }
    });
  }
}
