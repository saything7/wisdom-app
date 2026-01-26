import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '../utils/storage'; // ← ДОБАВЬ ИМПОРТ!

interface CounterState {
    sessionCount: number;
    totalCount: number;
    maxRequests: number;
    lastReset: string | null;
}

const initialState: CounterState = {
    sessionCount: 0,
    totalCount: 0,
    maxRequests: 3,
    lastReset: null,
};

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementSession: (state) => {
            if (state.sessionCount < state.maxRequests) {
                state.sessionCount += 1;
                state.totalCount += 1;
            }
        },
        incrementTotal: (state) => {
            state.totalCount += 1;
        },
        resetSession: (state) => {
            state.sessionCount = 0;
            state.lastReset = new Date().toISOString();
        },
        setSessionCount: (state, action: PayloadAction<number>) => {
            state.sessionCount = action.payload;
        },
        setMaxRequests: (state, action: PayloadAction<number>) => {
            state.maxRequests = action.payload;
        },
        loadFromStorage: (state) => {
            console.log('📂 loadFromStorage: Loading from storage');

            // Просто синхронизируем с storage.ts
            // Вся логика таймера уже в storage.ts
            const session = storage.getSession();
            state.sessionCount = session?.count || 0;

            const totalCount = storage.getTotalCount();
            state.totalCount = totalCount;

            console.log('📂 Loaded - sessionCount:', state.sessionCount, 'totalCount:', state.totalCount);
        },
    },
});

// Экспортируем actions
export const {
    incrementSession,
    resetSession,
    setSessionCount,
    loadFromStorage,
} = counterSlice.actions;

// Экспортируем reducer
export default counterSlice.reducer;