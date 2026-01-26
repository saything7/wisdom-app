import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import type { IQuotesService } from './quotes.service.interface';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('api/quotes') // Добавить 'api/' для структуры API
@UseGuards(ThrottlerGuard)
export class QuotesController {
  constructor(
    @Inject('IQuotesService') private readonly quotesService: IQuotesService,
  ) {}

  @Get()
  getAllQuotes() {
    return {
      quotes: this.quotesService.getAllQuotes(),
      total: this.quotesService.getAllQuotes().length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('random')
  getRandomQuote() {
    return {
      quote: this.quotesService.getRandomQuote(),
      timestamp: new Date().toISOString(),
    };
  }
}
