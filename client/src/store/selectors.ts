import { RootState } from './index';

// ===== COUNTER SELECTORS =====
export const selectCounter = (state: RootState) => state.counter;
export const selectSessionCount = (state: RootState) => state.counter.sessionCount;
export const selectTotalCount = (state: RootState) => state.counter.totalCount;
export const selectMaxRequests = (state: RootState) => state.counter.maxRequests;
export const selectLastReset = (state: RootState) => state.counter.lastReset;

// Вычисляемые селекторы
export const selectRemainingRequests = (state: RootState) =>
    state.counter.maxRequests - state.counter.sessionCount;
export const selectIsLimitReached = (state: RootState) =>
    state.counter.sessionCount >= state.counter.maxRequests;
export const selectSessionProgress = (state: RootState) =>
    state.counter.sessionCount / state.counter.maxRequests;

// ===== QUOTE SELECTORS =====
export const selectQuote = (state: RootState) => state.quote;
export const selectQuoteText = (state: RootState) => state.quote.text;
export const selectQuoteLoading = (state: RootState) => state.quote.loading;
export const selectQuoteError = (state: RootState) => state.quote.error;
export const selectLastUpdated = (state: RootState) => state.quote.lastUpdated;

// Вычисляемые селекторы
export const selectHasQuote = (state: RootState) => !!state.quote.text;
export const selectQuoteLength = (state: RootState) => state.quote.text.length;