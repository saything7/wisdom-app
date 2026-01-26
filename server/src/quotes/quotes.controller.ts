import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import type { IQuotesService } from './quotes.service.interface';
import type { ICounterService } from '../counter/counter.service.interface';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

// Интерфейс для Request с userId
interface RequestWithUserId extends Request {
  userId?: string;
}

@ApiTags('quotes')
@Controller('api/quotes')
@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class QuotesController {
  constructor(
    @Inject('IQuotesService') private readonly quotesService: IQuotesService,
    @Inject('ICounterService') private readonly counterService: ICounterService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все цитаты' })
  @ApiResponse({ status: 200, description: 'Список всех цитат' })
  getAllQuotes() {
    const quotes = this.quotesService.getAllQuotes();
    return {
      quotes,
      total: quotes.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайную цитату' })
  @ApiResponse({ status: 200, description: 'Случайная цитата' })
  @ApiResponse({ status: 429, description: 'Слишком много запросов' })
  getRandomQuote(@Req() req: RequestWithUserId) {
    const userId = req.userId || 'anonymous';
    const quote = this.quotesService.getRandomQuote();

    // Безопасный вызов - userId точно string
    const count = this.counterService.increment(userId);

    return {
      quote,
      count,
      userId,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Добавить новую цитату' })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({ status: 201, description: 'Цитата успешно добавлена' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  addQuote(@Body() createQuoteDto: CreateQuoteDto) {
    return {
      message: 'Цитата добавлена (заглушка)',
      quote: createQuoteDto.text,
      author: createQuoteDto.author,
      timestamp: new Date().toISOString(),
    };
  }
}
