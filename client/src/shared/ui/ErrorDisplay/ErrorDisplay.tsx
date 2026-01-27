import React from 'react';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
    error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
    <div className={styles.error}>
        <span className={styles.icon}>❌</span>
        <span className={styles.message}>{error}</span>
    </div>
);