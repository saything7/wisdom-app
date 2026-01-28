import React from 'react';
import styles from './WisdomButton.module.css'; // Создадим отдельный CSS модуль

interface WisdomButtonProps {
    onGetWisdom: () => Promise<void>;
    loading: boolean;
    disabled: boolean;
    showSpinner?: boolean;
}

export const WisdomButton: React.FC<WisdomButtonProps> = ({
                                                       onGetWisdom,
                                                       loading,
                                                       disabled,
                                                       showSpinner = false
                                                   }) => {
    return (
        <button
            onClick={onGetWisdom}
            disabled={disabled || loading}
            className={`${styles.wisdomButton} ${showSpinner ? styles.spinning : ''}`}
            aria-label={showSpinner ? "Поиск мудрости..." : "Получить мудрость"}
        >
            {showSpinner ? (
                <div className={styles.buttonSpinner} />
            ) : (
                'Дай пожалуйста мне мудрость, ' +
                'я знаю, что я читер :('
            )}
        </button>
    );
};

