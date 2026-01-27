import { configureStore } from '@reduxjs/toolkit';
import quoteReducer from '@features/wisdom/store/quoteSlice';
import counterReducer from '@features/counter/store/counterSlice';

export const store = configureStore({
    reducer: {
        wisdomQuote: quoteReducer,    // ← Прямо в корне
        counter: counterReducer,      // ← Прямо в корне, без вложенности
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['wisdomQuote/fetchQuote/fulfilled', 'wisdomQuote/fetchQuote/rejected'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;