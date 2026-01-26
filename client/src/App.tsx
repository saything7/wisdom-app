import React from 'react';
import { TimerDisplay } from './components/TimerDisplay/TimerDisplay';
import { MainContent } from './components/MainContent/MainContent';
import CounterDisplay from './components/CounterDisplay/CounterDisplay';
import { useAppLogic } from './hooks/useAppLogic';
import styles from './App.module.css';

const App: React.FC = () => {

    const {
        quote,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        timeLeft,
        shouldShowTimer,
        isLimitExhausted,
        totalLoading,
        showQuoteWithDelay,
        showInitialButton,
        formatTime,
        handleGetWisdom,
    } = useAppLogic();

    return (
        <div className={styles.app}>
            <Header />

            <main className={styles.main}>
                <p className={styles.subtitle}>Нажми кнопку для получения мудрости!</p>

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

                {error && <ErrorDisplay error={error} />}

                <TimerDisplay
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    sessionCount={sessionCount}
                    maxRequests={maxRequests}
                    isLimitExhausted={isLimitExhausted}
                    shouldShowTimer={shouldShowTimer}
                />

                <CounterDisplay
                    sessionCount={sessionCount}
                    totalCount={totalCount}
                    maxRequests={maxRequests}
                />
            </main>

            <Footer />
        </div>
    );
};

// Вспомогательные компоненты
const Header = () => (
    <header className={styles.header}>
        <h1 className={styles.title}>Цитатник Джейсона Стэйтема</h1>
    </header>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
    <div className={styles.error}>❌ {error}</div>
);

const Footer = () => (
    <footer className={styles.footer}>
        <p>Мудрость обновляется при каждом клике</p>
    </footer>
);

export default App;