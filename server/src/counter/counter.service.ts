// server/src/counter/counter.service.ts
import { Injectable } from '@nestjs/common';

interface UserCounter {
    count: number;
    lastRequestTime: number;
}

@Injectable()
export class CounterService {
    private userCounters = new Map<string, UserCounter>();

    increment(userId: string): number {
        const now = Date.now();
        const userCounter = this.userCounters.get(userId);

        if (!userCounter) {
            // Первый запрос от пользователя
            this.userCounters.set(userId, { count: 1, lastRequestTime: now });
            return 1;
        }

        // Проверяем, прошёл ли час с последнего запроса
        const hoursPassed = (now - userCounter.lastRequestTime) / 3600000;

        if (hoursPassed >= 1) {
            // Прошёл час - сбрасываем счётчик
            userCounter.count = 1;
        } else {
            // В течение часа - увеличиваем
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

    // Для отладки
    getAllCounters(): Map<string, UserCounter> {
        return new Map(this.userCounters);
    }
}