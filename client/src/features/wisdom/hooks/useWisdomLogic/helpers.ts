interface ErrorResult {
    error?: string | { message?: string };
    payload?: unknown;
}

export const getErrorMessage = (resultAction: unknown): string => {
    const action = resultAction as ErrorResult;

    if (typeof action.error === 'string') {
        return action.error;
    }
    if (action.error && typeof action.error === 'object' && 'message' in action.error) {
        return String(action.error.message);
    }
    if (action.payload) {
        return String(action.payload);
    }
    return 'Unknown error';
};

export const isRateLimitError = (errorMessage: string): boolean => {
    return errorMessage.includes('Стетхем устал') ||
        errorMessage.includes('Rate limit') ||
        errorMessage.includes('429');
};