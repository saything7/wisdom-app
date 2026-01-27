// quotes/constants/validation.constants.ts
export const VALIDATION_CONSTANTS = {
  QUOTE: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 500,
    MESSAGES: {
      MIN_LENGTH: 'Цитата должна содержать минимум 5 символов',
      MAX_LENGTH: 'Цитата не должна превышать 500 символов',
      REQUIRED: 'Текст цитаты обязателен',
    },
  },
  AUTHOR: {
    MAX_LENGTH: 100,
    MESSAGE: 'Имя автора не должно превышать 100 символов',
  },
  CATEGORY: {
    MAX_LENGTH: 50,
    MESSAGE: 'Категория не должна превышать 50 символов',
  },
} as const;
