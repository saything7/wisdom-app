// counter/counter.service.ts
import { Injectable,  Logger } from '@nestjs/common';
import {
  ICounterService,
  UserCounter,
  CounterStats,
  AllStatsResponse,
} from './interfaces/counter-service.interface';
import { COUNTER_CONSTANTS } from './constants/counter.constants';

@Injectable()
export class CounterService implements ICounterService {
  private readonly logger = new Logger(CounterService.name);
  private userCounters = new Map<string, UserCounter>();

  increment(userId: string): number {
    try {
      const now = Date.now();
      let userCounter = this.userCounters.get(userId);

      if (!userCounter) {
        userCounter = this.createNewCounter(userId, now);
        return userCounter.count;
      }

      this.updateCounter(userCounter, now);
      return userCounter.count;
    } catch (error) {
      this.logger.error(
        `Error incrementing counter for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  getCount(userId: string): number {
    const counter = this.userCounters.get(userId);
    return counter ? counter.count : COUNTER_CONSTANTS.INITIAL_COUNT;
  }

  getTotalCount(userId: string): number {
    const counter = this.userCounters.get(userId);
    return counter ? counter.totalCount : COUNTER_CONSTANTS.INITIAL_TOTAL_COUNT;
  }

  getStats(userId: string): CounterStats {
    const counter = this.userCounters.get(userId);

    if (!counter) {
      return {
        userId,
        count: COUNTER_CONSTANTS.INITIAL_COUNT,
        totalCount: COUNTER_CONSTANTS.INITIAL_TOTAL_COUNT,
      };
    }

    return {
      userId,
      count: counter.count,
      totalCount: counter.totalCount,
      lastRequestTime: new Date(counter.lastRequestTime),
    };
  }

  resetUser(userId: string): void {
    const counter = this.userCounters.get(userId);
    if (counter) {
      // Сбрасываем только count (сессию), totalCount сохраняем
      counter.count = COUNTER_CONSTANTS.INITIAL_COUNT;
      counter.lastRequestTime = Date.now();
      this.logger.log(`Counter reset for user: ${userId}`);
    }
  }

  getAllCounters(): Map<string, UserCounter> {
    return new Map(this.userCounters);
  }

  getAllStats(): AllStatsResponse {
    const countersObject: Record<string, CounterStats> = {};

    this.userCounters.forEach((value, key) => {
      countersObject[key] = {
        userId: key,
        count: value.count,
        totalCount: value.totalCount,
        lastRequestTime: new Date(value.lastRequestTime),
      };
    });

    return {
      totalUsers: this.userCounters.size,
      counters: countersObject,
      timestamp: new Date().toISOString(),
    };
  }

  // Приватные вспомогательные методы
  private createNewCounter(userId: string, timestamp: number): UserCounter {
    const newCounter: UserCounter = {
      count: 1,
      totalCount: 1,
      lastRequestTime: timestamp,
    };
    this.userCounters.set(userId, newCounter);
    this.logger.debug(`New counter created for user: ${userId}`);
    return newCounter;
  }

  private updateCounter(counter: UserCounter, now: number): void {
    const timeSinceLastRequest = now - counter.lastRequestTime;

    // Сброс счётчика сессии если прошло больше часа
    if (timeSinceLastRequest > COUNTER_CONSTANTS.HOUR_MS) {
      counter.count = 1;
    } else {
      counter.count++;
    }

    // Всегда увеличиваем totalCount
    counter.totalCount++;
    counter.lastRequestTime = now;
  }
}
