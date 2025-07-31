import { Module } from '@nestjs/common';
import { WeatherModule } from './weather/weather.module';
import { LocationModule } from './location/location.module';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [CommonModule, WeatherModule, LocationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
