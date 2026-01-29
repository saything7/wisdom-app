import { Injectable, Inject } from '@nestjs/common';
import { Response } from 'express';

import quotesData from './data/quotes.json';
import {
  IQuotesService,
  QuoteResponse,
  QuotesListResponse,
} from './interfaces/quotes-service.interface';
import { CreateQuoteDto } from './dto/create-quote.dto';
import type { ICounterService } from '../counter/interfaces/counter-service.interface';

@Injectable()
export class QuotesService implements IQuotesService {
  private readonly quotes: string[] = quotesData;

  constructor(
    @Inject('ICounterService')
    private readonly counterService: ICounterService,
  ) {}

  getAllQuotes(): QuotesListResponse {
    return {
      quotes: [...this.quotes],
      total: this.quotes.length,
      timestamp: new Date().toISOString(),
    };
  }

  getRandomQuote(): string {
    if (this.quotes.length === 0) {
      return 'Нет доступных цитат.';
    }

    // Используем Math.random() для выбора случайной цитаты
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  async getRandomQuoteWithStats(
    userId: string,
    res: Response,
  ): Promise<QuoteResponse> {
    const quote = this.getRandomQuote();

    const count = await this.counterService.increment(userId);
    const totalCount = await this.counterService.getTotalCount(userId);

    this.setTotalCountCookie(res, totalCount);

    return {
      quote,
      count,
      totalCount,
      userId,
      timestamp: new Date().toISOString(),
    };
  }

  async createQuote(createQuoteDto: CreateQuoteDto): Promise<{
    message: string;
    quote: string;
    author: string;
    timestamp: string;
  }> {
    return {
      message: 'Цитата добавлена (заглушка)',
      quote: createQuoteDto.text,
      author: createQuoteDto.author || 'Неизвестный автор',
      timestamp: new Date().toISOString(),
    };
  }

  private setTotalCountCookie(res: Response, totalCount: number): void {
    res.cookie('totalCount', totalCount.toString(), {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
