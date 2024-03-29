import React, { useState, useEffect } from 'react';
import './SellerPortal.css'; // 导入样式文件
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate hook
import logoImage from '../img/goodhomelogo.jpg';

function SellerPortal() {
  const [csrfToken, setCsrfToken] = useState('');
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    category: '',
    start_bid_amount: '',
    seller_id: '',
    created_at: '',
    property_descr: '',
    title: '',
    is_active: true,
    address: '',
    squarefeet: '',
    room_type: '',
    zipcode: ''
  });

  // 使用 useNavigate hook 获取 navigate 函数
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get-csrf/', {
      credentials: 'include', // 确保发送 cookies（如果你的 Django 后端设置了 'SameSite=Lax' 或者 'SameSite=Strict'）
    })
    .then(response => response.json())
    .then(data => setCsrfToken(data.csrfToken))
    .catch(error => console.error('Error fetching CSRF token:', error));

    fetchSellerProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/upload_property/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // 使用 CSRF 令牌
        },
        credentials: 'include',
        body: JSON.stringify(newProperty)
      });
      if (response.ok) {
        console.log('Property uploaded successfully');
        setNewProperty({
        category: '',
        start_bid_amount: '',
        seller_id: '',
        created_at: '',
        property_descr: '',
        title: '',
        is_active: true,
        address: '',
        squarefeet: '',
        room_type: '',
        zipcode: ''
        
      });
        fetchSellerProperties();
      } else {
        console.error('Failed to upload property');
      }
    } catch (error) {
      console.error('Error uploading property:', error.message); // 输出具体错误信息
    }
  };

  const fetchSellerProperties = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/get_properties/');
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

  // 返回homepage的函数
  const handleGoBack = () => {
    navigate('/'); // 使用 navigate 函数将用户导航回 homepage
  };

  return (
    <div className="seller-portal-container">
      <div className="seller-portal-header">
        <button onClick={handleGoBack}>Go Back</button>
        <div className="seller-portal-logo">
          <img src={logoImage} alt="Logo" /> {/* 使用 logo 图片 */}
        </div>
        <div className="user-avatar"></div>
      </div>
      <h1 className="portal-title">Seller Portal</h1>
      <form className="property-form" onSubmit={handlePropertySubmit}>
        <input type="text" name="title" placeholder="Title" value={newProperty.title} onChange={handleInputChange} />
        <textarea name="property_descr" placeholder="Description" value={newProperty.property_descr} onChange={handleInputChange} />
        <input type="text" name="category" placeholder="Category" value={newProperty.category} onChange={handleInputChange} />
        <input type="text" name="start_bid_amount" placeholder="Start Bid Amount" value={newProperty.start_bid_amount} onChange={handleInputChange} />
        <input type="number" name="seller_id" placeholder="Seller ID" value={newProperty.seller_id} onChange={handleInputChange} />
        <input type="datetime-local" name="created_at" placeholder="Created At" value={newProperty.created_at} onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Address" value={newProperty.address} onChange={handleInputChange} />
        <input type="number" name="zipcode" placeholder="Zipcode" value={newProperty.zipcode} onChange={handleInputChange} />
        <input type="number" name="squarefeet" placeholder="Square Feet" value={newProperty.squarefeet} onChange={handleInputChange} />
        <input type="text" name="room_type" placeholder="Room Type" value={newProperty.room_type} onChange={handleInputChange} />
        <label>
          Is Active:
          <input type="checkbox" name="is_active" checked={newProperty.is_active} onChange={(e) => setNewProperty({ ...newProperty, is_active: e.target.checked })} />
        </label>
        <button type="submit">Upload Property</button>
      </form>
      <div className="property-list-container">
        <h2 className="property-list-title">Uploaded Properties</h2>
        <ul className="property-list">
          {properties.map((property) => (
            <li key={property.id} className="property-item">
               <p className="property-name">{property.title}</p>
              <p className="property-description">{property.property_descr}</p>
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
