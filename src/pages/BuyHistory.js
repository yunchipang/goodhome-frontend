import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BuyHistory.css";

const BuyHistory = () => {
  const [winners, setWinners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/buyhistory/")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setWinners(data.winners))
      .catch((error) => console.error("Error fetching buy history:", error));
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
    // Or navigate('/'); to always go back to the BuyerPortal home page regardless of the previous page
  };

  const handlePay = (winner) => {
    // 此处实现支付逻辑
    console.log(
      `Paying for bid amount: ${winner.bid_amount} on property: ${winner.property_address}`
    );
    // 可能是跳转到支付页面或打开支付模态框
  };

  return (
    <div className="buy-history-container">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>{" "}
      <h1 className="buy-history-title">My Winning Bids</h1>
      <ul className="history-list">
        {winners.map((winner, index) => (
          <li key={index} className="history-item">
            <div className="history-item-details">
              <p className="property-address">
                Property: {winner.property_address}
              </p>
              <p className="bid-amount">Winning Bid: ${winner.bid_amount}</p>
            </div>
            <button
              className="pay-button"
              onClick={() => handlePayment(winner.id)}
            >
              Pay Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Assuming you have a function to handle payment
function handlePayment(winnerId) {
  console.log(`Paying for winner ID: ${winnerId}`);
  // Payment logic here
}

export default BuyHistory;