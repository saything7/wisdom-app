// server/src/quotes/quotes.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CounterService } from '../counter/counter.service';
import type { Request, Response } from 'express'; // Измени эту строку
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('quotes')
@UseGuards(ThrottlerGuard) // Применяем rate limiting
export class QuotesController {
  constructor(
    private readonly quotesService: QuotesService,
    private readonly counterService: CounterService,
  ) {}
  @Get()
  getAllQuotes(@Res() response: Response) {
    try {
      const quotes = this.quotesService.getAllQuotes();
      return response.json({
        quotes,
        total: quotes.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return response.status(500).json({
        error: 'Failed to load quotes',
        message: error.message,
      });
    }
  }

  @Get('random')
  getRandomQuote(@Req() request: Request, @Res() response: Response) {
    // Получаем userId из cookies или создаём новый
    let userId = request.cookies?.userId;
    let newUser = false;

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      newUser = true;
    }

    // Увеличиваем счётчик для этого пользователя
    const requestCount = this.counterService.increment(userId);

    // Устанавливаем/обновляем cookie
    response.cookie('userId', userId, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      httpOnly: true,
    });

    // Возвращаем цитату
    return response.json({
      quote: this.quotesService.getRandomQuote(),
      count: requestCount,
      userId,
      newUser,
      timestamp: new Date().toISOString(),
    });
  }
}
