export const STORAGE_KEYS = {
    SESSION: 'wisdomSession',
    TOTAL_COUNT: 'wisdomTotalCount',
    HISTORY: 'wisdomHistory',
    TIMER_START: 'wisdomTimerStart',
} as const;

export interface SessionData {
    count: number;
    timestamp: string;
}

export interface HistoryItem {
    quote: string;
    timestamp: string;
    sessionCount: number;
    totalCount: number;
}

export interface TimerInfo {
    isActive: boolean;
    elapsedSeconds: number;
    remainingSeconds: number;
    isExpired: boolean;
    progressPercentage: number;
}

export interface UIStatus {
    currentCount: number;
    maxRequests: number;
    remainingRequests: number;
    isTimerActive: boolean;
    timeLeft: number;
    progressPercentage: number;
    shouldShowTimer: boolean;
    canMakeRequest: boolean;
    isLimitExhausted: boolean;
}