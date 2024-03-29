// src/PropertyList.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyList.css"; // Ensure this path matches the location of your CSS file

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchLocation = location.state?.location; // Accessing the location state passed from BuyerPortal

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
    // Or navigate('/'); to always go back to the BuyerPortal home page regardless of the previous page
  };

  useEffect(() => {
    // Placeholder URL - replace with your actual API endpoint
    const apiUrl = `http://localhost:8000/api/bid/properties?zipcode=${encodeURIComponent(
      searchLocation || ""
    )}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setProperties(data))
      .catch((error) => console.error("Error fetching property data:", error));
  }, [searchLocation]);

  return (
    <div className="property-list-container">
      <button onClick={handleBack}>Back</button>{" "}
      {/* Add this line for the Back button */}
      <h2 className="property-list-title">Available Properties</h2>
      {properties.length > 0 ? (
        properties.map((property) => (
          <div key={property.id} className="property-card">
            <h3>{property.title}</h3>
            <p>{property.property_descr}</p>
            <div className="property-info">
              <div>
                <label>Starting Bid:</label> ${property.start_bid_amount}
              </div>
              <div>
                <label>Address:</label> {property.address}
              </div>
              <div>
                <label>Square Feet:</label> {property.squarefeet ?? "N/A"}
              </div>
              <div>
                <label>Room Type:</label> {property.room_type ?? "N/A"}
              </div>
              <div>
                <label>zipcode:</label> {property.zipcode}
              </div>
              {/* Add more property details as needed */}
            </div>
          </div>
        ))
      ) : (
        <p>No properties found.</p>
      )}
    </div>
  );
};

export default PropertyList;
