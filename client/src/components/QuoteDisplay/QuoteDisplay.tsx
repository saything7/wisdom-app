// client/src/components/QuoteDisplay/QuoteDisplay.tsx
import React, { useState, useEffect } from 'react';
import styles from './QuoteDisplay.module.css';

interface QuoteDisplayProps {
    quote: string;
    shouldAnimate?: boolean; // ← ДОБАВИМ ПРОПС
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, shouldAnimate = true }) => {
    const [displayedText, setDisplayedText] = useState<string>('');
    const [letters, setLetters] = useState<JSX.Element[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!quote) {
            setDisplayedText('');
            setLetters([]);
            setIsAnimating(false);
            return;
        }

        setDisplayedText('');
        setLetters([]);
        setIsAnimating(false);

        // Если не нужно анимировать - показываем сразу
        if (!shouldAnimate) {
            setDisplayedText(quote);
            return;
        }

        // Начинаем анимацию
        setIsAnimating(true);

        const timeout = setTimeout(() => {
            const letterElements = quote.split('').map((char, index) => (
                <span
                    key={index}
                    className={styles.letterReveal}
                    style={{
                        animationDelay: `${index * 0.03}s`,
                        whiteSpace: char === ' ' ? 'pre' : 'normal'
                    }}
                >
                    {char}
                </span>
            ));
            setLetters(letterElements);
        }, 100); // Уменьшаем задержку

        return () => clearTimeout(timeout);
    }, [quote, shouldAnimate]);

    return (
        <div className={styles.container}>
            <div className={styles.quoteMark}>"</div>
            <p className={styles.quote}>
                {isAnimating && letters.length > 0 ? letters : displayedText}
            </p>
            <div className={styles.quoteMark}>"</div>
        </div>
    );
};

export default QuoteDisplay;