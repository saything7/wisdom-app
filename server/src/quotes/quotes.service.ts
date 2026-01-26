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
    } catch {
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
}
