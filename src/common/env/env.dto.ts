import { Trim } from '@src/common/decorators/trim.decorator';
import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsPositive, IsString } from 'class-validator';

const NODE_ENVS = ['local', 'dev', 'production'] as const;

export class EnvDto {
  @IsNotEmpty()
  @Trim()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  APP_PORT: number;

  @IsNotEmpty()
  @Trim()
  @IsIn(NODE_ENVS)
  NODE_ENV: (typeof NODE_ENVS)[number];

  @IsNotEmpty()
  @Trim()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  REDIS_PORT: number;

  @IsNotEmpty()
  @Trim()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @Trim()
  @IsString()
  POSTGRES_HOST: string;

  @IsNotEmpty()
  @Trim()
  @Transform(({ value }) => Number(value))
  @IsPositive()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @Trim()
  POSTGRES_USER: string;

  @IsNotEmpty()
  @Trim()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @Trim()
  POSTGRES_DATABASE: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  IQAIR_API_KEY: string;

  IQAIR_URL: string = 'https://api.airvisual.com';
}
