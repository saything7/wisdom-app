import React from 'react';
import {QuoteDisplay} from '../QuoteDisplay';
import {WisdomButton} from '../WisdomButton';
import styles from './MainContent.module.css';

interface MainContentProps {
    quote: string | null;
    totalLoading: boolean;
    showQuoteWithDelay: boolean;
    hasInitialClick: boolean;
    isLimitExhausted: boolean;
    showInitialButton: boolean;
    onGetWisdom: () => Promise<void>;
}

export const MainContent: React.FC<MainContentProps> = ({
                                                            quote,
                                                            totalLoading,
                                                            showQuoteWithDelay,
                                                            hasInitialClick,
                                                            isLimitExhausted,
                                                            showInitialButton,
                                                            onGetWisdom
                                                        }) => {
    if (quote && !totalLoading && showQuoteWithDelay) {
        return (
            <>
                <div className={styles.quoteContainer}>
                    <QuoteDisplay quote={quote} shouldAnimate={true}/>
                </div>
                <div className={styles.newQuoteContainer}>
                    <button
                        onClick={onGetWisdom}
                        className={styles.newQuoteButton}
                          disabled={isLimitExhausted || totalLoading}
                    >
                        📜 Новая цитата
                    </button>
                </div>
            </>
        );
    }

    if (showInitialButton) {
        return (
            <button
                onClick={onGetWisdom}
                className={styles.initialButton}
                disabled={isLimitExhausted}
            >
                Поделись со мной своей мудростью,
                Джейсон Стэйтэм!
            </button>
        );
    }

    return (
        <WisdomButton
            onGetWisdom={onGetWisdom}
            loading={totalLoading}
            disabled={isLimitExhausted}
            showSpinner={totalLoading}
        />
    );
};