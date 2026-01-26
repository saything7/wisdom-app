// server/src/counter/counter.service.ts
import { Injectable } from '@nestjs/common';

interface UserCounter {
  count: number;
  lastRequestTime: number;
}

// server/src/counter/counter.service.ts
@Injectable()
export class CounterService {
  private userCounters = new Map<string, UserCounter>();
  private readonly RESET_INTERVAL = 30000; // 30 секунд

  increment(userId: string): number {
    const now = Date.now();
    const userCounter = this.userCounters.get(userId);

    console.log(`=== CounterService.increment для ${userId} ===`);
    console.log(`Текущее время: ${now}`);

    if (!userCounter) {
      console.log(`Новый пользователь, счет: 1`);
      this.userCounters.set(userId, { count: 1, lastRequestTime: now });
      return 1;
    }

    const timePassed = now - userCounter.lastRequestTime;
    console.log(`Прошло времени: ${timePassed}мс (${timePassed / 1000} сек)`);
    console.log(`Старый счет: ${userCounter.count}`);

    if (timePassed >= this.RESET_INTERVAL) {
      console.log(`СБРОС! Интервал ${this.RESET_INTERVAL}мс пройден`);
      userCounter.count = 1;
    } else {
      userCounter.count++;
    }

    console.log(`Новый счет: ${userCounter.count}`);
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

  // Для отладки
  getAllCounters(): Map<string, UserCounter> {
    return new Map(this.userCounters);
  }
}
