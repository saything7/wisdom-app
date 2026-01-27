// src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static setup(app) {
    const config = new DocumentBuilder()
      .setTitle('Wisdom API')
      .setDescription('API для получения мудрых цитат')
      .setVersion('1.0')
      .addTag('quotes', 'Операции с цитатами')
      .addTag('counter', 'Счётчики запросов')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
