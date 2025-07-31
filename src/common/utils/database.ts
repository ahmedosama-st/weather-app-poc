import { Client } from 'pg';
import { env } from '@common/env';
import { Logger } from '@nestjs/common';
import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

const DATABASE_EXISTS_COUNT = 1;
const DATABASE_NOT_EXISTS_COUNT = 0;

const createDatabaseClient = async () => {
  const client = new Client({
    user: env('POSTGRES_USER'),
    password: env('POSTGRES_PASSWORD'),
    host: env('POSTGRES_HOST'),
  });
  await client.connect();
  return client;
};

const checkDatabaseExists = async (client: Client, databaseName: string) => {
  const res = await client.query('SELECT COUNT(*) FROM pg_database WHERE datname = $1', [databaseName]);
  return parseInt(res.rows[0].count);
};

export const createDatabaseIfDoesntExist = async () => {
  let client: Client | null = null;
  try {
    client = await createDatabaseClient();
    const databaseName = env('POSTGRES_DATABASE');
    const count = await checkDatabaseExists(client, databaseName);

    if (count === DATABASE_NOT_EXISTS_COUNT) {
      Logger.log(`Database ${databaseName} does not exist, creating...`, 'Database');
      await client.query(`CREATE DATABASE ${databaseName}`);
    }
    Logger.log(`Database ${databaseName} is ready`, 'Database');
  } catch (e) {
    Logger.error(e, 'Database');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
};

export const dropDatabaseIfExists = async () => {
  let client: Client | null = null;
  try {
    client = await createDatabaseClient();
    const databaseName = env('POSTGRES_DATABASE');
    const count = await checkDatabaseExists(client, databaseName);

    if (count === DATABASE_EXISTS_COUNT) {
      await client.query(`DROP DATABASE ${databaseName}`);
    }
  } catch (e) {
    Logger.error(e, 'Database');
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
    }
  }
};

export async function findOrCreate<T extends ObjectLiteral>(
  repository: Repository<T>,
  where: FindOptionsWhere<T>,
  defaults: Partial<T> = {},
): Promise<T> {
  const existing = await repository.findOne({ where });

  if (existing) return existing;

  const created = repository.create({ ...where, ...defaults } as T);
  return repository.save(created);
}
