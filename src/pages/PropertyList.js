// src/PropertyList.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PropertyList.css"; // Ensure this path matches the location of your CSS file
import Modal from "./Modal";
import { toast } from "react-toastify";
import ChatButton from "../components/ChatButton";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchLocation = location.state?.location; // Accessing the location state passed from BuyerPortal
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState(""); // 添加了对 bidAmount 的定义和初始化

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

  // 处理点击物业的事件
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();

    // Assuming this data structure matches what your Django view expects
    const bidData = {
      bidder: 1, // Example bidder ID
      auction: selectedProperty.id, // Make sure this matches an existing auction ID
      amount: bidAmount,
    };

    fetch("http://localhost:8000/api/bid/upload/", {
      // Update the URL if needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Remove Authorization header if you're not using tokens or any form of authentication
      },
      body: JSON.stringify(bidData),
    })
      .then((response) => {
        if (!response.ok) {
          // 当响应状态码不是200时，尝试解析响应体以获取错误信息
          return response.json().then((err) => {
            throw new Error(err.error || "Network response was not ok");
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Bid successful:", data);
        toast.success("Bid submitted successfully!");
        setIsModalOpen(false);
        setBidAmount("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(error.message);
      });
  };

  // todo: replace it with the actual selle of the property
  const theOtherUserId = 28;

  return (
    <div className="property-list-container">
      <button onClick={handleBack}>Back</button>{" "}
      {/* Add this line for the Back button */}
      <h2>Available Properties</h2>
      <div className="property-list">
        {properties.map((property) => (
          <div
            key={property.id}
            className="property-item"
            onClick={() => handlePropertyClick(property)}
          >
            <img src={property.image_url} alt={property.title} />
            <h3>{property.title}</h3>
            <p>{property.property_descr}</p>
            <p>Start Bid: ${property.start_bid_amount}</p>
            <p>Address: {property.address}</p>
            <p>Square Feet: {property.squarefeet}</p>
            <p>Room Type: {property.room_type}</p>
            <p>Zip Code: {property.zipcode}</p>
            <ChatButton theOtherUserId={theOtherUserId} />
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Bid on: {selectedProperty?.title}</h3>
        <form onSubmit={handleBidSubmit}>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`Higher than $${selectedProperty?.start_bid_amount}`}
            min={selectedProperty?.start_bid_amount}
          />
          <button type="submit">Submit Bid</button>
        </form>
      </Modal>
    </div>
  );
};

export default PropertyList;
