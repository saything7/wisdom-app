
// Реэкспорт всех публичных элементов фичи
export { useWisdomLogic } from './hooks/useWisdomLogic/useWisdomLogic';
export { fetchQuote, clearQuote } from './store/quoteSlice';
export {
    selectQuoteText,
    selectQuoteLoading,
    selectQuoteError
} from './store/selectors';

// UI компоненты
export { MainContent } from './ui/MainContent/MainContent';
export { QuoteDisplay } from './ui/QuoteDisplay/QuoteDisplay';
export { WisdomButton } from './ui/WisdomButton/WisdomButton';