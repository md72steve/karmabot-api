import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(3000);
}

bootstrap();

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('KarmaBot')
    .setDescription('API for the KarmaBot')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/karma/api', app, document);
}
