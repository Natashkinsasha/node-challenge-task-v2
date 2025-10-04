import { Logger } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

import { createApp } from './create-app';

function setupSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder().build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, cleanupOpenApiDoc(documentFactory));
}

async function bootstrap() {
  const logger = new Logger('Main');
  logger.log('Starting Token Price Service...');
  const app = await createApp();
  setupSwagger(app);
  await app.listen({ port: 3000, host: '0.0.0.0' });
  logger.log('Service is running on port 3000');
}

bootstrap();
