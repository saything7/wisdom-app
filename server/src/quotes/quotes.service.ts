<<<<<<< Updated upstream
import { Injectable } from '@nestjs/common';
import { IQuotesService } from './quotes.service.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuotesService implements IQuotesService {
  private quotes: string[] = [];

  constructor() {
    this.loadQuotes();
  }

  private loadQuotes() {
    try {
      const quotesPath = path.join(__dirname, '../../data/quotes.json');
      const data = fs.readFileSync(quotesPath, 'utf8');
      this.quotes = JSON.parse(data);
    } catch (error) {
      this.quotes = ['Мудрость приходит с опытом.'];
    }
  }

  getAllQuotes(): string[] {
    return [...this.quotes];
  }

  getRandomQuote(): string {
    if (this.quotes.length === 0) return 'Нет доступных цитат.';
    const index = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[index];
  }
=======
// quotes/quotes.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Response } from 'express';
import * as crypto from 'crypto';
import { QUOTES_CONSTANTS } from '../quotes/constants/quotes.constants';
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
  private readonly originalQuotes: string[] = quotesData;
  private currentQuotes: string[] = [];
  private currentIndex = 0;

  constructor(
    @Inject('ICounterService')
    private readonly counterService: ICounterService,
  ) {
    this.shuffleQuotes();
  }

  private shuffleQuotes(): void {
    this.currentQuotes = [...this.originalQuotes];

    for (let i = this.currentQuotes.length - 1; i > 0; i--) {
      const randomBytes = crypto.randomBytes(4);
      const j = randomBytes.readUInt32BE(0) % (i + 1);
      [this.currentQuotes[i], this.currentQuotes[j]] = [
        this.currentQuotes[j],
        this.currentQuotes[i],
      ];
    }
    this.currentIndex = 0;
  }

  getAllQuotes(): QuotesListResponse {
    return {
      quotes: [...this.originalQuotes],
      total: this.originalQuotes.length,
      timestamp: new Date().toISOString(),
    };
  }

  getRandomQuote(): string {
    if (this.currentQuotes.length === 0) {
      return 'Нет доступных цитат.';
    }

    const quote = this.currentQuotes[this.currentIndex];
    this.currentIndex++;

    if (this.currentIndex >= this.currentQuotes.length) {
      this.shuffleQuotes();
    }

    return quote;
  }

  async getRandomQuoteWithStats(
    userId: string,
    res: Response,
  ): Promise<QuoteResponse> {
    const quote = this.getRandomQuote();

    const count = await this.counterService.increment(userId);
    const totalCount = await this.counterService.getTotalCount(userId);

    // Вынести логику кук в отдельный сервис
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
    // Здесь будет логика добавления в БД
    return {
      message: 'Цитата добавлена (заглушка)',
      quote: createQuoteDto.text,
      author:
        createQuoteDto.author ||
        QUOTES_CONSTANTS.DEFAULT_AUTHOR ||
        'Неизвестный автор',
      timestamp: new Date().toISOString(),
    };
  }

  private setTotalCountCookie(res: Response, totalCount: number): void {
    res.cookie('totalCount', totalCount.toString(), {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
>>>>>>> Stashed changes
}
