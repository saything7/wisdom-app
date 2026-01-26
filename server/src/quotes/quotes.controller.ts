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
} from '@nestjs/common';
import type { IQuotesService } from './quotes.service.interface';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('quotes')
@Controller('api/quotes')
@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class QuotesController {
  constructor(
    @Inject('IQuotesService') private readonly quotesService: IQuotesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все цитаты' })
  @ApiResponse({ status: 200, description: 'Список всех цитат' })
  getAllQuotes() {
    return {
      quotes: this.quotesService.getAllQuotes(),
      total: this.quotesService.getAllQuotes().length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('random')
  @ApiOperation({ summary: 'Получить случайную цитату' })
  @ApiResponse({ status: 200, description: 'Случайная цитата' })
  @ApiResponse({ status: 429, description: 'Слишком много запросов' })
  getRandomQuote() {
    return {
      quote: this.quotesService.getRandomQuote(),
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
    // В будущем: this.quotesService.addQuote(createQuoteDto.text);
    return {
      message: 'Цитата добавлена (заглушка)',
      quote: createQuoteDto.text,
      author: createQuoteDto.author,
      timestamp: new Date().toISOString(),
    };
  }
}
