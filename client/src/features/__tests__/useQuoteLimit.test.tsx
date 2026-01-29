import { renderHook, act } from '@testing-library/react';
import { useQuoteLimit } from '@/features/wisdom/hooks/useQuoteLimit/useQuoteLimit';

// Мокаем localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useQuoteLimit', () => {
    beforeEach(() => {
        localStorageMock.clear();
        jest.clearAllMocks();

        // Мокаем Date.now для фиксированного времени
        jest.spyOn(Date, 'now').mockReturnValue(1000000000000);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize with default values when localStorage is empty', () => {
        const { result } = renderHook(() => useQuoteLimit());

        expect(result.current.quotesUsed).toBe(0);
        expect(result.current.isLimitExhausted).toBe(false);
        expect(result.current.quotesLeft).toBe(3);
    });

    it('should increment quotes count up to 3', () => {
        const { result } = renderHook(() => useQuoteLimit());

        // Первая цитата
        act(() => {
            result.current.incrementQuotes();
        });
        expect(result.current.quotesUsed).toBe(1);
        expect(result.current.quotesLeft).toBe(2);

        // Вторая цитата
        act(() => {
            result.current.incrementQuotes();
        });
        expect(result.current.quotesUsed).toBe(2);
        expect(result.current.quotesLeft).toBe(1);

        // Третья цитата
        act(() => {
            result.current.incrementQuotes();
        });
        expect(result.current.quotesUsed).toBe(3);
        expect(result.current.isLimitExhausted).toBe(true);
        expect(result.current.quotesLeft).toBe(0);

        // Четвертая цитата (не должна увеличивать)
        act(() => {
            result.current.incrementQuotes();
        });
        expect(result.current.quotesUsed).toBe(3); // Остается 3
        expect(result.current.isLimitExhausted).toBe(true);
    });

    it('should reset limit correctly', () => {
        localStorageMock.setItem('quotesUsed', '2');

        const { result } = renderHook(() => useQuoteLimit());

        act(() => {
            result.current.resetLimit();
        });

        expect(result.current.quotesUsed).toBe(0);
        expect(result.current.isLimitExhausted).toBe(false);
        expect(result.current.quotesLeft).toBe(3);
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('quotesUsed');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('limitExhaustedTime');
    });
});