import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Настройка приложения
  AppConfig.setup(app, configService);

  // Swagger документация
  SwaggerConfig.setup(app);

  // Запуск сервера
  const port = configService.get('server.port');
  await app.listen(port);
}

// В конце bootstrap() добавить обработку ошибок
bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
