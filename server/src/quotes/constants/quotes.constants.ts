// quotes/constants/quotes.constants.ts
export const QUOTES_CONSTANTS = {
  COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 дней
  DEFAULT_AUTHOR: 'Неизвестный автор',
  MAX_QUOTE_LENGTH: 500,
  MAX_AUTHOR_LENGTH: 100,
} as const;
