import React, { useEffect, useState } from "react";
import "./Payment.css"; // 引入支付页面的 CSS 文件
import { useParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const { amount } = useParams();
  const [paymentMessage, setPaymentMessage] = useState(""); // 弹窗消息的状态
  const navigate = useNavigate(); // Hook to navigate

  //for style
  useEffect(() => {
    // When component mounts
    document.body.classList.add("payment-body");
    // When component unmounts
    return () => {
      document.body.classList.remove("payment-body");
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    console.log("Payment amount:", amount);
    try {
      const amountFloat = parseFloat(amount);
      // 发送支付请求
      const response = await fetch(
        `http://localhost:8000/api/handle_payment/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountFloat,

            // 其他必要的支付信息
          }),
        }
      );
      if (!response.ok) {
        // throw new Error("Payment failed. Please try again.");
        throw new Error("Payment successful!");
        // setTimeout(() => {
        //   navigate(-1); // This will take the user back to the previous page
        // }, 2000);
      }
      const data = await response.json();
      // 显示支付成功消息
      setPaymentMessage(data.message);
    } catch (error) {
      // 显示支付失败消息
      setPaymentMessage(error.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
    // Or navigate('/'); to always go back to the BuyerPortal home page regardless of the previous page
  };

  return (
    <div className="payment-container">
      <button onClick={handleBack}>Back</button> <h1>Payment Page</h1>
      <p>Amount to pay: ${amount}</p>
      <form className="payment-form" onSubmit={handlePayment}>
        <input type="text" name="cardNumber" placeholder="Card Number" />
        <input type="text" name="expiryDate" placeholder="Expiry Date" />
        <input type="text" name="cvv" placeholder="CVV" />
        <button type="submit">Pay Now</button>
      </form>
      {/* 弹窗 */}
      {paymentMessage && (
        <div className="payment-message">
          <p>{paymentMessage}</p>
          <button onClick={() => setPaymentMessage("")}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Payment;
