import React, { useContext } from 'react';
import './Navbar.css';
import arrow_icon from '../../assets/arrow_icon.png';
import { CoinContext } from '../../context/CoinContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="app-header">
                <h1>Crypto-Tracker</h1>
            </div>
        </div>
    );
};

export default Navbar;