const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface Coin {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
}

export const cryptoAPI = {
    // Fetch all coins
    async getAllCoins(limit: number = 100): Promise<Coin[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/coins?limit=${limit}`);
            if (!response.ok) {
                throw new Error('Failed to fetch coins');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching coins:', error);
            throw error;
        }
    },

    // Get pinned coins
    async getPinnedCoins(): Promise<Coin[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/pinned`);
            if (!response.ok) {
                throw new Error('Failed to fetch pinned coins');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching pinned coins:', error);
            throw error;
        }
    },

    // Pin a coin
    async pinCoin(coinId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/pin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ crypto_id: coinId }),
            });
            if (!response.ok) {
                throw new Error('Failed to pin coin');
            }
        } catch (error) {
            console.error('Error pinning coin:', error);
            throw error;
        }
    },

    // Unpin a coin
    async unpinCoin(coinId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/unpin/${coinId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to unpin coin');
            }
        } catch (error) {
            console.error('Error unpinning coin:', error);
            throw error;
        }
    },
};