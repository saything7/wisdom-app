import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включи CORS для клиента на порту 3000
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Для парсинга cookies
  app.use(cookieParser());

  // Префикс /api для всех маршрутов
  app.setGlobalPrefix('api');

  await app.listen(3001);
  console.log(`🚀 Server running on http://localhost:3001/api`);
}
bootstrap();