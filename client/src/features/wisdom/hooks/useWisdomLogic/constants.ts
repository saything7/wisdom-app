// Типы для UI статуса
export interface UIStatus {
    canMakeRequest: boolean;
    remainingRequests: number;
    timeLeft: number;
    shouldShowTimer: boolean;
    isTimerActive: boolean;
    isLimitExhausted: boolean;
}

// Тип для истории запросов
export interface RequestHistoryItem {
    quote: string;
    sessionCount: number;
    totalCount: number;
    timestamp?: string;
}

// Константы лимитов
