// src/config/app.config.ts
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export class AppConfig {
  static setup(app, configService) {
    app.use(cookieParser());

    app.enableCors({
      ...configService.get('cors'),
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
  }
}
