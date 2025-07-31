import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUES } from '@common/constants';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { createKeyv } from '@keyv/redis';
import { Cacheable } from 'cacheable';
import { BullModule } from '@nestjs/bullmq';
import { getPostgresDbConfig } from '@src/database-connection';
import { CacheService } from './services/cache.service';
import { env } from '@common/env';
import envConfigs from '@common/env/env.configs';
import { validator } from '@common/validator';
import { EnvDto } from '@common/env/env.dto';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfigs],
      validate: config => validator.validate(EnvDto, config),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: async () => {
        return {
          connection: {
            host: env('REDIS_HOST'),
            port: env('REDIS_PORT'),
          },
          defaultJobOptions: {
            attempts: 3,
            removeOnComplete: 500,
            removeOnFail: 500,
            backoff: {
              type: 'fixed',
              delay: 2000,
            },
          },
        };
      },
    }),
    BullModule.registerQueue({ name: QUEUES.weather }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return (await getPostgresDbConfig()) as TypeOrmModuleOptions;
      },
    }),
  ],
  providers: [
    ConfigService,
    Logger,
    CacheService,
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const redisHost = env('REDIS_HOST');
        const redisPort = env('REDIS_PORT');

        if (!redisHost || !redisPort) {
          throw new Error('REDIS_HOST or REDIS_PORT is not defined in environment variables.');
        }

        const redisUrl = `redis://${redisHost}:${redisPort}`;

        try {
          const secondary = createKeyv(redisUrl);
          return new Cacheable({ secondary, ttl: '1m' });
        } catch (error) {
          console.error(`Error initializing Redis connection: ${error.message}`);
          throw error;
        }
      },
    },
  ],
  exports: [CacheService, 'CACHE_INSTANCE', BullModule],
})
export class CommonModule {}
