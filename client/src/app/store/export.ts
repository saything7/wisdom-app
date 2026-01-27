// Реэкспорт всего из одного места
export { store } from './index';
export type { RootState, AppDispatch } from './index';

// Wisdom фича
export { fetchQuote, clearQuote, setError } from '@/features/wisdom/store/quoteSlice';
export {
    selectQuoteText,
    selectQuoteLoading,
    selectQuoteError,
    selectHasQuote,
    selectQuoteLength,
} from '@/features/wisdom/store/selectors';

// Counter фича
export {
    incrementSession,
    resetSession,
    setSessionCount,
    loadFromStorage,
} from '@/features/counter/store/counterSlice';
export {
    selectSessionCount,
    selectTotalCount,
    selectMaxRequests,
} from '@/features/counter/store/selectors';