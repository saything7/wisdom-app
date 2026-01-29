import React from 'react';
import styles from './Header.module.css';

export const Header: React.FC = () => (
    <header className={styles.header}>
        <h1 className={styles.title}>Цитатник Джейсона Стетхема</h1>
        <p className={styles.subtitle}>Нажми кнопку для получения мудрости!</p>
    </header>
);