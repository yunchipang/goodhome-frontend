// property_details.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PropertyDetails.css';

function PropertyDetails() {
  const { propertyId } = useParams();  // 获取路由参数
  const [propertyDetails, setPropertyDetails] = useState(null);

  useEffect(() => {
    // 假设有一个函数来获取房产详细信息
    fetchPropertyDetails(propertyId)
      .then(data => setPropertyDetails(data))
      .catch(error => console.error('Error fetching property details:', error));
  }, [propertyId]);

  // 获取房产详细信息的函数（需要根据你的实际API调整）
  async function fetchPropertyDetails(id) {
    const response = await fetch(`http://127.0.0.1:8000/get_property_details/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    return await response.json();
  }

  return (
    <div className="property-details-container">
      {propertyDetails ? (
        <div>
          <h1>{propertyDetails.title}</h1>
          {/* <img src={`http://127.0.0.1:8000/media/${propertyDetails.image_url}`} alt={propertyDetails.title} /> */}
          <img src={propertyDetails.image_url} alt={propertyDetails.title} />
          <p>{propertyDetails.property_descr}</p>
          <p>Category: {propertyDetails.category}</p>
          <p>Address: {propertyDetails.address}</p>
          <p>Square Feet: {propertyDetails.squarefeet}</p>
          <p>Room Type: {propertyDetails.room_type}</p>
          <p>Zipcode: {propertyDetails.zipcode}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PropertyDetails;
