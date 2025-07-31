import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class GetWeatherPeakByCoordinatesQuery {
  @IsNotEmpty()
  @IsLatitude()
  @ApiProperty({
    example: 48.856613,
    description: 'latitude of the place you want to get weather/pollution for',
  })
  latitude: number;
  @IsNotEmpty()
  @IsLongitude()
  @ApiProperty({
    example: 2.352222,
    description: 'longitude of the place you want to get weather/pollution for',
  })
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  static fromCoordinates(latitude: number, longitude: number): GetWeatherPeakByCoordinatesQuery {
    return new GetWeatherPeakByCoordinatesQuery(latitude, longitude);
  }
}
