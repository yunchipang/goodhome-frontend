import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./HomePage.css";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  //for style
  useEffect(() => {
    // When component mounts
    document.body.classList.add("homepage-body");

    // When component unmounts
    return () => {
      document.body.classList.remove("homepage-body");
    };
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername(null);
    }
  }, []); // Empty dependency array ensures useEffect runs only once

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include", // This includes cookies in the request
      });
      if (response.ok) {
        // Logout successful
        navigate("/homepage");
        // localStorage.clear();
        // // Redirect the user to the login page or homepage
        // window.location.href = '/signup-login'; // Redirect to the homepage
      } else {
        // Logout failed
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

    // Handler for seller button click
  const handleSellerButtonClick = () => {
      navigate('/seller-portal'); // Adjust the path as needed
  };

  // Function to handle buyer button click
  const handleBuyerButtonClick = () => {
      navigate('/buyer-portal'); // Make sure this is the correct path
  };


  return (
    <header>
      <nav>
        <input type="checkbox" id="check" />
        <label htmlFor="check" id="check-btn">
          <i className="fas fa-bars"></i>
        </label>
        <h1 style={{ fontSize: "36px", color: "#ffffff" }}>Good Home</h1>
        <ul>
          <li>
            <a href="#">Contact</a>
          </li>
          {username ? (
            <li className="dropdown" onClick={toggleDropdown}>
              <span className="dropdown-toggle">Welcome, {username}</span>
              {showDropdown && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/chathistory">Chat History</Link>
                  </li>
                  <li>
                    <Link to="/sellerportal">Seller Portal</Link>
                  </li>
                  <li>
                    <Link to="/buyerportal">Buyer Portal</Link>
                  </li>
                  {/* <li><Link to="/logout">Log Out</Link></li> */}
                  <li>
                    <Link to="/logout" onClick={handleLogout}>
                      Log Out
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            // Handle the case where the username is not found
            <li>
              <Link to="/signuplogin">Register/Sign In</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="background-container"></div>
      <div className="head">
        <h1>
          Where Dreams
          <br />
          Find Their Address!
        </h1>
        <p>
          We prioritize ensuring every transaction is a win-win for both buyers
          and sellers.
        </p>
        <div className="button-container">
          <button className="seller-btn" onClick={handleSellerButtonClick}>SELLER</button>
          <button className="buyer-btn" onClick={handleBuyerButtonClick}>BUYER</button>
        </div>
      </div>
    </header>
  );  
};

export default HomePage;
