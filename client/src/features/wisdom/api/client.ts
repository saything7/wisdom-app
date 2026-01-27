import { WISDOM_API_CONFIG } from './config';

export interface QuoteResponse {
    quote: string;
    count: number;
}

export const wisdomApi = {
    async fetchRandomQuote(): Promise<QuoteResponse> {
        const url = `${WISDOM_API_CONFIG.BASE_URL}${WISDOM_API_CONFIG.ENDPOINTS.RANDOM_QUOTE}`;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Стетхем устал. Попробуйте позже!');
            }
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return response.json();
    },
};