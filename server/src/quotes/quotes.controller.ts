// quotes/quotes.controller.ts
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
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import type { IQuotesService } from './interfaces/quotes-service.interface';
import type { ICounterService } from '../counter/interfaces/counter-service.interface';
import { CreateQuoteDto } from './dto/create-quote.dto';

interface RequestWithUserId extends Request {
  userId?: string;
}

@ApiTags('quotes')
@Controller('api/quotes')
@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class QuotesController {
  constructor(
    @Inject('IQuotesService')
    private readonly quotesService: IQuotesService,
    @Inject('ICounterService')
    private readonly counterService: ICounterService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все цитаты' })
  @ApiResponse({ status: 200, description: 'Список всех цитат' })
  @ApiResponse({ status: 429, description: 'Слишком много запросов' })
  getAllQuotes() {
    return this.quotesService.getAllQuotes();
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайную цитату' })
  @ApiResponse({ status: 200, description: 'Случайная цитата' })
  @ApiResponse({ status: 429, description: 'Слишком много запросов' })
  async getRandomQuote(
    @Req() req: RequestWithUserId,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.userId || 'anonymous';
    return this.quotesService.getRandomQuoteWithStats(userId, res);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Добавить новую цитату' })
  @ApiBody({ type: CreateQuoteDto })
  @ApiResponse({ status: 201, description: 'Цитата успешно добавлена' })
  @ApiResponse({ status: 400, description: 'Невалидные данные' })
  createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.createQuote(createQuoteDto);
  }
}
