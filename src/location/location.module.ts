import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { LocationService } from './services/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
