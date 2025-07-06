import { useState, useEffect } from 'react';
import { cryptoAPI, Coin } from '../services/api';

export const useCoin = () => {
    const [allCoin, setAllCoin] = useState<Coin[]>([]);
    const [pinnedCoins, setPinnedCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch suggestions
    const fetchAllCoin = async () => {
        try {
            setError(null);
            console.log('Fetching all coins from backend...');
            const coins = await cryptoAPI.getAllCoins();
            setAllCoin(coins);
            console.log(`Fetched ${coins.length} coins from backend`);
        } catch (err) {
            setError('Failed to fetch coins');
            console.error('Error fetching coins:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch pinned 
    const fetchPinnedCoins = async () => {
        try {
            console.log('Fetching pinned coins from backend...');
            const pinned = await cryptoAPI.getPinnedCoins();
            setPinnedCoins(pinned);
            console.log(`Fetched ${pinned.length} pinned coins from backend`);
        } catch (err) {
            console.error('Error fetching pinned coins:', err);
        }
    };

    // Toggle pin 
    const togglePinCoin = async (coin: Coin) => {
        try {
            const isAlreadyPinned = pinnedCoins.some(pinnedCoin => pinnedCoin.id === coin.id);
            
            if (isAlreadyPinned) {
                await cryptoAPI.unpinCoin(coin.id);
                console.log(`Unpinned ${coin.name} - refreshing prices...`);
            } else {
                await cryptoAPI.pinCoin(coin.id);
                console.log(`Pinned ${coin.name} - refreshing prices...`);
            }
            
            // Always refresh after pin/unpin
            await fetchPinnedCoins();
            
        } catch (err) {
            console.error('Error toggling pin status:', err);
            fetchPinnedCoins();
        }
    };

    // Check pinned
    const isPinned = (coinId: string) => {
        return pinnedCoins.some(coin => coin.id === coinId);
    };

    // Refresh 
    const refreshData = () => {
        fetchAllCoin();
        fetchPinnedCoins();
    };

    useEffect(() => {
        fetchAllCoin();
        fetchPinnedCoins();
        
        // refresh every 2 mins
        const interval = setInterval(() => {
            console.log('Auto-refreshing data...');
            fetchAllCoin();
            fetchPinnedCoins();
        }, 120000); 

        // Cleanup 
        return () => clearInterval(interval);
    }, []); 

    return {
        allCoin,
        pinnedCoins,
        togglePinCoin,
        isPinned,
        isLoading,
        error,
        refreshData
    };
};

export type { Coin }; 