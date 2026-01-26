import { useCallback, useState, useEffect } from 'react';
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

    // Селекторы
    const quote = useSelector(selectQuoteText);
    const loading = useSelector(selectQuoteLoading);
    const error = useSelector(selectQuoteError);
    const sessionCount = useSelector(selectSessionCount);
    const totalCount = useSelector(selectTotalCount);
    const maxRequests = useSelector(selectMaxRequests);

    // Состояние UI
    const [uiStatus, setUiStatus] = useState(storage.getUIStatus());

    // ========== СИНХРОНИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
    useEffect(() => {
        console.log('🔧 useWisdomLogic: Initial sync with localStorage');

        // 1. Синхронизируем sessionCount
        const session = storage.getSession();
        const storedSessionCount = session?.count || 0;

        console.log('🔧 Stored sessionCount:', storedSessionCount);
        console.log('🔧 Redux sessionCount:', sessionCount);

        if (storedSessionCount !== sessionCount) {
            console.log('🔧 Syncing sessionCount:', storedSessionCount);
            dispatch(setSessionCount(storedSessionCount));
        }

        // 2. Обновляем UI статус
        setUiStatus(storage.getUIStatus());

    }, [dispatch]); // ← Только при монтировании

    // Обновляем статус каждую секунду
    useEffect(() => {
        const interval = setInterval(() => {
            // Проверяем, не истёк ли таймер
            const wasReset = storage.checkAndResetIfExpired();

            if (wasReset) {
                console.log('🔄 Timer expired in interval check');
                // Получаем актуальное состояние из storage
                const session = storage.getSession();
                const currentCount = session?.count || 0;

                if (currentCount > 0) {
                    console.log('🔄 Resetting Redux session');
                    dispatch(resetSession());
                }
            }

            // Обновляем UI статус
            setUiStatus(storage.getUIStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatch]);
    const getWisdom = useCallback(async () => {
        // Проверяем, можно ли делать запрос
        if (!uiStatus.canMakeRequest) {
            console.log('Лимит исчерпан. Подождите:', storage.getTimeUntilReset());
            return;
        }

        try {
            const resultAction = await dispatch(fetchQuote() as any);

            if (fetchQuote.fulfilled.match(resultAction)) {
                // Регистрируем запрос в storage
                storage.registerRequest();

                // Обновляем Redux
                dispatch(incrementSession());

                // Обновляем общий счётчик
                const newTotalCount = totalCount + 1;
                storage.setTotalCount(newTotalCount);

                // Сохраняем в историю
                const session = storage.getSession();
                storage.addToHistory({
                    quote: resultAction.payload.text,
                    sessionCount: session?.count || 0, // ← Из storage
                    totalCount: newTotalCount,
                });

                // Обновляем UI статус
                setUiStatus(storage.getUIStatus());

            } else if (fetchQuote.rejected.match(resultAction)) {
                const errorMessage = getErrorMessage(resultAction);
                if (isRateLimitError(errorMessage)) {
                    // Если получили 429 - блокируем
                    handleRateLimitError();
                }
            }
        } catch (err: any) {
            console.error('Ошибка в getWisdom:', err);
            if (isRateLimitError(err.message)) {
                handleRateLimitError();
            }
        }
    }, [dispatch, totalCount, uiStatus.canMakeRequest]);

    const handleRateLimitError = useCallback(() => {
        console.log('🚨 Rate limit error detected');

        // Всё через storage
        storage.startTimer();
        storage.setSession(maxRequests);

        // Синхронизируем Redux
        dispatch(setSessionCount(maxRequests));
        setUiStatus(storage.getUIStatus());
    }, [dispatch, maxRequests]);

    const resetLimit = useCallback(() => {
        storage.resetAll();
        dispatch(resetSession());
        dispatch(clearQuote());
        setUiStatus(storage.getUIStatus());
    }, [dispatch]);

    return {
        quote,
        loading,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        remainingRequests: uiStatus.remainingRequests,
        canMakeRequest: uiStatus.canMakeRequest,
        timeLeft: uiStatus.timeLeft,
        shouldShowTimer: uiStatus.shouldShowTimer,
        isTimerActive: uiStatus.isTimerActive,
        isLimitExhausted: uiStatus.isLimitExhausted,
        formatTime: storage.formatTime,
        getWisdom,
        resetLimit,
    };
};

// Вспомогательные функции остаются без изменений
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
        message.includes('Too Many Requests') ||
        message.includes('rate limit') ||
        message.includes('лимит');
};