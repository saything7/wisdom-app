import { Test } from '@nestjs/testing';
import { QuotesService } from '../quotes.service';

describe('QuotesService with mocked random', () => {
  let service: QuotesService;
  let mathRandomSpy: jest.SpyInstance;

  // Мок для ICounterService
  const mockCounterService = {
    increment: jest.fn().mockResolvedValue(1),
    getTotalCount: jest.fn().mockResolvedValue(100),
    getCount: jest.fn().mockResolvedValue(1),
    getStats: jest.fn(),
    resetUser: jest.fn(),
    getAllCounters: jest.fn(),
    getAllStats: jest.fn(),
  };

  beforeEach(async () => {
    // Создаем шпиона для Math.random до создания сервиса
    mathRandomSpy = jest.spyOn(Math, 'random');

    const module = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: 'ICounterService',
          useValue: mockCounterService,
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('getRandomQuote', () => {
    it('should always return first quote when Math.random returns 0', () => {
      // Мокаем Math.random возвращать 0
      mathRandomSpy.mockReturnValue(0);

      const allQuotes = service.getAllQuotes().quotes;
      const firstQuote = allQuotes[0];

      const quote1 = service.getRandomQuote();
      const quote2 = service.getRandomQuote();
      const quote3 = service.getRandomQuote();

      // Все вызовы должны вернуть первую цитату
      expect(quote1).toBe(firstQuote);
      expect(quote2).toBe(firstQuote);
      expect(quote3).toBe(firstQuote);
    });

    it('should always return second quote when Math.random returns 0.5', () => {
      // Мокаем Math.random возвращать 0.5
      mathRandomSpy.mockReturnValue(0.5);

      const allQuotes = service.getAllQuotes().quotes;
      // При Math.random() = 0.5, Math.floor(0.5 * length) даст индекс примерно в середине
      const expectedIndex = Math.floor(0.5 * allQuotes.length);
      const expectedQuote = allQuotes[expectedIndex];

      const quote1 = service.getRandomQuote();
      const quote2 = service.getRandomQuote();

      expect(quote1).toBe(expectedQuote);
      expect(quote2).toBe(expectedQuote);
    });

    it('should always return last quote when Math.random returns 0.999', () => {
      // Мокаем Math.random возвращать значение близкое к 1
      mathRandomSpy.mockReturnValue(0.999);

      const allQuotes = service.getAllQuotes().quotes;
      const lastIndex = allQuotes.length - 1;
      const expectedIndex = Math.floor(0.999 * allQuotes.length);
      // При 0.999 индекс будет последним или предпоследним
      const expectedQuote = allQuotes[Math.min(expectedIndex, lastIndex)];

      const quote = service.getRandomQuote();

      expect(quote).toBe(expectedQuote);
    });

    it('should handle empty quotes array', () => {
      // Временно подменяем массив цитат
      const originalQuotes = (service as any).quotes;
      (service as any).quotes = [];

      const result = service.getRandomQuote();
      expect(result).toBe('Нет доступных цитат.');

      // Восстанавливаем
      (service as any).quotes = originalQuotes;
    });
  });

  describe('getRandomQuoteWithStats with mocked random', () => {
    it('should return consistent quotes with same random value', async () => {
      // Фиксируем Math.random
      mathRandomSpy.mockReturnValue(0.25);

      const allQuotes = service.getAllQuotes().quotes;
      const expectedIndex = Math.floor(0.25 * allQuotes.length);
      const expectedQuote = allQuotes[expectedIndex];

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const userId = 'test-user';

      const result1 = await service.getRandomQuoteWithStats(
        userId,
        mockResponse,
      );
      const result2 = await service.getRandomQuoteWithStats(
        userId,
        mockResponse,
      );

      // Оба вызова должны вернуть одну и ту же цитату
      expect(result1.quote).toBe(expectedQuote);
      expect(result2.quote).toBe(expectedQuote);
      expect(result1.quote).toBe(result2.quote);

      // Проверяем структуру ответа
      expect(result1).toHaveProperty('count', 1);
      expect(result1).toHaveProperty('totalCount', 100);
      expect(result1).toHaveProperty('userId', 'test-user');
      expect(result1).toHaveProperty('timestamp');
    });

    it('should call counter service and set cookie', async () => {
      mathRandomSpy.mockReturnValue(0.1);

      const mockResponse = {
        cookie: jest.fn(),
      } as any;

      const userId = 'test-user';

      await service.getRandomQuoteWithStats(userId, mockResponse);

      // Проверяем вызовы counter service
      expect(mockCounterService.increment).toHaveBeenCalledWith(userId);
      expect(mockCounterService.getTotalCount).toHaveBeenCalledWith(userId);

      // Проверяем установку куки
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'totalCount',
        '100',
        expect.objectContaining({
          maxAge: 30 * 24 * 60 * 60 * 1000,
        }),
      );
    });
  });

  describe('Edge cases', () => {
    it('should work with Math.random returning exactly 0', () => {
      mathRandomSpy.mockReturnValue(0);

      const allQuotes = service.getAllQuotes().quotes;
      const quote = service.getRandomQuote();

      expect(quote).toBe(allQuotes[0]);
    });

    it('should work with Math.random returning just below 1', () => {
      mathRandomSpy.mockReturnValue(0.9999999999);

      const allQuotes = service.getAllQuotes().quotes;
      const quote = service.getRandomQuote();

      // Последний элемент массива
      expect(quote).toBe(allQuotes[allQuotes.length - 1]);
    });

    it('should handle single quote array', () => {
      const originalQuotes = (service as any).quotes;
      (service as any).quotes = ['Единственная цитата'];

      mathRandomSpy.mockReturnValue(0.5);
      const quote = service.getRandomQuote();

      expect(quote).toBe('Единственная цитата');

      (service as any).quotes = originalQuotes;
    });
  });
});
