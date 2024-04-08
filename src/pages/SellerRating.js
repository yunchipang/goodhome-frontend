import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./SellerRating.css";

function SellerRating() {
  //   const [sellerId, setSellerId] = useState(null);
  const { sellerId } = useParams(); // 从URL参数中获取sellerId
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");

  //   添加评分函数;
  const handleRating = () => {
    console.log("Rating operation started:", sellerId);
    if (sellerId) {
      const ratingData = { seller_id: sellerId, rating, message };
      console.log("Sending rating data:", ratingData);

      fetch(`http://localhost:8000/rate_seller/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ratingData), // 直接传递ratingData
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Rating response:", data);
        })
        .catch((error) => {
          console.error("Error rating seller:", error);
        });
    } else {
      console.error("No seller ID to rate.");
    }
  };

  return (
    <div className="container">
      {sellerId ? (
        <div>
          <h1 className="title">Rate Seller</h1>
          <p>Seller ID: {sellerId}</p>
          <div>
            <label className="label" htmlFor="rating">
              Rating:
            </label>
            <input
              className="input"
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="message">
              Message:
            </label>
            <textarea
              className="input"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button className="button" onClick={handleRating}>
            Rate Seller
          </button>
        </div>
      ) : (
        <p>Loading seller ID...</p>
      )}
    </div>
  );
}

export default SellerRating;
