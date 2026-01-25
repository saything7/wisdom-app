import React from 'react';
import styles from './CounterDisplay.module.css';

interface CounterDisplayProps {
    count: number;
}

const CounterDisplay: React.FC<CounterDisplayProps> = ({ count }) => {
    return (
        <div className={styles.container}>
            🎯 Вы уже получили <strong>{count}</strong> мудростей в этой сессии
        </div>
    );
};

export default CounterDisplay;