import React from 'react';
<<<<<<< Updated upstream:client/src/App.tsx
import { useDispatch } from 'react-redux';
import { loadFromStorage } from './store/counterSlice';
import { useWisdomLogic } from './hooks/useWisdomLogic';
import { useAutoReset } from './hooks/useAutoReset';
import WisdomButton from './components/WisdomButton';
import QuoteDisplay from './components/QuoteDisplay';
import CounterDisplay from './components/CounterDisplay';
import {LimitWarning} from './components/LimitWarning';
import {LimitExhausted} from './components/LimitExhausted';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();

    // Загрузка из localStorage при монтировании
    React.useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    // Автосброс лимита
    useAutoReset();

=======
import { useAppLogic } from '@/hooks/useAppLogic';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay/ErrorDisplay';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';

// Импорты через публичные API фич
import { TimerDisplay } from '@/features/timer';
import { MainContent } from '@/features/wisdom';
import { CounterDisplay } from '@/features/counter';

import styles from './App.module.css';

const App: React.FC = () => {
>>>>>>> Stashed changes:client/src/app/App.tsx
    const {
        quote,
        loading,
        error,
        sessionCount,
        maxRequests,
        remainingRequests,
        getWisdom,
        handleResetLimit,
    } = useWisdomLogic();

    return (
        <div className="app">
            <Header />

<<<<<<< Updated upstream:client/src/App.tsx
            <main className="main">
                <ButtonSection
                    onGetWisdom={getWisdom}
                    loading={loading}
                    disabled={sessionCount >= maxRequests}
                    onReset={handleResetLimit}
                />
=======
            <main className={styles.main}>
                <div className={styles.centralContainer}>
                    <MainContent
                        quote={quote}
                        totalLoading={totalLoading}
                        showQuoteWithDelay={showQuoteWithDelay}
                        hasInitialClick={!showInitialButton}
                        isLimitExhausted={isLimitExhausted}
                        showInitialButton={showInitialButton}
                        onGetWisdom={handleGetWisdom}
                    />
                </div>
>>>>>>> Stashed changes:client/src/app/App.tsx

                {error && <ErrorDisplay error={error} />}
                {quote && <QuoteDisplay quote={quote} />}

                <CounterDisplay
                    sessionCount={sessionCount}
                    maxRequests={maxRequests}
                />

                <LimitWarning
                    remainingRequests={remainingRequests}
                    maxRequests={maxRequests}
                />

                {remainingRequests === 0 && <LimitExhausted />}
            </main>

            <Footer
                sessionCount={sessionCount}
                totalCount={totalCount}
                maxRequests={maxRequests}
            />
        </div>
    );
};

<<<<<<< Updated upstream:client/src/App.tsx
// Выносим мелкие компоненты
const Header = () => (
    <header className="header">
        <h1 className="title">Цитатник Джейсона Стэйтема</h1>
        <p className="subtitle">Нажми кнопку для получения мудрости!</p>
    </header>
);

interface ButtonSectionProps {
    onGetWisdom: () => Promise<void>;
    loading: boolean;
    disabled: boolean;
    onReset: () => void;
}

const ButtonSection: React.FC<ButtonSectionProps> = ({
                                                         onGetWisdom,
                                                         loading,
                                                         disabled,
                                                         onReset,
                                                     }) => (
    <div className="button-container">
        <WisdomButton
            onGetWisdom={onGetWisdom}
            loading={loading}
            disabled={disabled}
        />
        <button
            onClick={onReset}
            className="reset-button"
        >
            Сбросить лимит (тест)
        </button>
    </div>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
    <div className="error">❌ {error}</div>
);

const Footer: React.FC<{
    sessionCount: number;
    totalCount: number;
    maxRequests: number;
}> = ({ sessionCount, totalCount, maxRequests }) => (
    <footer className="footer">
        <p>Мудрость обновляется при каждом клике</p>
        <p>Запросов в этой сессии: {sessionCount}/{maxRequests}</p>
        <p>Всего получено цитат: {totalCount}</p>
    </footer>
);

=======
>>>>>>> Stashed changes:client/src/app/App.tsx
export default App;