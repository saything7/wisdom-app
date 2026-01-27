export interface ICounterService {
  increment(userId: string): number;
  getTotalCount(userId: string): number; // ← ДОБАВИТЬ
  getCount(userId: string): number;
  resetUser(userId: string): void;
  getAllCounters(): Map<string, { count: number; lastRequestTime: number }>;
}
