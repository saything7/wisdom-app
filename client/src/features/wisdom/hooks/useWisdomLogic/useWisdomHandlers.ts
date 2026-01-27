import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { storage } from '@/utils/storage';
import { AppDispatch } from '@/app/store'; // ← Добавьте этот импорт если нужно

// Импорты actions из новых мест
import { fetchQuote, clearQuote } from '@/features/wisdom/store/quoteSlice';
import {
    incrementSession,
    setSessionCount,
    resetSession,
} from '@/features/counter/store/counterSlice';

import { getErrorMessage, isRateLimitError } from './helpers';

export const useWisdomHandlers = (maxRequests: number, totalCount: number) => {
    const dispatch = useDispatch<AppDispatch>(); // ← Добавьте типизацию если используете TypeScript

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

    // Основной обработчик получения цитаты - ИСПРАВЛЕННАЯ ВЕРСИЯ
    const getWisdomHandler = useCallback(async (uiStatus: any) => {
        console.log('getWisdomHandler called, canMakeRequest:', uiStatus.canMakeRequest);

        if (!uiStatus.canMakeRequest) {
            console.log('❌ Cannot make request, limit exhausted');
            return null;
        }

        try {
            console.log('🔄 Fetching quote...');
            // Явно указываем тип dispatch
            const resultAction = await dispatch(fetchQuote());

            if (fetchQuote.fulfilled.match(resultAction)) {
                console.log('✅ Quote fetched successfully:', resultAction.payload);
                return handleSuccessfulQuote(resultAction.payload.text);
            }

            if (fetchQuote.rejected.match(resultAction)) {
                console.error('❌ Quote fetch rejected:', resultAction);
                const errorMessage = getErrorMessage(resultAction);

                if (isRateLimitError(errorMessage)) {
                    console.log('🔄 Handling rate limit error');
                    return handleRateLimitError();
                }

                // Бросаем ошибку дальше, но без "throw new Error" чтобы не дублировать
                throw new Error(`API Error: ${errorMessage}`);
            }
        } catch (error: any) {
            console.error('🔥 Error in getWisdomHandler:', error);

            // Проверяем, не rate limit ли это
            const errorMsg = error?.message || error?.toString() || 'Unknown error';

            if (isRateLimitError(errorMsg)) {
                console.log('🔄 Handling rate limit error in catch');
                return handleRateLimitError();
            }

            // Бросаем ошибку дальше
            throw error;
        }

        return null;
    }, [dispatch, handleSuccessfulQuote, handleRateLimitError]);

    // Сброс лимита
    const resetLimitHandler = useCallback(() => {
        console.log('🔄 Resetting limit...');
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