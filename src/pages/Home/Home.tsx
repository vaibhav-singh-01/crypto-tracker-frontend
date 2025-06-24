import React, { useContext, useEffect, useState } from 'react';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';
import { Coin } from '../../context/CoinContext'; // Import Coin interface

const Home = () => {
  const context = useContext(CoinContext);

  // Check if context exists before destructuring
  if (!context) {
    return <div>Loading...</div>;
  }

  const { allCoin, pinnedCoins, togglePinCoin, isPinned, isLoading, error } = context;

  const [displayCoin, setDisplayCoin] = useState<Coin[]>([]);
  const [input, setInput] = useState('');

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
    }
  }

  const searchHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const coins = allCoin.filter((item: Coin) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
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
        <div className="hero">
          <h1>Loading cryptocurrencies...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='home'>
        <div className="hero">
          <h1>Error loading data</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
      <div className='home'>
        <div className="hero">
          <h1>Track Your <br/> Favorite Crypto</h1>
          <form onSubmit={searchHandler}>
            <input
                onChange={inputHandler}
                list='coinlist'
                value={input}
                type="text"
                placeholder='Search crypto..'
                required
            />
            <datalist id='coinlist'>
              {allCoin.map((item: Coin, index: number) => (
                  <option key={index} value={item.name}/>
              ))}
            </datalist>
            <button type="submit">Search</button>
          </form>
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