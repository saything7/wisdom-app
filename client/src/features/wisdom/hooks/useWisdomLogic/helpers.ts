import { UIStatus } from './constants';

// Проверка на ошибку лимита запросов
export const isRateLimitError = (message: string): boolean => {
    const rateLimitIndicators = [
        'Стетхем',
        '429',
        'Too Many Requests',
        'rate limit',
        'лимит',
        'превышен',
        'ограничение'
    ];

    return rateLimitIndicators.some(indicator =>
        message.toLowerCase().includes(indicator.toLowerCase())
    );
};

// Извлечение сообщения об ошибке из Redux action
export const getErrorMessage = (resultAction: any): string => {
    if (typeof resultAction.error?.message === 'string') {
        return resultAction.error.message;
    }
    if (typeof resultAction.payload === 'string') {
        return resultAction.payload;
    }
    if (resultAction.error?.toString) {
        return resultAction.error.toString();
    }
    return 'Неизвестная ошибка';
};

// Форматирование времени для UI
export const formatTimeForDisplay = (ms: number): string => {
    if (ms <= 0) return '00:00';

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Валидация UI статуса
export const validateUIStatus = (status: UIStatus): UIStatus => {
    return {
        canMakeRequest: Boolean(status.canMakeRequest),
        remainingRequests: Math.max(0, status.remainingRequests),
        timeLeft: Math.max(0, status.timeLeft),
        shouldShowTimer: Boolean(status.shouldShowTimer),
        isTimerActive: Boolean(status.isTimerActive),
        isLimitExhausted: Boolean(status.isLimitExhausted),
    };
};