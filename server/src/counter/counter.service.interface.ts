export interface ICounterService {
  increment(userId: string): number;
  getCount(userId: string): number;
  resetUser(userId: string): void;
}
