import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { WISDOM_API_CONFIG } from '../api/config';

// Модель
export interface QuoteState {
    text: string;
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

const initialState: QuoteState = {
    text: '',
    loading: false,
    error: null,
    lastUpdated: null,
};

// Async thunk для получения цитаты
export const fetchQuote = createAsyncThunk(
    'wisdom/fetchQuote',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🌐 Fetching quote from API...');
            const response = await fetch(
                `${WISDOM_API_CONFIG.BASE_URL}${WISDOM_API_CONFIG.ENDPOINTS.RANDOM_QUOTE}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 429) {
                    return rejectWithValue('Стетхем устал. Попробуйте позже!');
                }
                return rejectWithValue(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            console.log('📥 API response:', data);

            return {
                text: data.quote || '',
                count: data.count || 0,
            };
        } catch (error: any) {
            console.error('❌ Error in fetchQuote:', error);
            return rejectWithValue(error.message || 'Неизвестная ошибка');
        }
    }
);

const quoteSlice = createSlice({
    name: 'wisdom/quote', // ← Изменяем имя
    initialState,
    reducers: {
        clearQuote: (state) => {
            state.text = '';
            state.error = null;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuote.fulfilled, (state, action) => {
                state.loading = false;
                state.text = action.payload.text;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchQuote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearQuote, setError } = quoteSlice.actions;
export default quoteSlice.reducer;