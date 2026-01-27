export interface UIStatus {
    remainingRequests: number;
    canMakeRequest: boolean;
    timeLeft: number;
    shouldShowTimer: boolean;
    isTimerActive: boolean;
    isLimitExhausted: boolean;
}