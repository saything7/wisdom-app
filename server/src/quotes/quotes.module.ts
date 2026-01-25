// server/src/quotes/quotes.module.ts
import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { CounterService } from '../counter/counter.service';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService, CounterService],
  exports: [CounterService], // Чтобы можно было использовать в других модулях
})
export class QuotesModule {}
