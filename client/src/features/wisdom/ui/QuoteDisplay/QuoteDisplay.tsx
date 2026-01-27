// client/src/components/QuoteDisplay/QuoteDisplay.tsx
import React, { useState, useEffect } from 'react';
import styles from './QuoteDisplay.module.css';
// УДАЛИТЬ эту строку полностью: import '../../styles/animations.css;'
// Анимации уже в App.css, который импортируется в App.tsx

interface QuoteDisplayProps {
    quote: string;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote }) => {
    const [displayedText, setDisplayedText] = useState<string>('');
    const [letters, setLetters] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (!quote) {
            setDisplayedText('');
            setLetters([]);
            return;
        }

        setDisplayedText(quote);

        const timeout = setTimeout(() => {
            const letterElements = quote.split('').map((char, index) => (
                <span
                    key={index}
                    className="letter-reveal"
                    style={{
                        animationDelay: `${index * 0.03}s`,
                        whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                >
          {char}
        </span>
            ));
            setLetters(letterElements);
        }, 500);

        return () => clearTimeout(timeout);
    }, [quote]);

    return (
        <div className={`${styles.container} quote-container`}>
            <div className={styles.quoteMark}>"</div>
            <p className={styles.quote}>
                {letters.length > 0 ? letters : displayedText}
            </p>
            <div className={styles.quoteMark}>"</div>
        </div>
    );
};

export default QuoteDisplay;