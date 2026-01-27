import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

<<<<<<< Updated upstream
  // CORS из конфигурации
  app.enableCors(configService.get('cors'));

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

=======
  // Настройка приложения
  AppConfig.setup(app, configService);

>>>>>>> Stashed changes
  // Swagger документация
  SwaggerConfig.setup(app);

  // Запуск сервера
  const port = configService.get('server.port');
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
  // В конце bootstrap() добавить обработку ошибок
}

bootstrap();
