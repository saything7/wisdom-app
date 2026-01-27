// src/components/CounterDisplay/CounterDisplay.tsx
import React, { useState, useEffect } from 'react';
import styles from './CounterDisplay.module.css';

// Функция для чтения куки totalCount с сервера
const getTotalCountFromCookie = (): number => {
    try {
        const match = document.cookie.match(/totalCount=(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    } catch {
        return 0;
    }
};

export interface CounterDisplayProps {
    sessionCount: number;
    maxRequests: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({
                                                           sessionCount,
                                                           maxRequests
                                                       }) => {
    const [totalCount, setTotalCount] = useState<number>(0);

    // Берём значение ТОЛЬКО из кук сервера
    useEffect(() => {
        const cookieValue = getTotalCountFromCookie();
        setTotalCount(cookieValue);

        // Обновляем каждые 2 секунды на случай изменения кук
        const interval = setInterval(() => {
            const newValue = getTotalCountFromCookie();
            if (newValue !== totalCount) {
                setTotalCount(newValue);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const remaining = maxRequests - sessionCount;
    const percentage = (sessionCount / maxRequests) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.counterRow}>
                <div className={styles.counterItem}>
                    <span className={styles.label}>Запросов в сессии:</span>
                    <span className={`${styles.value} ${sessionCount >= maxRequests ? styles.limitReached : ''}`}>
                        {sessionCount}
                    </span>
                    <span className={styles.max}>/ {maxRequests}</span>
                </div>

                <div className={styles.counterItem}>
                    <span className={styles.label}>Всего получено:</span>
                    <span className={styles.value}>{totalCount}</span>
                </div>
            </div>

            <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                    <div
                        className={`${styles.progressFill} ${
                            percentage >= 80 ? styles.warning :
                                percentage >= 100 ? styles.danger : ''
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
                <div className={styles.progressLabel}>
                    {remaining > 0 ? (
                        <span>Осталось: {remaining} запросов</span>
                    ) : (
                        <span className={styles.limitText}>⚠️ Лимит достигнут</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CounterDisplay;