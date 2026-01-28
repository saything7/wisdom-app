// Переносим с обновленными импортами
import React from 'react';
import styles from './TimerDisplay.module.css';

interface TimerDisplayProps {
    timeLeft: number;
    formatTime: (seconds: number) => string;
    sessionCount: number;
    maxRequests: number;
    isLimitExhausted: boolean;
    shouldShowTimer: boolean;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
                                                              timeLeft,
                                                              formatTime,
                                                              sessionCount,
                                                              maxRequests,
                                                              isLimitExhausted,
                                                              shouldShowTimer,
                                                          }) => {
    if (!shouldShowTimer) return null;

    const progressPercentage = ((60 * 60 - timeLeft) / (60 * 60)) * 100;

    return (
        <div className={`${styles.timerContainer} ${isLimitExhausted ? styles.limitExhausted : ''}`}>
            <div className={styles.timerText}>
                <span className={styles.timerIcon}>⏳</span>
                {isLimitExhausted ? 'Лимит исчерпан' : 'До сброса лимита:'}
                <span className={styles.timeValue}> {formatTime(timeLeft)}</span>
            </div>

            <div className={styles.timerBar}>
                <div
                    className={styles.timerProgress}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            <div className={styles.requestsInfo}>
                Использовано {sessionCount} из {maxRequests}-х запросов в этой сессии
            </div>
        </div>
    );
};