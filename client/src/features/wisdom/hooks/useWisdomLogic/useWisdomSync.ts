import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { storage } from '@/utils/storage';
import { resetSession, setSessionCount } from '@features/counter/store/counterSlice';

export const useWisdomSync = () => {
    const dispatch = useDispatch();

    // Начальная синхронизация при монтировании
    const syncInitialState = useCallback(() => {
        const session = storage.getSession();
        const storedSessionCount = session?.count || 0;
        dispatch(setSessionCount(storedSessionCount));
        return storedSessionCount;
    }, [dispatch]);

    // Проверка и сброс по таймеру
    const checkAndResetTimer = useCallback(() => {
        const wasReset = storage.checkAndResetIfExpired();

        if (wasReset) {
            const session = storage.getSession();
            const currentCount = session?.count || 0;

            if (currentCount > 0) {
                dispatch(resetSession());
                return true;
            }
        }
        return false;
    }, [dispatch]);

    // Подписка на изменения в storage
    const subscribeToStorageChanges = useCallback((callback: () => void) => {
        const interval = setInterval(callback, 1000);
        return () => clearInterval(interval);
    }, []);

    return {
        syncInitialState,
        checkAndResetTimer,
        subscribeToStorageChanges,
    };
};