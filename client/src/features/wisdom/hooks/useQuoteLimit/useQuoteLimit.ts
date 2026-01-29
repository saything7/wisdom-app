// hooks/useQuoteLimit.ts
import { useState, useEffect } from 'react';

export const useQuoteLimit = () => {
    const [quotesUsed, setQuotesUsed] = useState<number>(0);
    const [isLimitExhausted, setIsLimitExhausted] = useState<boolean>(false);

    useEffect(() => {
        // Загружаем состояние из localStorage при монтировании
        const savedQuotes = localStorage.getItem('quotesUsed');
        const savedTime = localStorage.getItem('limitExhaustedTime');
        const now = Math.floor(Date.now() / 1000);

        if (savedQuotes) {
            const parsedQuotes = parseInt(savedQuotes);
            setQuotesUsed(parsedQuotes);

            // Проверяем, не превышен ли лимит
            if (parsedQuotes >= 3) {
                setIsLimitExhausted(true);
            }
        }

        // Проверяем, не истёк ли лимит по времени
        if (savedTime) {
            const expirationTime = parseInt(savedTime);
            if (now < expirationTime) {
                setIsLimitExhausted(true);
            } else {
                // Время истекло, сбрасываем лимит
                localStorage.removeItem('quotesUsed');
                localStorage.removeItem('limitExhaustedTime');
                setQuotesUsed(0);
                setIsLimitExhausted(false);
            }
        }
    }, []);

    const incrementQuotes = () => {
        // Проверяем, не превышен ли лимит
        if (quotesUsed >= 3 || isLimitExhausted) {
            return; // Не увеличиваем счетчик, если лимит исчерпан
        }

        const newCount = quotesUsed + 1;
        setQuotesUsed(newCount);
        localStorage.setItem('quotesUsed', newCount.toString());

        if (newCount >= 3) {
            setIsLimitExhausted(true);
            const now = Math.floor(Date.now() / 1000);
            const expirationTime = now + 60 * 60; // +1 час
            localStorage.setItem('limitExhaustedTime', expirationTime.toString());
        }
    };

    const resetLimit = () => {
        setQuotesUsed(0);
        setIsLimitExhausted(false);
        localStorage.removeItem('quotesUsed');
        localStorage.removeItem('limitExhaustedTime');
    };

    return {
        quotesUsed,
        isLimitExhausted,
        incrementQuotes,
        resetLimit,
        quotesLeft: Math.max(0, 3 - quotesUsed)
    };
};