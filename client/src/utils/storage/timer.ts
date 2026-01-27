import { storageBase } from './base';
import { TimerInfo } from './types';

const HOUR_IN_SECONDS = 60 * 60;
const MAX_REQUESTS = 3;

export const timer = {
    start: (): void => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        storageBase.setTimerStartTime(nowSeconds);
    },

    stop: (): void => {
        storageBase.clearTimerStartTime();
    },

    getInfo: (): TimerInfo => {
        const startTime = storageBase.getTimerStartTime();

        if (!startTime) {
            return {
                isActive: false,
                elapsedSeconds: 0,
                remainingSeconds: HOUR_IN_SECONDS,
                isExpired: true,
                progressPercentage: 0,
            };
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        const elapsedSeconds = nowSeconds - startTime;
        const remainingSeconds = Math.max(0, HOUR_IN_SECONDS - elapsedSeconds);
        const isExpired = elapsedSeconds >= HOUR_IN_SECONDS;
        const progressPercentage = (elapsedSeconds / HOUR_IN_SECONDS) * 100;

        return {
            isActive: !isExpired,
            elapsedSeconds,
            remainingSeconds,
            isExpired,
            progressPercentage: Math.min(100, progressPercentage),
        };
    },

    canMakeRequest: (): boolean => {
        const timerInfo = timer.getInfo();
        const session = storageBase.getSession();
        const currentCount = session?.count || 0;

        if (!timerInfo.isActive) {
            return true;
        }

        return currentCount < MAX_REQUESTS;
    },

    registerRequest: (): void => {
        const session = storageBase.getSession();
        const currentCount = session?.count || 0;
        const timerInfo = timer.getInfo();

        if (currentCount === 0 && !timerInfo.isActive) {
            timer.start();
        }

        const newCount = currentCount + 1;
        storageBase.setSession(newCount);
    },
};