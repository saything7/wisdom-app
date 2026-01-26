import { Injectable } from '@nestjs/common';
import { ICounterService } from './counter.service.interface';

interface UserCounter {
  count: number;
  lastRequestTime: number;
}

@Injectable()
export class CounterService implements ICounterService {
  private userCounters = new Map<string, UserCounter>();
  private readonly RESET_INTERVAL = 30000; // 30 секунд

  increment(userId: string): number {
    const now = Date.now();
    const userCounter = this.userCounters.get(userId);

    if (!userCounter) {
      this.userCounters.set(userId, { count: 1, lastRequestTime: now });
      return 1;
    }

    const timePassed = now - userCounter.lastRequestTime;

    if (timePassed >= this.RESET_INTERVAL) {
      userCounter.count = 1;
    } else {
      userCounter.count++;
    }

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
