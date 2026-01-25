import React from 'react';
import styles from './WisdomButton.module.css';

interface WisdomButtonProps {
    onGetWisdom: () => Promise<void>;
    loading: boolean;
}

const WisdomButton: React.FC<WisdomButtonProps> = ({ onGetWisdom, loading }) => {
    return (
        <button
            className={styles.button}
            onClick={onGetWisdom}
            disabled={loading}
        >
            {loading ? (
                <>
                    <span className={styles.spinner}></span>
                    Загрузка...
                </>
            ) : (
                'Дай мне мудрость'
            )}
        </button>
    );
};

export default WisdomButton;