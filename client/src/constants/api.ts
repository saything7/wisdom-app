export const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production'
        ? ''
        : 'http://localhost:3001',

    ENDPOINTS: {
        RANDOM_QUOTE: '/quotes/random',
    },

    RATE_LIMIT: {
        MAX_REQUESTS: 3,
        RESET_INTERVAL_MS: 3600000, // 30 секунд
    },

    RETRY_CONFIG: {
        MAX_RETRIES: 2,
        RETRY_DELAY: 1000,
    },
} as const;

export const RESET_INTERVAL_MS = API_CONFIG.RATE_LIMIT.RESET_INTERVAL_MS;