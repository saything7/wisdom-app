// counter/interfaces/counter-service.interface.ts
export interface UserCounter {
  count: number; // текущая сессия (за 1 час)
  totalCount: number; // общее количество за всё время
  lastRequestTime: number;
}

export interface CounterStats {
  userId: string;
  count: number;
  totalCount: number;
  lastRequestTime?: Date;
}

export interface AllStatsResponse {
  totalUsers: number;
  counters: Record<string, CounterStats>;
  timestamp: string;
}

export interface ICounterService {
  increment(userId: string): number;
  getCount(userId: string): number;
  getTotalCount(userId: string): number;
  getStats(userId: string): CounterStats;
  resetUser(userId: string): void;
  getAllCounters(): Map<string, UserCounter>;
  getAllStats(): AllStatsResponse;
}
