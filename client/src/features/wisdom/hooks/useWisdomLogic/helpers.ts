export const getErrorMessage = (resultAction: any): string => {
    if (typeof resultAction.error === 'string') {
        return resultAction.error;
    }
    if (resultAction.error?.message) {
        return resultAction.error.message;
    }
    if (resultAction.payload) {
        return String(resultAction.payload);
    }
    return 'Unknown error';
};

export const isRateLimitError = (errorMessage: string): boolean => {
    return errorMessage.includes('Стетхем устал') ||
        errorMessage.includes('Rate limit') ||
        errorMessage.includes('429');
};