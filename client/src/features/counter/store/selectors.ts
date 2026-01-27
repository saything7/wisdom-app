import { RootState } from '@/app/store';

export const selectSessionCount = (state: RootState) => state.counter.sessionCount;
export const selectTotalCount = (state: RootState) => state.counter.totalCount;
export const selectMaxRequests = (state: RootState) => state.counter.maxRequests;