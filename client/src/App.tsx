import React from 'react';
import { useDispatch } from 'react-redux';
import { loadFromStorage } from './store/counterSlice';
import { useWisdomLogic } from './hooks/useWisdomLogic';
import { useAutoReset } from './hooks/useAutoReset';
import WisdomButton from './components/WisdomButton';
import QuoteDisplay from './components/QuoteDisplay';
import CounterDisplay from './components/CounterDisplay';
import {LimitExhausted} from '@components/LimitExhausted/LimitExhausted';
import styles from './App.module.css'; // ← ИЗМЕНЕНИЕ 1: без точки!


const App: React.FC = () => {
    const dispatch = useDispatch();
    const [showQuoteWithDelay, setShowQuoteWithDelay] = React.useState(false);
    const [isLoadingManual, setIsLoadingManual] = React.useState(false);
    const [hasInitialClick, setHasInitialClick] = React.useState(false); // ← НОВОЕ

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
        getWisdom,
    } = useWisdomLogic();

    const handleGetWisdom = async () => {
        if (!hasInitialClick) {
            setHasInitialClick(true); // ← Отмечаем первый клик
        }

        setIsLoadingManual(true);

        try {
            await getWisdom();
        } catch (err) {
            setIsLoadingManual(false);
            setHasInitialClick(false);
        }

        // Задержка 2 секунды даже если API быстро ответил
        setTimeout(() => {
            setIsLoadingManual(false);
        }, 2000);
    };

    // Эффект для сброса при обновлении/новой сессии
    React.useEffect(() => {
        if (!quote) {
            setHasInitialClick(false); // ← Сбрасываем при отсутствии цитаты
            setIsLoadingManual(false);
            setShowQuoteWithDelay(false);
        }
    }, [quote]);

    // Эффект для задержки показа цитаты
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
    const showInitialButton = !quote && !hasInitialClick; // Показывать начальную кнопку?

    return (
        <div className={styles.app}>
            <Header />

            <main className={styles.main}>
                <p className={styles.subtitle}>Нажми кнопку для получения мудрости!</p>

                <div className={styles.centralContainer}>
                    {/* Случай 1: Есть цитата и прошло 2 секунды */}
                    {quote && !totalLoading && showQuoteWithDelay ? (
                            <>
                                <div className={styles.quoteContainer}>
                                    <QuoteDisplay quote={quote}
                                                  shouldAnimate={true}/>
                                </div>

                                <div className={styles.newQuoteContainer}>
                                    <button
                                        onClick={handleGetWisdom}
                                        className={styles.newQuoteButton}
                                        disabled={sessionCount >= maxRequests || totalLoading}
                                    >
                                        📜 Новая цитата
                                    </button>
                                </div>
                            </>
                        ) : /* Случай 2: Начальная кнопка (первый раз) */
                        showInitialButton ? (
                                <button
                                    onClick={handleGetWisdom}
                                    className={styles.initialButton}
                                    disabled={sessionCount >= maxRequests}
                                >
                                    🎬 Дай мне мудрость
                                </button>
                            ) : /* Случай 3: Загрузка или кнопка-спиннер */
                            (
                                <WisdomButton
                                    onGetWisdom={handleGetWisdom}
                                    loading={totalLoading}
                                    disabled={sessionCount >= maxRequests}
                                    showSpinner={totalLoading}
                                />
                            )}
                </div>

                {error && <ErrorDisplay error={error} />}

                {/* Счетчики и лимиты */}
                <CounterDisplay
                    sessionCount={sessionCount}
                    totalCount={totalCount}
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
};// Выносим мелкие компоненты
const Header = () => (
    <header className={styles.header}> {/* ← ИЗМЕНЕНИЕ 4 */}
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
    <footer className={styles.footer}> {/* ← ИЗМЕНЕНИЕ 7 */}
        <p>Мудрость обновляется при каждом клике</p>
    </footer>
);

export default App;