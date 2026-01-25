import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class QuotesService {
  private quotes: string[] = [];

  constructor() {
    console.log('=== QuotesService initialization ===');
    console.log('Current __dirname:', __dirname);
    console.log('Process cwd:', process.cwd());
    this.loadQuotes();
  }

  private loadQuotes() {
    try {
      console.log('Attempting to load quotes...');

      // Пробуем разные пути
      const possiblePaths = [
        path.join(__dirname, '../data/quotes.json'), // из src/quotes/
        path.join(__dirname, '../../src/data/quotes.json'), // из dist/quotes/
        path.join(process.cwd(), 'src/data/quotes.json'), // абсолютный
        path.join(process.cwd(), 'data/quotes.json'), // альтернативный
      ];

      let quotesPath = '';
      for (const p of possiblePaths) {
        console.log(`Checking path: ${p}`);
        if (fs.existsSync(p)) {
          quotesPath = p;
          console.log(`Found quotes at: ${p}`);
          break;
        }
      }

      if (!quotesPath) {
        console.error('Quotes file not found in any location!');
        this.quotes = ['Мудрость приходит с опытом.'];
        return;
      }

      console.log(`Reading quotes from: ${quotesPath}`);
      const data = fs.readFileSync(quotesPath, 'utf8');
      this.quotes = JSON.parse(data);
      console.log(`Successfully loaded ${this.quotes.length} quotes`);
      console.log('First quote:', this.quotes[0]);
    } catch (error) {
      console.error('Error in loadQuotes:', error);
      console.error('Error stack:', error.stack);
      this.quotes = ['Мудрость приходит с опытом.'];
    }
  }

  getRandomQuote(): string {
    console.log(
      `getRandomQuote called. Available quotes: ${this.quotes.length}`,
    );

    if (this.quotes.length === 0) {
      return 'Нет доступных цитат.';
    }

    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];
    console.log(`Selected quote #${randomIndex}: ${quote.substring(0, 50)}...`);

    return quote;
  }

  getAllQuotes(): string[] {
    return this.quotes;
  }
}
