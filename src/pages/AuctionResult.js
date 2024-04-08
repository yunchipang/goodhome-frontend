import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AuctionResult.css';

function AuctionResult() {
  const { propertyId } = useParams();  // 确保这里的参数名与你的路由定义匹配
  const [result, setResult] = useState(null);
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (propertyId) {  // 确保propertyId已定义
      fetch(`http://127.0.0.1:8000/get_auction_result/${propertyId}`)
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
    // 这里不需要将winnerId放入ratingData，因为它已经通过URL传递
    const ratingData = { rating, message };  // 确保这里使用了正确的rating和message变量
    console.log('Sending rating data:', ratingData);

    fetch(`http://localhost:8000/rate_winner/${winnerId}`, {
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
    })
    .catch(error => {
      console.error('Error rating winner:', error);
    });
  } else {
    console.error('No result or winner ID to rate.');
  }
};
    
  return (
    <div className="container">
      {result ? (
        <div>
          <h1 className="title">Auction Result for Property ID: {propertyId}</h1>
          <p>Winner ID: {result.winner_id}</p>
          <p>Sale Price: {result.sale_price}</p>
          <div>
            <label className="label" htmlFor="rating">Rating:</label>
            <input
              className="input"
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
          <button className="button" onClick={handleRating}>Rate Winner</button>
        </div>
      ) : (
        <p>Loading auction result...</p>
      )}
    </div>
  );
}

export default AuctionResult;
