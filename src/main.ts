import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@src/app.module';
import { env } from '@common/env';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { createDatabaseIfDoesntExist } from '@common/utils/database';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { version } from '../package.json';

async function bootstrap() {
  dotenv.config();
  await createDatabaseIfDoesntExist();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const port = env('APP_PORT');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Air Quality')
    .setDescription('The Air Quality API')
    .setVersion(version)
    .addTag('air')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => {
    Logger.log(`Server is running on port ${port}`, 'Bootstrap');
  });
}

bootstrap();
