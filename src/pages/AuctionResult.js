import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AuctionResult.css';

function AuctionResult() {
  const urlParams = new URLSearchParams(window.location.search);
  const { propertyId } = useParams();  // 确保这里的参数名与你的路由定义匹配
  const sellerID = urlParams.get('sellerId');
  const [csrfToken, setCsrfToken] = useState('');
  const [result, setResult] = useState(null);
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);  // 控制弹窗显示
  const [trackingNumber, setTrackingNumber] = useState('');  // UPS跟踪号
  const [showRatingSuccessModal, setShowRatingSuccessModal] = useState(false);
  const [showAcceptOfferModal, setShowAcceptOfferModal] = useState(false);

  useEffect(() => {
    if (propertyId) {  // 确保propertyId已定义
      const url = `http://127.0.0.1:8000/get_auction_result/${propertyId}`;
      console.log(`Fetching data from: ${url}`);
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => setResult(data))
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
        });
    }
  }, [propertyId]);  // 依赖数组中包含propertyId以确保变化时重新调用

      // 添加评分函数
const handleRating = () => {
  console.log('Rating operation started:', result);
  if (result && result.winner_id) {
    const winnerId = result.winner_id;
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error('No user ID found, cannot proceed with rating.');
      return;
    }
    // 这里不需要将winnerId放入ratingData，因为它已经通过URL传递
    const ratingData = { rating, message };  // 确保这里使用了正确的rating和message变量
    console.log('Sending rating data with seller ID:', userId, ratingData);

    fetch(`http://localhost:8000/rate_winner/${winnerId}?sellerId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ratingData)  // 直接传递ratingData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Rating response:', data);
      setShowRatingSuccessModal(true);  // 设置评分成功的状态
      setTimeout(() => {
          setShowRatingSuccessModal(false);  // 2秒后自动隐藏消息
        }, 2000);
    })
    .catch(error => {
      console.error('Error rating winner:', error);
    });
  } else {
    console.error('No result or winner ID to rate.');
  }
};
    
const handleShippingGift = () => {
    setShowModal(true);
    // 假设的生成跟踪号逻辑
    setTrackingNumber(`1Z${Math.random().toString().slice(2, 12)}`);
  };

const handleCompleteShipping = () => {
  const shippingData = {
    seller_id: result ? result.seller_id : 0,
    winner_id: result ? result.winner_id : 0,
    trackingNumber
  };

  console.log('Sending shipping data:', shippingData);

  fetch('http://localhost:8000/api/shipping', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(shippingData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Shipping response:', data);
    setShowModal(false); // 关闭弹窗
  })
  .catch(error => {
    console.error('Error sending shipping data:', error);
  });
};
  
const handleAcceptOffer = () => {
console.log('Accepting offer for property:', propertyId);

fetch(`http://localhost:8000/update_property_status/${propertyId}/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  },
  body: JSON.stringify({ is_active: false }) 
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  console.log('Property status updated:', data);
  setShowAcceptOfferModal(true);
  setTimeout(() => setShowAcceptOfferModal(false), 2000);
})
.catch(error => {
  console.error('Error updating property status:', error);
});
};
  
  return (
    <div className="auction-results-container">
      {result ? (
        <div>
          <h1 className="auction-results-title">Auction Result for Property ID: {propertyId}</h1>
          <p>Winner ID: {result.winner_id}</p>
          <p>Sale Price: {result.sale_price}</p>
          <div>
            <label className="auction-results-label" htmlFor="rating">Rating:</label>
            <input
              className="auction-results-input"
              type="number"
              id="rating"
              value={rating}
              onChange={e => setRating(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="message">Message:</label>
            <textarea
              className="input"
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
            <button className="auction-results-button" onClick={handleRating}>Rate Winner</button>
            {showRatingSuccessModal && (
              <div className="modal">
                <div className="modal-content">
                  <p>Rate Successful!</p>
                  <button onClick={() => setShowRatingSuccessModal(false)}>Close</button>
                </div>
              </div>
            )}
          <button className="auction-results-button" onClick={handleShippingGift}>Shipping Gift</button>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <p>UPS Tracking Number: {trackingNumber}</p>
                <button onClick={handleCompleteShipping}>Complete Shipping</button>
              </div>
            </div>
          )}
          <button className="auction-results-button" onClick={handleAcceptOffer}>Accept Offer</button>
            {showAcceptOfferModal && (
              <div className="modal">
                <div className="modal-content">
                  <p>You already accept a buyer!</p>
                  <button onClick={() => setShowAcceptOfferModal(false)}>Close</button>
                </div>
              </div>
          )}
        </div>
          
      ) : (
        <p>Loading auction result...</p>
      )}
    </div>
    
  );
}

export default AuctionResult;
