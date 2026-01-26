import React from 'react';
import { useDispatch } from 'react-redux';
import { loadFromStorage } from './store/counterSlice';
import { useWisdomLogic } from './hooks/useWisdomLogic';
import { useAutoReset } from './hooks/useAutoReset';
import WisdomButton from './components/WisdomButton';
import QuoteDisplay from './components/QuoteDisplay';
import CounterDisplay from './components/CounterDisplay';
import styles from './App.module.css';

const App: React.FC = () => {
    const dispatch = useDispatch();
    const [showQuoteWithDelay, setShowQuoteWithDelay] = React.useState(false);
    const [isLoadingManual, setIsLoadingManual] = React.useState(false);
    const [hasInitialClick, setHasInitialClick] = React.useState(false);

    React.useEffect(() => {
        dispatch(loadFromStorage());
    }, [dispatch]);

    useAutoReset();

    const {
        quote,
        loading,
        error,
        sessionCount,
        totalCount,
        maxRequests,
        remainingRequests,
        timeLeft,
        shouldShowTimer,
        isLimitExhausted,
        formatTime,
        getWisdom,
    } = useWisdomLogic();

    const handleGetWisdom = async () => {
        if (!hasInitialClick) {
            setHasInitialClick(true);
        }

        setIsLoadingManual(true);

        try {
            await getWisdom();
        } catch (err) {
            setIsLoadingManual(false);
            setHasInitialClick(false);
        }

        setTimeout(() => {
            setIsLoadingManual(false);
        }, 2000);
    };

    React.useEffect(() => {
        if (!quote) {
            setHasInitialClick(false);
            setIsLoadingManual(false);
            setShowQuoteWithDelay(false);
        }
    }, [quote]);

    React.useEffect(() => {
        if (quote && !loading) {
            setShowQuoteWithDelay(false);
            const timer = setTimeout(() => {
                setShowQuoteWithDelay(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [quote, loading]);

    const totalLoading = loading || isLoadingManual;
    const showInitialButton = !quote && !hasInitialClick;

    return (
        <div className={styles.app}>
            <Header />

            <main className={styles.main}>
                <p className={styles.subtitle}>Нажми кнопку для получения мудрости!</p>

                <div className={styles.centralContainer}>
                    {quote && !totalLoading && showQuoteWithDelay ? (
                        <>
                            <div className={styles.quoteContainer}>
                                <QuoteDisplay quote={quote} shouldAnimate={true}/>
                            </div>

                            <div className={styles.newQuoteContainer}>
                                <button
                                    onClick={handleGetWisdom}
                                    className={styles.newQuoteButton}
                                    disabled={isLimitExhausted || totalLoading}
                                >
                                    📜 Новая цитата
                                </button>
                            </div>
                        </>
                    ) : showInitialButton ? (
                        <button
                            onClick={handleGetWisdom}
                            className={styles.initialButton}
                            disabled={isLimitExhausted}
                        >
                            🎬 Дай мне мудрость
                        </button>
                    ) : (
                        <WisdomButton
                            onGetWisdom={handleGetWisdom}
                            loading={totalLoading}
                            disabled={isLimitExhausted}
                            showSpinner={totalLoading}
                        />
                    )}
                </div>

                {error && <ErrorDisplay error={error} />}

                {/* 👇 ТАЙМЕР - показывается после первого запроса */}
                {shouldShowTimer && (
                    <div className={`${styles.timerContainer} ${isLimitExhausted ? styles.limitExhausted : ''}`}>
                        <div className={styles.timerText}>
                            <span className={styles.timerIcon}>⏳</span>
                            {isLimitExhausted
                                ? "Лимит исчерпан. Обновится через:"
                                : "Лимит обновится через:"}
                            <span className={styles.timeValue}> {formatTime(timeLeft)}</span>
                        </div>
                        <div className={styles.timerBar}>
                            <div
                                className={styles.timerProgress}
                                style={{
                                    width: `${((3600 - timeLeft) / 3600) * 100}%`
                                }}
                            />
                        </div>
                        <div className={styles.requestsInfo}>
                            Использовано запросов: {sessionCount}/{maxRequests}
                        </div>
                    </div>
                )}

                {/* Счетчики */}
                <CounterDisplay
                    sessionCount={sessionCount}
                    totalCount={totalCount}
                    maxRequests={maxRequests}
                />
            </main>

            <Footer
                sessionCount={sessionCount}
                totalCount={totalCount}
                maxRequests={maxRequests}
            />
        </div>
    );
};

const Header = () => (
    <header className={styles.header}>
        <h1 className={styles.title}>Цитатник Джейсона Стэйтема</h1>
    </header>
);

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
    <div className={styles.error}>❌ {error}</div>
);

const Footer: React.FC<{
    sessionCount: number;
    totalCount: number;
    maxRequests: number;
}> = ({ sessionCount, totalCount, maxRequests }) => (
    <footer className={styles.footer}>
        <p>Мудрость обновляется при каждом клике</p>
    </footer>
);

export default App;