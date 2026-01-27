// Реэкспорт всех публичных элементов фичи

// Хуки
export { useWisdomLogic } from './hooks/useWisdomLogic/useWisdomLogic';

// Store
export { fetchQuote, clearQuote } from './store/quoteSlice';
export {
    selectQuoteText,
    selectQuoteLoading,
    selectQuoteError
} from './store/selectors';

// UI компоненты (правильный импорт для default export)
import {MainContent} from './ui/MainContent/MainContent';
import QuoteDisplay from './ui/QuoteDisplay/QuoteDisplay';
import WisdomButton from './ui/WisdomButton/WisdomButton';

export { MainContent, QuoteDisplay, WisdomButton };