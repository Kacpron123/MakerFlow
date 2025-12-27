import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5173', // Address of the frontend in Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable sending of authorization headers
  });
  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
