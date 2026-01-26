import React, { useState, useEffect } from 'react';
import styles from './WisdomButton.module.css';

export interface WisdomButtonProps {
    onGetWisdom: () => Promise<void>;
    loading: boolean;
    minimumLoadTime?: number;
    disabled?: boolean;
}

const WisdomButton: React.FC<WisdomButtonProps> = ({
                                                       onGetWisdom,
                                                       loading,
                                                       minimumLoadTime = 2000,
                                                       disabled = false
                                                   }) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (internalLoading) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 100 / (minimumLoadTime / 50);
                });
            }, 50);
        } else {
            setProgress(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [internalLoading, minimumLoadTime]);

    const handleClick = async () => {
        if (loading || internalLoading || disabled) return;

        setInternalLoading(true);
        setProgress(0);

        try {
            await onGetWisdom();
        } catch (err) {
            console.error('Ошибка в кнопке:', err);
        } finally {
            setTimeout(() => {
                setInternalLoading(false);
            }, minimumLoadTime);
        }
    };

    const isButtonDisabled = disabled || loading || internalLoading;

    return (
        <div className={styles.container}>
            <button
                className={`${styles.button} ${isButtonDisabled ? styles.disabled : ''}`}
                onClick={handleClick}
                disabled={isButtonDisabled}
            >
                {internalLoading ? 'Загрузка...' : 'Дай мне мудрость'}
            </button>

            {internalLoading && (
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {disabled && !loading && !internalLoading && (
                <div className={styles.disabledMessage}>
                    Стетхем устал, приходите позже!
                </div>
            )}
        </div>
    );
};

export default WisdomButton;