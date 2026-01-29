import { QuotesController } from '../quotes.controller';
import type { IQuotesService } from '../interfaces/quotes-service.interface';

describe('QuotesController - simple', () => {
  let controller: QuotesController;

  const mockQuotesService: IQuotesService = {
    getAllQuotes: jest.fn(),
    getRandomQuote: jest.fn(),
    getRandomQuoteWithStats: jest.fn(),
    createQuote: jest.fn(),
  };

  beforeEach(() => {
    controller = new QuotesController(
      mockQuotesService,
      {} as any, // Мок для counterService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all quotes', () => {
    const mockResult = {
      quotes: ['Quote 1', 'Quote 2'],
      total: 2,
      timestamp: '2024-01-01T00:00:00.000Z',
    };

    mockQuotesService.getAllQuotes = jest.fn().mockReturnValue(mockResult);

    const result = controller.getAllQuotes();

    expect(result).toEqual(mockResult);
    expect(mockQuotesService.getAllQuotes).toHaveBeenCalledTimes(1);
  });
});
