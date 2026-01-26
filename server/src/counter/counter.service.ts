import { Injectable } from '@nestjs/common';
import { ICounterService } from './counter.service.interface';

interface UserCounter {
  count: number;
  lastRequestTime: number;
}

@Injectable()
export class CounterService implements ICounterService {
  private userCounters = new Map<string, UserCounter>();

  increment(userId: string): number {
    const now = Date.now();
    let userCounter = this.userCounters.get(userId);

    if (!userCounter) {
      userCounter = { count: 1, lastRequestTime: now };
      this.userCounters.set(userId, userCounter);
      return 1;
    }

    // Всегда увеличиваем, без сброса
    userCounter.count++;
    userCounter.lastRequestTime = now;
    return userCounter.count;
  }
  getCount(userId: string): number {
    const counter = this.userCounters.get(userId);
    return counter ? counter.count : 0;
  }

  resetUser(userId: string): void {
    this.userCounters.delete(userId);
  }

  getAllCounters(): Map<string, UserCounter> {
    return new Map(this.userCounters);
  }
}
