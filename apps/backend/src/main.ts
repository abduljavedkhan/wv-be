import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: config.get('CORS_ORIGIN', 'http://localhost:3000'), credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('WellVantage API')
    .setDescription('Gym management platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication (Google OAuth, JWT)')
    .addTag('users', 'User profile')
    .addTag('workout-plans', 'Workout plans and exercises')
    .addTag('availability', 'Trainer availability')
    .addTag('bookings', 'Slot bookings')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`Backend running at http://localhost:${port}/api`);
  console.log(`Swagger at http://localhost:${port}/api/docs`);
}
bootstrap();
