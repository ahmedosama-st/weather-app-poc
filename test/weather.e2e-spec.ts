import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import * as request from 'supertest';
import { createDatabaseIfDoesntExist, dropDatabaseIfExists } from '@common/utils/database';

dotenv.config();

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await createDatabaseIfDoesntExist();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await dropDatabaseIfExists();
  });

  it('/weather/coordinates/peak WITH valid Coordinates (GET)', async () => {
    // fill in the database with one result before fetching peak.
    await request(app.getHttpServer()).get('/api/weather/coordinates?latitude=48.856613&longitude=2.352222').send();

    const res = await request(app.getHttpServer())
      .get('/api/weather/coordinates/peak?latitude=48.856613&longitude=2.352222')
      .send();
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      aqius: expect.any(Number),
      aqicn: expect.any(Number),
      locationId: expect.any(Number),
      location: expect.any(Object),
    });
    expect(res.status).toBe(200);
  });

  it('/weather/coordinates/peak WITH invalid Coordinates given (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/weather/coordinates/peak?latitude=28.856613&longitude=-1.352222')
      .send();
    expect(res.body).toMatchObject({
      message: expect.any(String),
      statusCode: 400,
    });
    expect(res.status).toBe(400);
  });

  it('/weather/coordinates WITH invalid Coordinates given (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/weather/coordinates?latitude=28.856613&longitude=-1.352222')
      .send();
    expect(res.body).toMatchObject({
      message: expect.any(String),
      statusCode: 400,
    });
    expect(res.status).toBe(400);
  });

  it('/weather/coordinates/peak with no coordinates given (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/weather/coordinates/peak').send();
    expect(res.status).toBe(400);
  });

  it('/weather/coordinates WITH valid Coordinates (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/weather/coordinates?latitude=48.856613&longitude=2.352222')
      .send();

    // Check if we got a rate limit error
    if (res.status === 400 && res.body.message && res.body.message.includes('Too Many Requests')) {
      expect(res.body).toMatchObject({
        message: expect.stringContaining('Too Many Requests'),
        statusCode: 400,
      });
    } else {
      expect(res.body).toMatchObject({
        location: {
          type: expect.any(String),
          coordinates: expect.any(Array),
        },
        pollution: expect.any(Object),
        weather: expect.any(Object),
      });
      expect(res.status).toBe(200);
    }
  });

  it('/weather/coordinates With no coordinates given (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/api/weather/coordinates').send();
    expect(res.status).toBe(400);
  });
});
