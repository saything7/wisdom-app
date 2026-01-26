import { Controller, Get, Param, Inject } from '@nestjs/common';
import type { ICounterService } from './counter.service.interface';

@Controller('api/counter')
export class CounterController {
  constructor(
    @Inject('ICounterService') private readonly counterService: ICounterService,
  ) {}

  @Get(':userId')
  getCount(@Param('userId') userId: string) {
    return {
      userId,
      count: this.counterService.getCount(userId),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats/all')
  getAllStats() {
    const counters = this.counterService.getAllCounters();
    return {
      totalUsers: counters.size,
      counters: Object.fromEntries(counters),
      timestamp: new Date().toISOString(),
    };
  }
}
