import { createSlice, PayloadAction } from '@reduxjs/toolkit';
<<<<<<< Updated upstream:client/src/store/counterSlice.ts
=======
import { storage } from '../../../utils/storage'; // ← ДОБАВЬ ИМПОРТ!
>>>>>>> Stashed changes:client/src/features/counter/store/counterSlice.ts

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

export const counterSlice = createSlice({  // Добавляем export здесь!
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
            const savedSession = localStorage.getItem('wisdomSession');
            const savedTotal = localStorage.getItem('wisdomTotalCount');

            if (savedSession) {
                try {
                    const sessionData = JSON.parse(savedSession);
                    const sessionStart = new Date(sessionData.timestamp);
                    const now = new Date();
                    const diffMinutes = (now.getTime() - sessionStart.getTime()) / (1000 * 60);

                    if (diffMinutes < 1) {
                        state.sessionCount = sessionData.count || 0;
                    } else {
                        localStorage.removeItem('wisdomSession');
                    }
                } catch (err) {
                    console.error('Ошибка при загрузке сессии:', err);
                }
            }

            if (savedTotal) {
                const total = parseInt(savedTotal, 10);
                if (!isNaN(total)) {
                    state.totalCount = total;
                }
            }
        },
    },
});

// Экспортируем actions
export const {
    incrementSession,
    incrementTotal,
    resetSession,
    setSessionCount,
    setMaxRequests,
    loadFromStorage,
} = counterSlice.actions;

// Экспортируем reducer
export default counterSlice.reducer;

// Экспортируем сам slice (опционально)