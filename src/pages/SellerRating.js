import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SellerRating.css";

function SellerRating() {
  //   const [sellerId, setSellerId] = useState(null);
  const { sellerId } = useParams(); // 从URL参数中获取sellerId
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");
  const [isRatingSuccess, setIsRatingSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for navigating

  //成功提示弹窗
  const showSuccessModal = () => {
    setIsRatingSuccess(true);
    setTimeout(() => {
      setIsRatingSuccess(false);
      navigate(-1); // This will take the user back to the previous page
    }, 2000); // Change to 2000 ms for 2 seconds
  };

  //   添加评分函数;
  //   const handleRating = () => {
  //     console.log("Rating operation started:", sellerId);
  //     if (sellerId) {
  //       const ratingData = { seller_id: sellerId, rating, message };
  //       console.log("Sending rating data:", ratingData);

  //       fetch(`http://localhost:8000/rate_seller/${sellerId}`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(ratingData), // 直接传递ratingData
  //       })
  //         .then((response) => {
  //           if (!response.ok) {
  //             throw new Error(`HTTP error! status: ${response.status}`);
  //           }
  //           return response.json();
  //         })
  //         .then((data) => {
  //           console.log("Rating response:", data);
  //         })
  //         .catch((error) => {
  //           console.error("Error rating seller:", error);
  //         });
  //     } else {
  //       console.error("No seller ID to rate.");
  //     }
  //   };
  const handleRating = async () => {
    if (sellerId && rating) {
      const ratingData = { seller_id: sellerId, rating, message };
      try {
        const response = await fetch(
          `http://localhost:8000/rate_seller/${sellerId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ratingData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showSuccessModal(); // Show the success modal
      } catch (error) {
        console.error("Error rating seller:", error);
      }
    } else {
      console.error("Seller ID and rating are required.");
    }
  };

  return (
    <div className="container">
      {sellerId ? (
        <>
          {isRatingSuccess && (
            <div className="success-modal">Rating Successful!</div>
          )}
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
        </>
      ) : (
        <p>Loading seller ID...</p>
      )}
    </div>
  );
}

export default SellerRating;
