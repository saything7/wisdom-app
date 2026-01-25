import React from 'react';
import styles from './QuoteDisplay.module.css';

interface QuoteDisplayProps {
    quote: string;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
    return (
        <div className={styles.container}>
            <div className={styles.quoteMark}>"</div>
            <p className={styles.quote}>{quote}</p>
            <div className={styles.quoteMark}>"</div>
        </div>
    );
};

export default QuoteDisplay;