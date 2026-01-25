import React, { useState } from 'react';
import WisdomButton from './components/WisdomButton';
import QuoteDisplay from './components/QuoteDisplay';
import CounterDisplay from './components/CounterDisplay';
import './App.css';

const App: React.FC = () => {
    const [quote, setQuote] = useState<string>('');
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const getWisdom = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/quotes/random');

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Стетхем устал. Попробуйте позже!');
                }
                throw new Error('Ошибка сервера');
            }

            const data = await response.json();
            setQuote(data.quote.text);
            setCount(data.count);

            // Сохраняем в localStorage историю
            const history = JSON.parse(localStorage.getItem('wisdomHistory') || '[]');
            history.unshift({
                quote: data.quote.text,
                timestamp: new Date().toISOString(),
                count: data.count
            });
            localStorage.setItem('wisdomHistory', JSON.stringify(history.slice(0, 10)));

        } catch (err: any) {
            setError(err.message || 'Что-то пошло не так');
            console.error('Ошибка:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">Wisdom App</h1>
                <p className="subtitle">Нажми кнопку для получения мудрости!</p>
            </header>

            <main className="main">
                <div className="button-container">
                    <WisdomButton onGetWisdom={getWisdom} loading={loading} />
                </div>

                {error && (
                    <div className="error">
                        ❌ {error}
                    </div>
                )}

                {quote && (
                    <>
                        <QuoteDisplay quote={quote} />
                        <CounterDisplay count={count} />
                    </>
                )}
            </main>

            <footer className="footer">
                <p>Мудрость обновляется при каждом клике</p>
                <p>Всего запросов в этой сессии: {count}</p>
            </footer>
        </div>
    );
};

export default App;