// server/src/quotes/quotes.module.ts
import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';


@Module({
  controllers: [QuotesController],
  providers: [
    {
      provide: 'IQuotesService',
      useClass: QuotesService,
    },
  ],
  exports: ['IQuotesService'], // Экспортируем если нужно в других модулях
})
export class QuotesModule {}
