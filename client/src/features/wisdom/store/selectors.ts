import { RootState } from '@app/store';

export const selectQuoteText = (state: RootState) => state.wisdomQuote.text;
export const selectQuoteLoading = (state: RootState) => state.wisdomQuote.loading;
export const selectQuoteError = (state: RootState) => state.wisdomQuote.error;
export const selectHasQuote = (state: RootState) => !!state.wisdomQuote.text;
export const selectQuoteLength = (state: RootState) => state.wisdomQuote.text.length;