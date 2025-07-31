import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { env } from '@common/env';

export async function getPostgresDbConfig() {
  return {
    type: 'postgres',
    host: env('POSTGRES_HOST'),
    port: env('POSTGRES_PORT') || 5432,
    username: env('POSTGRES_USER'),
    password: env('POSTGRES_PASSWORD'),
    database: env('POSTGRES_DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrations: [__dirname + '/migration/*{.ts,.js}'],
    synchronize: env('NODE_ENV') === 'local',
    autoLoadEntities: true,
    keepConnectionAlive: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
}
