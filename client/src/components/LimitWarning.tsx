import React from 'react';

interface LimitWarningProps {
    remainingRequests: number;
    maxRequests: number;
}

export const LimitWarning: React.FC<LimitWarningProps> = ({
                                                              remainingRequests,
                                                              maxRequests,
                                                          }) => {
    if (remainingRequests > 2 || remainingRequests <= 0) return null;

    return (
        <div className="limit-warning">
            {remainingRequests === 1 ? (
                <p>⚠️ Остался 1 запрос из {maxRequests}</p>
            ) : (
                <p>⚠️ Осталось {remainingRequests} запроса из {maxRequests}</p>
            )}
        </div>
    );
};