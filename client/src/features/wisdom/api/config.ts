export const WISDOM_API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production'
        ? ''
        : 'http://localhost:3001',

    ENDPOINTS: {
        RANDOM_QUOTE: '/api/quotes/random',
    },

    RATE_LIMIT: {
        MAX_REQUESTS: 3,
        RESET_INTERVAL_MS: 3600000, // 1 час
    },
} as const;

// Экспортируем константы напрямую
export const MAX_REQUESTS = WISDOM_API_CONFIG.RATE_LIMIT.MAX_REQUESTS;
export const RESET_INTERVAL_MS = WISDOM_API_CONFIG.RATE_LIMIT.RESET_INTERVAL_MS;

export type WisdomApiConfig = typeof WISDOM_API_CONFIG;