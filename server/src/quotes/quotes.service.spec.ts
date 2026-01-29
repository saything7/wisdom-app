import { Test } from '@nestjs/testing';
import { QuotesService } from './quotes.service';

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuotesService,
        {
          provide: 'ICounterService',
          useValue: {
            increment: jest.fn().mockResolvedValue(1),
            getCount: jest.fn().mockResolvedValue(1),
            getTotalCount: jest.fn().mockResolvedValue(5),
            getStats: jest.fn(),
            resetUser: jest.fn(),
            getAllCounters: jest.fn(),
            getAllStats: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a quote', () => {
    const quote = service.getRandomQuote();
    expect(typeof quote).toBe('string');
    expect(quote.length).toBeGreaterThan(0);
  });
});
