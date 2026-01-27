import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { storage } from '@/utils/storage';
import { useWisdomSync } from './useWisdomSync';
import { useWisdomHandlers } from './useWisdomHandlers';
import { UIStatus } from './constants';

// Импорты селекторов из новых мест
import {
    selectQuoteText,
    selectQuoteLoading,
    selectQuoteError,
} from '@features/wisdom/store/selectors';

import {
    selectSessionCount,
    selectTotalCount,
    selectMaxRequests,
} from '@features/counter/store/selectors';

export const useWisdomLogic = () => {
    // ========== REDUX СЕЛЕКТОРЫ ==========
    const quote = useSelector(selectQuoteText);
    const loading = useSelector(selectQuoteLoading);
    const error = useSelector(selectQuoteError);
    const sessionCount = useSelector(selectSessionCount);
    const totalCount = useSelector(selectTotalCount);
    const maxRequests = useSelector(selectMaxRequests);

    // ========== ЛОКАЛЬНОЕ СОСТОЯНИЕ ==========
    const [uiStatus, setUiStatus] = useState<UIStatus>(storage.getUIStatus());

    // ========== КАСТОМНЫЕ ХУКИ ==========
    const { syncInitialState, checkAndResetTimer, subscribeToStorageChanges } = useWisdomSync();
    const { getWisdomHandler, resetLimitHandler } = useWisdomHandlers(maxRequests, totalCount);

    // ========== ЭФФЕКТЫ ==========

    // Инициализация и синхронизация
    useEffect(() => {
        syncInitialState();
        setUiStatus(storage.getUIStatus());
    }, [syncInitialState]);

    // Подписка на обновления
    useEffect(() => {
        const unsubscribe = subscribeToStorageChanges(() => {
            const wasReset = checkAndResetTimer();
            if (wasReset) {
                setUiStatus(storage.getUIStatus());
            } else {
                // Обновляем статус каждую секунду
                setUiStatus(prev => {
                    const newStatus = storage.getUIStatus();
                    // Оптимизация: обновляем только если что-то изменилось
                    if (JSON.stringify(prev) !== JSON.stringify(newStatus)) {
                        return newStatus;
                    }
                    return prev;
                });
            }
        });

        return unsubscribe;
    }, [subscribeToStorageChanges, checkAndResetTimer]);

    // ========== ПУБЛИЧНЫЕ МЕТОДЫ ==========
    const getWisdom = async () => {
        try {
            await getWisdomHandler(uiStatus);
            setUiStatus(storage.getUIStatus());
        } catch (error) {
            console.error('Failed to get wisdom:', error);
        }
    };

    const resetLimit = () => {
        const newStatus = resetLimitHandler();
        setUiStatus(newStatus);
    };

    // ========== ВОЗВРАЩАЕМЫЕ ЗНАЧЕНИЯ ==========
    return {
        // Данные
        quote,
        loading,
        error,

        // Статистика
        sessionCount,
        totalCount,
        maxRequests,

        // UI статус
        remainingRequests: uiStatus.remainingRequests,
        canMakeRequest: uiStatus.canMakeRequest,
        timeLeft: uiStatus.timeLeft,
        shouldShowTimer: uiStatus.shouldShowTimer,
        isTimerActive: uiStatus.isTimerActive,
        isLimitExhausted: uiStatus.isLimitExhausted,

        // Методы
        formatTime: storage.formatTime,
        getWisdom,
        resetLimit,
    };
};