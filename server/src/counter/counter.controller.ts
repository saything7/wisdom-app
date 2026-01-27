// counter/counter.controller.ts
import { Controller, Get, Param, Req, Inject, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import type { ICounterService } from './interfaces/counter-service.interface';

interface RequestWithUserId extends Request {
  userId?: string;
}

@ApiTags('counter')
@Controller('api/counter')
@UseGuards(ThrottlerGuard)
export class CounterController {
  constructor(
    @Inject('ICounterService')
    private readonly counterService: ICounterService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить свой счётчик' })
  @ApiResponse({ status: 200, description: 'Счётчик текущего пользователя' })
  getMyCount(@Req() req: RequestWithUserId) {
    const userId = req.userId || 'anonymous';
    const stats = this.counterService.getStats(userId);

    return {
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить счётчик по ID пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Счётчик пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  getCount(@Param('userId') userId: string) {
    const stats = this.counterService.getStats(userId);

    return {
      ...stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats/all')
  @ApiOperation({ summary: 'Получить статистику всех пользователей' })
  @ApiResponse({ status: 200, description: 'Статистика всех пользователей' })
  getAllStats() {
    return this.counterService.getAllStats();
  }
}
