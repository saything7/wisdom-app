import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSession } from '../store/counterSlice';
import { RootState } from '../store'; // или '../store/index'
import { storage } from '../utils/storage';
import { RESET_INTERVAL_MS } from '../constants/api';

export const useAutoReset = () => {
    const dispatch = useDispatch();

    // Используем RootState напрямую
    const sessionCount = useSelector((state: RootState) => state.counter.sessionCount);
    const maxRequests = useSelector((state: RootState) => state.counter.maxRequests);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sessionCount >= maxRequests) {
                dispatch(resetSession());
                storage.clearSession();
            }
        }, RESET_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [dispatch, sessionCount, maxRequests]);
};