import React, { useState, useEffect } from 'react';
import './SellerPortal.css'; // 导入样式文件

function SellerPortal() {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    propertyName: '',
    propertyDescription: ''
  });

  useEffect(() => {
    fetchSellerProperties();
  }, []);

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProperty)
      });
      if (response.ok) {
        setNewProperty({ propertyName: '', propertyDescription: '' });
        fetchSellerProperties();
      } else {
        console.error('Failed to upload property');
      }
    } catch (error) {
      console.error('Error uploading property:', error);
    }
  };

  const fetchSellerProperties = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT');
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        console.error('Failed to fetch seller properties');
      }
    } catch (error) {
      console.error('Error fetching seller properties:', error);
    }
  };

  const handleViewDetails = (propertyId) => {
    console.log('View details of property with id:', propertyId);
  };

  const handleAcceptOffer = (propertyId) => {
    console.log('Accept offer for property with id:', propertyId);
  };

  return (
    <div className="seller-portal-container">
      <h1 className="portal-title">Seller Portal</h1>
      <form className="property-form" onSubmit={handlePropertySubmit}>
        <input 
          className="property-input" 
          type="text" 
          placeholder="Property Name" 
          value={newProperty.propertyName} 
          onChange={(e) => setNewProperty({ ...newProperty, propertyName: e.target.value })} 
        />
        <textarea 
          className="property-input" 
          placeholder="Property Description" 
          value={newProperty.propertyDescription} 
          onChange={(e) => setNewProperty({ ...newProperty, propertyDescription: e.target.value })} 
        />
        <button className="submit-button" type="submit">Upload Property</button>
      </form>
      <div className="property-list-container">
        <h2 className="property-list-title">Uploaded Properties</h2>
        <ul className="property-list">
          {properties.map((property) => (
            <li key={property.id} className="property-item">
              <p>{property.propertyName}</p>
              <p>{property.propertyDescription}</p>
              <div className="button-container">
                <button className="action-button" onClick={() => handleViewDetails(property.id)}>View Details</button>
                <button className="action-button" onClick={() => handleAcceptOffer(property.id)}>Accept Offer</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SellerPortal;
