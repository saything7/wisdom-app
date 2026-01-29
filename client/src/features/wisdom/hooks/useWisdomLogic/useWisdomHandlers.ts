import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { storage } from '@/utils/storage';
import { AppDispatch } from '@/app/store';

// Импорты actions
import { fetchQuote, clearQuote } from '@/features/wisdom/store/quoteSlice';
import {
    incrementSession,
    setSessionCount,
    resetSession,
} from '@/features/counter/store/counterSlice';

import { getErrorMessage, isRateLimitError } from './helpers';

// Интерфейс для UI статуса
interface UIStatus {
    canMakeRequest: boolean;
    remainingRequests: number;
    timeLeft: number;
    shouldShowTimer: boolean;
    isTimerActive: boolean;
    isLimitExhausted: boolean;
}

export const useWisdomHandlers = (maxRequests: number, totalCount: number) => {
    const dispatch = useDispatch<AppDispatch>();

    // Обработка успешного получения цитаты
    const handleSuccessfulQuote = useCallback((quoteText: string) => {
        storage.registerRequest();
        dispatch(incrementSession());

        const newTotalCount = totalCount + 1;
        storage.setTotalCount(newTotalCount);

        const session = storage.getSession();
        storage.addToHistory({
            quote: quoteText,
            sessionCount: session?.count || 0,
            totalCount: newTotalCount,
        });

        return newTotalCount;
    }, [dispatch, totalCount]);

    // Обработка ошибки лимита запросов
    const handleRateLimitError = useCallback(() => {
        storage.startTimer();
        storage.setSession(maxRequests);
        dispatch(setSessionCount(maxRequests));

        return storage.getUIStatus();
    }, [dispatch, maxRequests]);

    // Основной обработчик получения цитаты
    const getWisdomHandler = useCallback(async (uiStatus: UIStatus) => {
        if (!uiStatus.canMakeRequest) {
            return null;
        }

        try {
            const resultAction = await dispatch(fetchQuote());

            if (fetchQuote.fulfilled.match(resultAction)) {
                const payload = resultAction.payload as { text?: string };
                const quoteText = payload?.text || 'No quote text';
                return handleSuccessfulQuote(quoteText);
            }

            if (fetchQuote.rejected.match(resultAction)) {
                console.error('❌ Quote fetch rejected:', resultAction);
                const errorMessage = getErrorMessage(resultAction);

                if (isRateLimitError(errorMessage)) {
                    return handleRateLimitError();
                }

                throw new Error(`API Error: ${errorMessage}`);
            }
        } catch (error) {  // <-- УБРАЛИ `: unknown`
            console.error('🔥 Error in getWisdomHandler:', error);

            let errorMsg = 'Unknown error';

            if (error instanceof Error) {
                errorMsg = error.message;
            } else if (typeof error === 'string') {
                errorMsg = error;
            } else if (error && typeof error === 'object' && 'message' in error) {
                errorMsg = String((error as { message?: unknown }).message);
            }

            if (isRateLimitError(errorMsg)) {
                return handleRateLimitError();
            }

            throw error;
        }

        return null;
    }, [dispatch, handleSuccessfulQuote, handleRateLimitError]);
    // Сброс лимита
    const resetLimitHandler = useCallback(() => {
        storage.resetAll();
        dispatch(resetSession());
        dispatch(clearQuote());
        return storage.getUIStatus();
    }, [dispatch]);

    return {
        getWisdomHandler,
        resetLimitHandler,
        handleRateLimitError,
        handleSuccessfulQuote,
    };
};