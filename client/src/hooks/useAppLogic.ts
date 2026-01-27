import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { loadFromStorage } from '@/features/counter/store/counterSlice';
import { useWisdomLogic } from '@/features/wisdom/hooks/useWisdomLogic/useWisdomLogic'; // ← НОВЫЙ ПУТЬ

export const useAppLogic = () => {
    const dispatch = useDispatch();
    const [showQuoteWithDelay, setShowQuoteWithDelay] = useState(false);
    const [isLoadingManual, setIsLoadingManual] = useState(false);
    const [hasInitialClick, setHasInitialClick] = useState(false);

    // Инициализация
    useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    // Логика цитат
    const {
        quote,
        loading,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        remainingRequests,
        timeLeft,
        shouldShowTimer,
        isLimitExhausted,
        formatTime,
        getWisdom,
    } = useWisdomLogic();

    // Обработчик получения цитаты
    const handleGetWisdom = useCallback(async () => {
        if (!hasInitialClick) {
            setHasInitialClick(true);
        }

        setIsLoadingManual(true);

        try {
            await getWisdom();
        } catch (err) {
            setIsLoadingManual(false);
            setHasInitialClick(false);
        }

        setTimeout(() => {
            setIsLoadingManual(false);
        }, 2000);
    }, [hasInitialClick, getWisdom]);

    // Сброс при отсутствии цитаты
    useEffect(() => {
        if (!quote) {
            setHasInitialClick(false);
            setIsLoadingManual(false);
            setShowQuoteWithDelay(false);
        }
    }, [quote]);

    // Задержка показа цитаты
    useEffect(() => {
        if (quote && !loading) {
            setShowQuoteWithDelay(false);
            const timer = setTimeout(() => {
                setShowQuoteWithDelay(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [quote, loading]);

    const totalLoading = loading || isLoadingManual;
    const showInitialButton = !quote && !hasInitialClick;

    return {
        // Состояния
        quote,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        remainingRequests,
        timeLeft,
        shouldShowTimer,
        isLimitExhausted,
        totalLoading,
        showQuoteWithDelay,
        showInitialButton,

        // Функции
        formatTime,
        handleGetWisdom,
    };
};