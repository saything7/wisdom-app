import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  controllers: [QuotesController],
  providers: [
    QuotesService,
    {
      provide: 'IQuotesService',
      useExisting: QuotesService, // Используем существующий сервис
    },
  ],
  exports: ['IQuotesService'], // Экспортируем по интерфейсу
})
export class QuotesModule {}
