import { createContext, useEffect, useState, ReactNode } from "react";
import { cryptoAPI, Coin } from "../services/api";

interface CoinContextType {
    allCoin: Coin[];
    pinnedCoins: Coin[];
    togglePinCoin: (coin: Coin) => void;
    isPinned: (coinId: string) => boolean;
    isLoading: boolean;
    error: string | null;
}

export const CoinContext = createContext<CoinContextType | undefined>(undefined);

interface CoinContextProviderProps {
    children: ReactNode;
}

const CoinContextProvider = ({ children }: CoinContextProviderProps) => {
    const [allCoin, setAllCoin] = useState<Coin[]>([]);
    const [pinnedCoins, setPinnedCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all coins from backend
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

    // Fetch pinned coins from backend
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

    // Toggle pin status
    const togglePinCoin = async (coin: Coin) => {
        try {
            const isAlreadyPinned = pinnedCoins.some(pinnedCoin => pinnedCoin.id === coin.id);
            
            if (isAlreadyPinned) {
                await cryptoAPI.unpinCoin(coin.id);
                setPinnedCoins(prevPinned => prevPinned.filter(pinnedCoin => pinnedCoin.id !== coin.id));
            } else {
                await cryptoAPI.pinCoin(coin.id);
                setPinnedCoins(prevPinned => [...prevPinned, coin]);
            }
        } catch (err) {
            console.error('Error toggling pin status:', err);
            // Refresh pinned coins to ensure UI is in sync with backend
            fetchPinnedCoins();
        }
    };

    const isPinned = (coinId: string) => {
        return pinnedCoins.some(coin => coin.id === coinId);
    };

    // Initial data fetch
    useEffect(() => {
        fetchAllCoin();
        fetchPinnedCoins();
        
        // Set up polling to refresh data every 2 minutes (reduced from 30 seconds)
        const interval = setInterval(() => {
            console.log('Auto-refreshing data...');
            fetchAllCoin();
            fetchPinnedCoins();
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    const contextValue: CoinContextType = {
        allCoin,
        pinnedCoins,
        togglePinCoin,
        isPinned,
        isLoading,
        error
    };

    return (
        <CoinContext.Provider value={contextValue}>
            {children}
        </CoinContext.Provider>
    );
};

export default CoinContextProvider;
export type { Coin };