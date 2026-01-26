import React from 'react';
import styles from './LimitExhausted.module.css'; // Импорт стилей

export const LimitExhausted: React.FC = () => (
    <div className={styles.limitExhausted}>
        <p>Лимит исчерпан. Обновится через 1 час...</p>
    </div>
);