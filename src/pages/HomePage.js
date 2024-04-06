import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';

const HomePage = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
    }, []); // Empty dependency array ensures useEffect runs only once

    return (
        <header>
            <nav>
                <input type="checkbox" id="check" />
                <label htmlFor="check" id="check-btn">
                    <i className="fas fa-bars"></i>
                </label>
                <h1 style={{ fontSize: '36px', color: '#ffffff' }}>Good Home</h1>
                <ul>
                    <li><a href="#">Contact</a></li>
                    {username ? (
                        <li>Welcome, {username}</li>
                    ) : (
                        <li><Link to="/signuplogin">Register/Sign In</Link></li>
                    )}
                </ul>
            </nav>
            <div className="background-container"></div>
            <div className="head">
                <h1>
                    Where Dreams<br />
                    Find Their Address!
                </h1>
                <p>We prioritize ensuring every transaction is a win-win for both buyers and sellers.</p>
                <div className="button-container">
                    <button className="seller-btn">SELLER</button>
                    <button className="buyer-btn">BUYER</button>
                </div>
            </div>
        </header>
    );
};

export default HomePage;
