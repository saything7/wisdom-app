import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuote, clearQuote } from './store/quoteSlice';
import {
    incrementSession,
    resetSession,
    loadFromStorage,
    setSessionCount
} from './store/counterSlice';
import { RootState } from './store';
import WisdomButton from './components/WisdomButton';
import QuoteDisplay from './components/QuoteDisplay';
import CounterDisplay from './components/CounterDisplay';
import './App.css';

const App: React.FC = () => {
    const dispatch = useDispatch();

    // Селекторы
    const { text: quote, loading, error } = useSelector(
        (state: RootState) => state.quote
    );

    const { sessionCount, totalCount, maxRequests } = useSelector(
        (state: RootState) => state.counter
    );

    // Загрузка из localStorage при монтировании
    useEffect(() => {
        dispatch(loadFromStorage());

        // Автосброс сессии каждую минуту
        const interval = setInterval(() => {
            if (sessionCount >= maxRequests) {
                dispatch(resetSession());
                localStorage.removeItem('wisdomSession');
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch, sessionCount, maxRequests]);

    // В функции getWisdom, исправляем обработку ошибок:
    const getWisdom = async () => {
        // Проверяем лимит
        if (sessionCount >= maxRequests) {
            dispatch(clearQuote());
            return;
        }

        try {
            // Диспатчим async thunk
            const resultAction = await dispatch(fetchQuote() as any);

            if (fetchQuote.fulfilled.match(resultAction)) {
                // Успешный запрос - увеличиваем счетчик
                dispatch(incrementSession());

                // Сохраняем в localStorage
                const newSessionCount = sessionCount + 1;
                const sessionData = {
                    count: newSessionCount,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('wisdomSession', JSON.stringify(sessionData));
                localStorage.setItem('wisdomTotalCount', (totalCount + 1).toString());

                // Сохраняем историю
                const history = JSON.parse(localStorage.getItem('wisdomHistory') || '[]');
                history.unshift({
                    quote: resultAction.payload.text,
                    timestamp: new Date().toISOString(),
                    sessionCount: newSessionCount,
                    totalCount: totalCount + 1
                });
                localStorage.setItem('wisdomHistory', JSON.stringify(history.slice(0, 10)));

            } else if (fetchQuote.rejected.match(resultAction)) {
                // Создаем безопасную строку ошибки
                let errorMessage = '';

                if (typeof resultAction.error?.message === 'string') {
                    errorMessage = resultAction.error.message;
                } else if (typeof resultAction.payload === 'string') {
                    errorMessage = resultAction.payload;
                }

                // Теперь точно строка, можно использовать includes
                if (
                    errorMessage.includes('Стетхем') ||
                    errorMessage.includes('429') ||
                    errorMessage.includes('Too Many Requests')
                ) {
                    dispatch(setSessionCount(maxRequests));

                    const sessionData = {
                        count: maxRequests,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem('wisdomSession', JSON.stringify(sessionData));
                }
            }
        }catch (err: any) {
            console.error('Ошибка в getWisdom:', err);
            // Если поймали ошибку здесь, это значит что-то пошло не так с самим dispatch
            if (err.message?.includes('429') || err.message?.includes('Стетхем')) {
                dispatch(setSessionCount(maxRequests));
            }
        }
    };
    // Функция для ручного сброса (для тестирования)
    const handleResetLimit = () => {
        dispatch(resetSession());
        dispatch(clearQuote());
        localStorage.removeItem('wisdomSession');
    };

    const remainingRequests = maxRequests - sessionCount;

    return (
        <div className="app">
            <header className="header">
                <h1 className="title">Цитатник Джейсона Стэйтема</h1>
                <p className="subtitle">Нажми кнопку для получения мудрости!</p>
            </header>

            <main className="main">
                <div className="button-container">
                    <WisdomButton
                        onGetWisdom={getWisdom}
                        loading={loading}
                        disabled={sessionCount >= maxRequests}
                    />

                    {/* Кнопка сброса для тестирования */}
                    <button
                        onClick={handleResetLimit}
                        className="reset-button"
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Сбросить лимит (тест)
                    </button>
                </div>

                {error && (
                    <div className="error">
                        ❌ {error}
                    </div>
                )}

                {quote && <QuoteDisplay quote={quote} />}

                <div className="counters">
                    <CounterDisplay
                        sessionCount={sessionCount}
                        totalCount={totalCount}
                        maxRequests={maxRequests}
                    />
                </div>

                {/* Информация о лимите */}
                {remainingRequests <= 2 && remainingRequests > 0 && (
                    <div className="limit-warning">
                        {remainingRequests === 1 ? (
                            <p>⚠️ Остался 1 запрос из {maxRequests}</p>
                        ) : (
                            <p>⚠️ Осталось {remainingRequests} запроса из {maxRequests}</p>
                        )}
                    </div>
                )}

                {remainingRequests === 0 && (
                    <div className="limit-exhausted">
                        <p>⏳ Лимит исчерпан. Сброс через 1 час...</p>
                    </div>
                )}
            </main>

            <footer className="footer">
                <p>Мудрость обновляется при каждом клике</p>
                <p>Запросов в этой сессии: {sessionCount}/{maxRequests}</p>
                <p>Всего получено цитат: {totalCount}</p>
            </footer>
        </div>
    );
};

export default App;