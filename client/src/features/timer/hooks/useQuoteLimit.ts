import { useState, useEffect } from 'react';
import { MAX_REQUESTS, RESET_INTERVAL_MS } from '@/features/wisdom/api/config';

export const useQuoteLimit = () => {
    const [quotesUsed, setQuotesUsed] = useState<number>(0);
    const [isLimitExhausted, setIsLimitExhausted] = useState<boolean>(false);

    useEffect(() => {
        // Загружаем состояние из localStorage при монтировании
        const savedQuotes = localStorage.getItem('quotesUsed');
        const savedTime = localStorage.getItem('limitExhaustedTime');
        const now = Math.floor(Date.now() / 1000);

        if (savedQuotes) {
            setQuotesUsed(parseInt(savedQuotes));
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
        const newCount = quotesUsed + 1;
        setQuotesUsed(newCount);
        localStorage.setItem('quotesUsed', newCount.toString());

        // Используем константы из фичи wisdom
        if (newCount >= MAX_REQUESTS) {
            setIsLimitExhausted(true);
            const now = Math.floor(Date.now() / 1000);
            const expirationTime = now + (RESET_INTERVAL_MS / 1000); // Конвертируем мс в секунды
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
        quotesLeft: Math.max(0, MAX_REQUESTS - quotesUsed)
    };
};