export interface ICounterService {
  increment(userId: string): number;
  getCount(userId: string): number;
  resetUser(userId: string): void;
  getAllCounters(): Map<string, { count: number; lastRequestTime: number }>;
}
