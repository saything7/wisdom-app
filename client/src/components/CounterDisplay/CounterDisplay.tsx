// src/components/CounterDisplay/CounterDisplay.tsx
import React from 'react';
import styles from './CounterDisplay.module.css';

// Обновляем интерфейс
export interface CounterDisplayProps {
    sessionCount: number;
    totalCount: number;
    maxRequests: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({
                                                           sessionCount,
                                                           totalCount,
                                                           maxRequests
                                                       }) => {
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