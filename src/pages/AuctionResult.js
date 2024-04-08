import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function AuctionResult() {
  const { auctionId } = useParams();  // 获取路由参数，此处auctionId对应于propertyId
  const [result, setResult] = useState(null);

  useEffect(() => {
    // 根据auctionId获取拍卖结果，此URL需要根据后端API进行调整
    fetch(`http://127.0.0.1:8000/get_auction_result/${auctionId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setResult(data))
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }, [auctionId]);

  return (
    <div>
      {result ? (
        <div>
          <h1>Auction Result for Property ID: {auctionId}</h1>
          <p>Winner ID: {result.user_id}</p>
          <p>Sale Price: {result.sale_price}</p>
          {/* 这里可以根据需要展示更多信息 */}
        </div>
      ) : (
        <p>Loading auction result...</p>
      )}
    </div>
  );
}

export default AuctionResult;
