import { Injectable } from '@nestjs/common';
import { IQuotesService } from './quotes.service.interface';
import * as crypto from 'crypto';

// Импортируем JSON напрямую
import quotesData from './data/quotes.json';

@Injectable()
export class QuotesService implements IQuotesService {
  private readonly originalQuotes: string[] = quotesData;
  private currentQuotes: string[] = [];
  private currentIndex = 0;
  private requestCount = 0;

  constructor() {
    this.shuffleQuotes();
  }

  private shuffleQuotes(): void {
    // Создаем копию и перемешиваем алгоритмом Фишера-Йетса
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

  getAllQuotes(): string[] {
    return [...this.originalQuotes];
  }

  getRandomQuote(): string {
    this.requestCount++;

    if (this.currentQuotes.length === 0) {
      return 'Нет доступных цитат.';
    }

    // Берем следующую цитату из перемешанного массива
    const quote = this.currentQuotes[this.currentIndex];
    this.currentIndex++;

    // Если дошли до конца массива - перемешиваем снова
    if (this.currentIndex >= this.currentQuotes.length) {
      this.shuffleQuotes();
    }

    return quote;
  }
}