export const WISDOM_API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production'
        ? ''
        : 'http://localhost:3001',

    ENDPOINTS: {
        RANDOM_QUOTE: '/api/quotes/random',
    },

    RATE_LIMIT: {
        MAX_REQUESTS: 12,
        RESET_INTERVAL_MS: 3600000, // 1 час
    },
} as const;