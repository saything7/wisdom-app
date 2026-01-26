import { configureStore } from '@reduxjs/toolkit';
import quoteReducer from './quoteSlice';
import counterReducer from './counterSlice';

export const store = configureStore({
    reducer: {
        quote: quoteReducer,
        counter: counterReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['quote/fetchQuote/fulfilled', 'quote/fetchQuote/rejected'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;