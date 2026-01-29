import { Test } from '@nestjs/testing';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  let service: CounterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CounterService],
    }).compile();

    service = module.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('increment', () => {
    it('should increment count for user', () => {
      const userId = 'test-user';

      const count1 = service.increment(userId);
      const count2 = service.increment(userId);

      expect(count1).toBe(1);
      expect(count2).toBe(2);
    });

    it('should handle multiple users independently', () => {
      const user1 = 'user-1';
      const user2 = 'user-2';

      const count1 = service.increment(user1);
      const count2 = service.increment(user2);
      const count3 = service.increment(user1);

      expect(count1).toBe(1);
      expect(count2).toBe(1);
      expect(count3).toBe(2);
    });
  });

  describe('getCount', () => {
    it('should return 0 for new user', () => {
      const count = service.getCount('new-user');
      expect(count).toBe(0);
    });

    it('should return current count for existing user', () => {
      const userId = 'test-user';
      service.increment(userId);
      service.increment(userId);

      const count = service.getCount(userId);
      expect(count).toBe(2);
    });
  });

  describe('getStats', () => {
    it('should return stats for user', () => {
      const userId = 'test-user';
      service.increment(userId);

      const stats = service.getStats(userId);

      expect(stats.userId).toBe(userId);
      expect(stats.count).toBe(1);
      expect(stats.totalCount).toBe(1);
      expect(stats.lastRequestTime).toBeInstanceOf(Date);
    });
  });

  describe('resetUser', () => {
    it('should reset user count', () => {
      const userId = 'test-user';
      service.increment(userId);
      service.increment(userId);

      expect(service.getCount(userId)).toBe(2);

      service.resetUser(userId);

      expect(service.getCount(userId)).toBe(0);
    });
  });
});
