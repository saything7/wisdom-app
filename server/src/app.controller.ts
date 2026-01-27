import { Controller, Get } from '@nestjs/common';

// app.controller.ts
@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      name: 'Цитатник Джейсона Стэйтэма',
      version: '1.0',
      description: 'API для мудрых цитат',
      docs: '/api/docs',
      endpoints: {
        quotes: '/quotes',
        counter: '/counter',
      },
    };
  }
}