const STORAGE_KEYS = {
    SESSION: 'wisdomSession',
    TOTAL_COUNT: 'wisdomTotalCount',
    HISTORY: 'wisdomHistory',
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

export const storage = {
    // Сессия
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

    // Общий счётчик
    getTotalCount: (): number => {
        const count = localStorage.getItem(STORAGE_KEYS.TOTAL_COUNT);
        return count ? parseInt(count, 10) : 0;
    },

    setTotalCount: (count: number): void => {
        localStorage.setItem(STORAGE_KEYS.TOTAL_COUNT, count.toString());
    },

    // История
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
};