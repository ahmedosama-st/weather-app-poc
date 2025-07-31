import { ConfigService } from '@nestjs/config';
import { EnvDto } from '@common/env/env.dto';
import { plainToInstance } from 'class-transformer';
import { isNotEmpty } from 'class-validator';

const configService = new ConfigService<EnvDto>();

export const env = <K extends keyof EnvDto>(key: K): EnvDto[K] => {
  const rawValue = configService.get(key) as EnvDto[K];

  if (!isNotEmpty(rawValue)) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  const transformed = plainToInstance(EnvDto, { [key]: rawValue });

  return transformed[key];
};
