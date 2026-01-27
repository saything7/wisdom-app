import { storageBase } from './base';
import { timer } from './timer';
import { UIStatus } from './types';

const MAX_REQUESTS = 3;

export const storage = {
    // Сессия
    getSession: storageBase.getSession,
    setSession: storageBase.setSession,
    clearSession: storageBase.clearSession,

    // Общий счётчик
    getTotalCount: storageBase.getTotalCount,
    setTotalCount: storageBase.setTotalCount,

    // История
    getHistory: storageBase.getHistory,
    addToHistory: storageBase.addToHistory,

    // Таймер
    startTimer: timer.start,
    stopTimer: timer.stop,
    getTimerInfo: timer.getInfo,
    canMakeRequest: timer.canMakeRequest,
    registerRequest: timer.registerRequest,


    // UI статус
    getUIStatus: (): UIStatus => {
        const session = storageBase.getSession();
        const currentCount = session?.count || 0;
        const timerInfo = timer.getInfo();

        const remainingRequests = MAX_REQUESTS - currentCount;
        const isLimitExhausted = currentCount >= MAX_REQUESTS && timerInfo.isActive;
        const shouldShowTimer = timerInfo.isActive || currentCount > 0;

        return {
            currentCount,
            maxRequests: MAX_REQUESTS,
            remainingRequests: Math.max(0, remainingRequests),
            isTimerActive: timerInfo.isActive,
            timeLeft: timerInfo.remainingSeconds,
            progressPercentage: timerInfo.progressPercentage,
            shouldShowTimer,
            canMakeRequest: timer.canMakeRequest(),
            isLimitExhausted,
        };
    },

    // Сброс
    resetAll: (clearHistory: boolean = false): void => {
        storageBase.clearSession();
        timer.stop();

        if (clearHistory) {
            localStorage.removeItem('wisdomHistory');
            localStorage.removeItem('wisdomTotalCount');
        }
    },

    // Проверка истечения
    checkAndResetIfExpired: (): boolean => {
        const timerInfo = timer.getInfo();

        if (timerInfo.isExpired) {
            storage.resetAll();
            return true;
        }

        return false;
    },

    // Утилиты
    formatTime: (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    getTimeUntilReset: (): string => {
        const timerInfo = timer.getInfo();
        return storage.formatTime(timerInfo.remainingSeconds);
    },

    getDebugInfo: () => ({
        session: storageBase.getSession(),
        totalCount: storageBase.getTotalCount(),
        timerInfo: timer.getInfo(),
        uiStatus: storage.getUIStatus(),
        historyLength: storageBase.getHistory().length,
        timestamp: new Date().toISOString(),
    }),
};