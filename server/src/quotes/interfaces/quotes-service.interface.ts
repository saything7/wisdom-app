// quotes/interfaces/quotes-service.interface.ts
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { Response } from 'express';

export interface QuoteResponse {
  quote: string;
  count: number;
  totalCount: number;
  userId: string;
  timestamp: string;
}

export interface QuotesListResponse {
  quotes: string[];
  total: number;
  timestamp: string;
}

export interface IQuotesService {
  getAllQuotes(): QuotesListResponse;
  getRandomQuote(): string;
  getRandomQuoteWithStats(
    userId: string,
    res: Response,
  ): Promise<QuoteResponse>;
  createQuote(createQuoteDto: CreateQuoteDto): Promise<{
    message: string;
    quote: string;
    author: string;
    timestamp: string;
  }>;
}
