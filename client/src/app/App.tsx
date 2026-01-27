import React from 'react';
import { useAppLogic } from '@/hooks/useAppLogic';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay/ErrorDisplay';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';

// Импорты через публичные API фич
import { TimerDisplay } from '@/features/timer';
import { MainContent } from '@/features/wisdom';
import { CounterDisplay } from '@/features/counter';

import styles from './styles/App.module.css';

const App: React.FC = () => {
    const {
        quote,
        error,
        sessionCount,
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
                    maxRequests={maxRequests}
                />
            </main>

            <Footer />
        </div>
    );
};

export default App;