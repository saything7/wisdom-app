import { Test } from '@nestjs/testing';
import { QuotesService } from '../quotes.service';

describe('QuotesService - different random values', () => {
  let service: QuotesService;
  let mathRandomSpy: jest.SpyInstance;

  const mockCounterService = {
    increment: jest.fn().mockResolvedValue(1),
    getTotalCount: jest.fn().mockResolvedValue(100),
    getCount: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
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
  });

  it('should return different quotes for different random values', () => {
    const allQuotes = service.getAllQuotes().quotes;
    const collectedQuotes = new Set<string>();

    // Тестируем разные значения random
    const testValues = [0, 0.25, 0.5, 0.75, 0.99];

    testValues.forEach((value) => {
      mathRandomSpy.mockReturnValue(value);
      collectedQuotes.add(service.getRandomQuote());
    });

    // Если в базе достаточно цитат, должны получить разные
    if (allQuotes.length >= testValues.length) {
      expect(collectedQuotes.size).toBe(testValues.length);
    }
  });

  it('should calculate correct index for given random value', () => {
    const allQuotes = service.getAllQuotes().quotes;

    // Тест 1: random = 0.3, length = 10 → index = 3
    mathRandomSpy.mockReturnValue(0.3);
    const quote1 = service.getRandomQuote();
    const expectedIndex1 = Math.floor(0.3 * allQuotes.length);
    expect(quote1).toBe(allQuotes[expectedIndex1]);

    // Тест 2: random = 0.7, length = 10 → index = 7
    mathRandomSpy.mockReturnValue(0.7);
    const quote2 = service.getRandomQuote();
    const expectedIndex2 = Math.floor(0.7 * allQuotes.length);
    expect(quote2).toBe(allQuotes[expectedIndex2]);
  });
});
