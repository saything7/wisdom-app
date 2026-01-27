import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { storage } from '@/utils/storage';

// Импорты actions из новых мест
import { fetchQuote, clearQuote } from '@features/wisdom/store/quoteSlice';
import {
    incrementSession,
    setSessionCount,
    resetSession,
} from '@features/counter/store/counterSlice';

import { getErrorMessage, isRateLimitError } from './helpers';

export const useWisdomHandlers = (maxRequests: number, totalCount: number) => {
    const dispatch = useDispatch();

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
        console.log('🚨 Rate limit error detected');

        storage.startTimer();
        storage.setSession(maxRequests);
        dispatch(setSessionCount(maxRequests));

        return storage.getUIStatus();
    }, [dispatch, maxRequests]);

    // Основной обработчик получения цитаты
    const getWisdomHandler = useCallback(async (uiStatus: any) => {
        if (!uiStatus.canMakeRequest) {
            return null;
        }

        try {
            const resultAction = await dispatch(fetchQuote() as any);

            if (fetchQuote.fulfilled.match(resultAction)) {
                return handleSuccessfulQuote(resultAction.payload.text);
            }

            if (fetchQuote.rejected.match(resultAction)) {
                const errorMessage = getErrorMessage(resultAction);
                if (isRateLimitError(errorMessage)) {
                    handleRateLimitError();
                }
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            if (isRateLimitError(error.message)) {
                handleRateLimitError();
            }
            throw error;
        }
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