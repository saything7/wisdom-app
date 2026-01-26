import React from 'react';
import styles from './LimitExhausted.module.css';

interface LimitExhaustedProps {
    timeLeft: number;
    formatTime: (seconds: number) => string;
}

export const LimitExhausted: React.FC<LimitExhaustedProps> = ({
                                                                  timeLeft,
                                                                  formatTime
                                                              }) => {
    if (timeLeft <= 0) return null;

    const progressPercentage = ((3600 - timeLeft) / 3600) * 100;

    return (
        <div className={styles.limitExhausted}>
            <p className={styles.message}>⏳ Лимит исчерпан. Обновится через {formatTime(timeLeft)}</p>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};