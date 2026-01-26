import React from 'react';
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

    return (
        <div className="app">
            <Header />

            <main className="main">
                <ButtonSection
                    onGetWisdom={getWisdom}
                    loading={loading}
                    disabled={sessionCount >= maxRequests}
                />

                {error && <ErrorDisplay error={error} />}
                {quote && <QuoteDisplay quote={quote} />}

                <CounterDisplay
                    sessionCount={sessionCount}
                    totalCount={totalCount}
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
}

const ButtonSection: React.FC<ButtonSectionProps> = ({
                                                         onGetWisdom,
                                                         loading,
                                                         disabled,
                                                     }) => (
    <div className="button-container">
        <WisdomButton
            onGetWisdom={onGetWisdom}
            loading={loading}
            disabled={disabled}
        />
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
        {/*<p>Запросов в этой сессии: {sessionCount}/{maxRequests}</p>
        <p>Всего получено цитат: {totalCount}</p>*/}
    </footer>
);

export default App;