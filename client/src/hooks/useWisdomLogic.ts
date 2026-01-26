import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchQuote,
    clearQuote,
    selectQuoteText,
    selectQuoteLoading,
    selectQuoteError
} from '../store/export';
import {
    incrementSession,
    resetSession,
    setSessionCount,
    selectSessionCount,
    selectTotalCount,
    selectMaxRequests
} from '../store/export';
import { storage } from '../utils/storage';

export const useWisdomLogic = () => {
    const dispatch = useDispatch();

    // Селекторы через отдельные функции
    const quote = useSelector(selectQuoteText);
    const loading = useSelector(selectQuoteLoading);
    const error = useSelector(selectQuoteError);
    const sessionCount = useSelector(selectSessionCount);
    const totalCount = useSelector(selectTotalCount);
    const maxRequests = useSelector(selectMaxRequests);

    const remainingRequests = maxRequests - sessionCount;

    const getWisdom = useCallback(async () => {
        if (sessionCount >= maxRequests) {
            dispatch(clearQuote());
            return;
        }

        try {
            const resultAction = await dispatch(fetchQuote() as any);

            if (fetchQuote.fulfilled.match(resultAction)) {
                dispatch(incrementSession());

                const newSessionCount = sessionCount + 1;
                const newTotalCount = totalCount + 1;

                // Сохраняем в storage
                storage.setSession(newSessionCount);
                storage.setTotalCount(newTotalCount);
                storage.addToHistory({
                    quote: resultAction.payload.text,
                    sessionCount: newSessionCount,
                    totalCount: newTotalCount,
                });

            } else if (fetchQuote.rejected.match(resultAction)) {
                const errorMessage = getErrorMessage(resultAction);

                if (isRateLimitError(errorMessage)) {
                    dispatch(setSessionCount(maxRequests));
                    storage.setSession(maxRequests);
                }
            }
        } catch (err: any) {
            console.error('Ошибка в getWisdom:', err);
            if (isRateLimitError(err.message)) {
                dispatch(setSessionCount(maxRequests));
            }
        }
    }, [dispatch, sessionCount, maxRequests, totalCount]);

    const handleResetLimit = useCallback(() => {
        dispatch(resetSession());
        dispatch(clearQuote());
        storage.clearSession();
    }, [dispatch]);

    return {
        quote,
        loading,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        remainingRequests,
        getWisdom,
        handleResetLimit,
    };
};

// Вспомогательные функции
const getErrorMessage = (resultAction: any): string => {
    if (typeof resultAction.error?.message === 'string') {
        return resultAction.error.message;
    }
    if (typeof resultAction.payload === 'string') {
        return resultAction.payload;
    }
    return '';
};

const isRateLimitError = (message: string): boolean => {
    return message.includes('Стетхем') ||
        message.includes('429') ||
        message.includes('Too Many Requests');
};