import { Controller, Get, Param, Req, Inject } from '@nestjs/common';
import type { Request } from 'express';
import type { ICounterService } from './counter.service.interface';

interface RequestWithUserId extends Request {
  userId?: string;
}

@Controller('api/counter')
export class CounterController {
  constructor(
    @Inject('ICounterService') private readonly counterService: ICounterService,
  ) {}

  @Get()
  getMyCount(@Req() req: RequestWithUserId) {
    const userId = req.userId || 'anonymous';
    const count = this.counterService.getCount(userId);

    return {
      userId,
      count,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':userId')
  getCount(@Param('userId') userId: string) {
    const count = this.counterService.getCount(userId);

    return {
      userId,
      count,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats/all')
  getAllStats() {
    const counters = this.counterService.getAllCounters();

    // Безопасное преобразование Map в объект
    const countersObject: Record<string, number> = {};
    counters.forEach((value, key) => {
      countersObject[key] = value.count; // Извлекаем только count из UserCounter
    });

    return {
      totalUsers: counters.size,
      counters: countersObject,
      timestamp: new Date().toISOString(),
    };
  }
}
