const STORAGE_KEYS = {
    SESSION: 'wisdomSession',
    TOTAL_COUNT: 'wisdomTotalCount',
    HISTORY: 'wisdomHistory',
    TIMER_START: 'wisdomTimerStart',
} as const;

interface SessionData {
    count: number;
    timestamp: string;
}

interface HistoryItem {
    quote: string;
    timestamp: string;
    sessionCount: number;
    totalCount: number;
}

// Константы
const HOUR_IN_SECONDS = 60 * 60; // 1 час в секундах
const MAX_REQUESTS = 3;
export const storage = {
    // ========== СЕССИЯ ==========
    getSession: (): SessionData | null => {
        const data = localStorage.getItem(STORAGE_KEYS.SESSION);
        return data ? JSON.parse(data) : null;
    },

    setSession: (count: number): void => {
        const sessionData: SessionData = {
            count,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    },

    clearSession: (): void => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    },

    // ========== ОБЩИЙ СЧЁТЧИК ==========
    getTotalCount: (): number => {
        const count = localStorage.getItem(STORAGE_KEYS.TOTAL_COUNT);
        return count ? parseInt(count, 10) : 0;
    },

    setTotalCount: (count: number): void => {
        localStorage.setItem(STORAGE_KEYS.TOTAL_COUNT, count.toString());
    },

    // ========== ИСТОРИЯ ==========
    getHistory: (): HistoryItem[] => {
        const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    },

    addToHistory: (item: Omit<HistoryItem, 'timestamp'>): void => {
        const history = storage.getHistory();
        const newItem: HistoryItem = {
            ...item,
            timestamp: new Date().toISOString(),
        };

        history.unshift(newItem);
        // Сохраняем только последние 10 записей
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 10)));
    },

    // ========== ТАЙМЕР ==========
    // Запустить таймер (после первого запроса)
    startTimer: (): void => {
        const nowSeconds = Math.floor(Date.now() / 1000);
        localStorage.setItem(STORAGE_KEYS.TIMER_START, nowSeconds.toString());
    },

    // Остановить таймер
    stopTimer: (): void => {
        localStorage.removeItem(STORAGE_KEYS.TIMER_START);
    },

    // Получить время старта таймера
    getTimerStartTime: (): number | null => {
        const timestamp = localStorage.getItem(STORAGE_KEYS.TIMER_START);
        return timestamp ? parseInt(timestamp, 10) : null;
    },

    // Получить информацию о таймере
    getTimerInfo: () => {
        const startTime = storage.getTimerStartTime();

        console.log('🔍🔍🔍 getTimerInfo CALLED 🔍🔍🔍');
        console.log('🔍 Current time:', new Date().toISOString());
        console.log('🔍 startTime (seconds):', startTime);
        console.log('🔍 startTime (as Date):', startTime ? new Date(startTime * 1000).toISOString() : 'null');

        if (!startTime) {
            return { isActive: false, elapsedSeconds: 0, remainingSeconds: HOUR_IN_SECONDS, isExpired: true, progressPercentage: 0 };
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        const elapsedSeconds = nowSeconds - startTime;
        const remainingSeconds = Math.max(0, HOUR_IN_SECONDS - elapsedSeconds);
        const isExpired = elapsedSeconds >= HOUR_IN_SECONDS;
        const progressPercentage = (elapsedSeconds / HOUR_IN_SECONDS) * 100;


        console.log('🔍 nowSeconds:', nowSeconds);
        console.log('🔍 elapsedSeconds:', elapsedSeconds, 'seconds =', Math.floor(elapsedSeconds / 60), 'minutes');
        console.log('🔍 HOUR_IN_SECONDS:', HOUR_IN_SECONDS);
        console.log('🔍 isExpired:', elapsedSeconds, '>=', HOUR_IN_SECONDS, '=', isExpired);
        console.log('🔍 Should reset after:', HOUR_IN_SECONDS - elapsedSeconds, 'seconds');



        return {
            isActive: !isExpired,
            elapsedSeconds,
            remainingSeconds,
            isExpired,
            progressPercentage: Math.min(100, progressPercentage),
        };
    },

    // ========== ОСНОВНАЯ ЛОГИКА ==========
    // Проверить, можно ли делать запрос
    canMakeRequest: (): boolean => {
        const timerInfo = storage.getTimerInfo();
        const session = storage.getSession();
        const currentCount = session?.count || 0;

        // Если таймер не активен (истёк или не запущен) - можно делать запросы
        if (!timerInfo.isActive) {
            return true;
        }

        // Таймер активен - проверяем лимит
        return currentCount < MAX_REQUESTS;
    },

    // Зарегистрировать запрос (увеличить счётчик и при необходимости запустить таймер)
    registerRequest: (): void => {
        const session = storage.getSession();
        const currentCount = session?.count || 0;
        const timerInfo = storage.getTimerInfo();

        // Если это первый запрос И таймер ещё не запущен - запускаем
        if (currentCount === 0 && !timerInfo.isActive) {
            storage.startTimer();
        }

        // Увеличиваем счётчик
        const newCount = currentCount + 1;
        storage.setSession(newCount);
    },

    // Получить полный статус для UI
    getUIStatus: () => {
        const session = storage.getSession();
        const currentCount = session?.count || 0;
        const timerInfo = storage.getTimerInfo();

        const remainingRequests = MAX_REQUESTS - currentCount;
        const isLimitExhausted = currentCount >= MAX_REQUESTS && timerInfo.isActive;

        // Определяем, нужно ли показывать таймер в UI:
        // 1. Таймер активен (идёт отсчёт)
        // 2. ИЛИ уже были запросы в этой сессии (даже если таймер истёк)
        const shouldShowTimer = timerInfo.isActive || currentCount > 0;

        return {
            currentCount,
            maxRequests: MAX_REQUESTS,
            remainingRequests: Math.max(0, remainingRequests),
            isTimerActive: timerInfo.isActive,
            timeLeft: timerInfo.remainingSeconds,
            progressPercentage: timerInfo.progressPercentage,
            shouldShowTimer,
            canMakeRequest: storage.canMakeRequest(),
            isLimitExhausted,
        };
    },

    // Сбросить всё (при истечении таймера или ручном сбросе)
    resetAll: (clearHistory: boolean = false): void => {
        // Очищаем сессию и таймер
        storage.clearSession();
        storage.stopTimer();

        // При необходимости очищаем историю и общий счётчик
        if (clearHistory) {
            localStorage.removeItem(STORAGE_KEYS.HISTORY);
            localStorage.removeItem(STORAGE_KEYS.TOTAL_COUNT);
        }
    },

    // Проверить и сбросить, если таймер истёк
    checkAndResetIfExpired: (): boolean => {
        const timerInfo = storage.getTimerInfo();

        if (timerInfo.isExpired) {
            storage.resetAll();
            return true; // Был сброс
        }

        return false; // Сброса не было
    },

    // ========== ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ ==========
    // Форматирование времени для отображения
    formatTime: (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    // Получить время до сброса в читаемом формате
    getTimeUntilReset: (): string => {
        const timerInfo = storage.getTimerInfo();
        return storage.formatTime(timerInfo.remainingSeconds);
    },

    // Получить информацию для отладки
    getDebugInfo: () => {
        return {
            session: storage.getSession(),
            totalCount: storage.getTotalCount(),
            timerInfo: storage.getTimerInfo(),
            uiStatus: storage.getUIStatus(),
            historyLength: storage.getHistory().length,
            timestamp: new Date().toISOString(),
        };
    },
};