// src/BuyerPortal.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerPortal.css";

const BuyerPortal = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Pass the location state or any necessary data to the PropertyList component
    navigate("/properties", { state: { location } });
  };

  // You can remove or comment out the handleSubmit function that navigates to /results
  /*
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/results", { state: { location } });
  };
  */

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      // Here, implement the logic to convert the lat/lng to a zipcode and update the location state
      // This example does not directly convert lat/lng to a zipcode but you would typically use a geocoding API for this
    });
  };

  // Add this function to handle navigation to the buyhistory page
  const handleNavigateToBuyHistory = () => {
    navigate("/buyhistory"); // Adjust the path as necessary
  };

  return (
    <div className="buyer-portal">
      <h1>Buyer Portal</h1>
      <form onSubmit={handleSearch} className="search-form">
        {" "}
        {/* Use handleSearch here */}
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter a zipcode"
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={handleCurrentLocation} className="current-location-btn">
        Use Current Location
      </button>
      <button onClick={handleNavigateToBuyHistory} className="buy-history-btn">
        View Buy History
      </button>
    </div>
  );
};

export default BuyerPortal;
