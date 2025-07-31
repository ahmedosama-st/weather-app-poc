import { Module } from '@nestjs/common';
import { WeatherService } from './services/weather.service';
import { WeatherController } from './controllers/weather.controller';
import { CommonModule } from '@common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherEntity } from '@src/weather/entities/weather.entity';
import { PollutionEntity } from '@src/weather/entities/pollution.entity';
import { HttpModule } from '@nestjs/axios';
import { LocationModule } from '@src/location/location.module';

@Module({
  imports: [
    CommonModule,
    LocationModule,
    HttpModule.register({
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([WeatherEntity, PollutionEntity]),
  ],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
