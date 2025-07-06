import React, { useEffect, useState } from 'react';
import './Home.css';
import { useCoin, Coin } from '../../hooks/useCoin';

const Home = () => {

  const { allCoin, pinnedCoins, togglePinCoin, isPinned, isLoading, error } = useCoin();

  const [displayCoin, setDisplayCoin] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState('');

  const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedCoin(selectedValue);
    
    if (selectedValue === "") {
      
      setDisplayCoin(allCoin);
    } else {
      // Filter to show only the selected coin
      const filteredCoins = allCoin.filter((item: Coin) => {
        return item.name === selectedValue;
      });
      setDisplayCoin(filteredCoins);
    }
  }

  const handlePinToggle = (event: React.MouseEvent, coin: Coin) => {
    event.preventDefault();
    event.stopPropagation();
    togglePinCoin(coin);
  }

  useEffect(() => {
    setDisplayCoin(allCoin);
  }, [allCoin]);

  if (isLoading) {
    return (
      <div className='home'>
        <div className="app-header">
          <h1>Crypto-Tracker</h1>
        </div>
        <div className="hero">
          <h2>Loading cryptocurrencies...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='home'>
        <div className="app-header">
          <h1>Crypto-Tracker</h1>
        </div>
        <div className="hero">
          <h2>Error loading data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
      <div className='home'>
        <div className="app-header">
          <h1>Crypto-Tracker</h1>
        </div>

        <div className="hero">
          <h2>Track Your <br/> Favorite Crypto</h2>
          <div className="select-container">
            <select
                onChange={selectHandler}
                value={selectedCoin}
                className="crypto-select"
            >
                <option value="">All Cryptocurrencies</option>
                {allCoin.map((item: Coin, index: number) => (
                    <option key={index} value={item.name}>
                        {item.name} ({item.symbol.toUpperCase()})
                    </option>
                ))}
            </select>
          </div>
        </div>

        {pinnedCoins.length > 0 && (
            <div className="pinned-section">
              <h2>📌 Pinned Cryptocurrencies</h2>
              <div className="crypto-table pinned-table">
                <div className="table-layout">
                  <p>#</p>
                  <p>Coins</p>
                  <p>Price</p>
                  <p>Pin</p>
                </div>
                {pinnedCoins.map((item: Coin, index: number) => (
                    <div className="table-layout" key={index}>
                      <p>{item.market_cap_rank}</p>
                      <div>
                        <img src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                      </div>
                      <p>${item.current_price.toLocaleString()}</p>
                      <button
                          className="pin-button pinned"
                          onClick={(e) => handlePinToggle(e, item)}
                          title="Unpin"
                      >
                        📌
                      </button>
                    </div>
                ))}
              </div>
            </div>
        )}

        <div className="all-coins-section">
          <h2>All Cryptocurrencies</h2>
          <div className="crypto-table">
            <div className="table-layout">
              <p>#</p>
              <p>Coins</p>
              <p>Price</p>
              <p>Pin</p>
            </div>
            {displayCoin.slice(0, 20).map((item: Coin, index: number) => (
                <div className="table-layout" key={index}>
                  <p>{item.market_cap_rank}</p>
                  <div>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </div>
                  <p>${item.current_price.toLocaleString()}</p>
                  <button
                      className={`pin-button ${isPinned(item.id) ? 'pinned' : 'unpinned'}`}
                      onClick={(e) => handlePinToggle(e, item)}
                      title={isPinned(item.id) ? "Unpin" : "Pin"}
                  >
                    {isPinned(item.id) ? '📌' : '📍'}
                  </button>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Home;