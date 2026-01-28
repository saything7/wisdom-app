// src/config/constants.ts
export const RATE_LIMIT_DEFAULTS = {
  TTL: 3600000, // 1 час в миллисекундах
  LIMIT: 3, // 300 запросов в час
} as const;
