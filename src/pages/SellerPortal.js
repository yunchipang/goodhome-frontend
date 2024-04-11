import React, { useState, useEffect } from 'react';
import './SellerPortal.css'; // 导入样式文件
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate hook
import logoImage from '../img/goodhomelogo.jpg';
import userAvatar from '../img/user-avatar.jpg';

function SellerPortal() {
  // const [csrfToken, setCsrfToken] = useState('');
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
    zipcode: '',
    image_url: null
  });
  const [file, setFile] = useState(null);

  // 使用 useNavigate hook 获取 navigate 函数
  const navigate = useNavigate();

  useEffect(() => {
  // fetch('http://127.0.0.1:8000/get-csrf/', {
    //   credentials: 'include', // 确保发送 cookies（如果你的 Django 后端设置了 'SameSite=Lax' 或者 'SameSite=Strict'）
    // })
    // .then(response => response.json())
    // .then(data => setCsrfToken(data.csrfToken))
    // .catch(error => console.error('Error fetching CSRF token:', error));
    fetchSellerProperties();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  // const handlePropertySubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://127.0.0.1:8000/upload_property/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-CSRFToken': csrfToken, // 使用 CSRF 令牌
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(newProperty)
  //     });
  //     if (response.ok) {
  //       console.log('Property uploaded successfully');
  //       setNewProperty({
  //       category: '',
  //       start_bid_amount: '',
  //       seller_id: '',
  //       created_at: '',
  //       property_descr: '',
  //       title: '',
  //       is_active: true,
  //       address: '',
  //       squarefeet: '',
  //       room_type: '',
  //       zipcode: ''
        
  //     });
  //       fetchSellerProperties();
  //     } else {
  //       console.error('Failed to upload property');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading property:', error.message); // 输出具体错误信息
  //   }
  // };

  const handlePropertySubmit = async (e) => {
  e.preventDefault();
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found, please login first');
    return;
  }

  // 将用户 ID 设置为上传属性对象的卖家 ID
  const propertyWithSellerId = { ...newProperty, seller_id: userId };

  const formData = new FormData();
  Object.keys(propertyWithSellerId).forEach(key => formData.append(key, propertyWithSellerId[key]));
  if (file) {
    formData.append('image_url', file);
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/upload_property/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    console.log(response)
    if (response.ok) {
      console.log('Property uploaded successfully');
      // Reset form and fetch updated properties list
      setNewProperty({
        category: '',
        start_bid_amount: '',
        created_at: '',
        property_descr: '',
        title: '',
        is_active: true,
        address: '',
        squarefeet: '',
        room_type: '',
        zipcode: '',
      });
      setFile(null);
      fetchSellerProperties();
    } else {
      const errorData = await response.json();
      alert(`Failed to upload property: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error uploading property:', error);
    alert('Error uploading property');
  }
};





  const fetchSellerProperties = async () => {
    try {

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('User ID not found in local storage');
        // 在此处添加适当的错误处理
        return;
      }
      const response = await fetch(`http://127.0.0.1:8000/get_properties/${userId}/`);
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
    navigate(`/property/${propertyId}`);
    console.log('View details of property with id:', propertyId);
  };

  const handleAcceptOffer = (propertyId) => {
    navigate(`/auction-result/${propertyId}`);
    console.log('Accept offer for property with id:', propertyId);
  };

  // 返回homepage的函数
  const handleGoBack = () => {
    navigate('/'); // 使用 navigate 函数将用户导航回 homepage
  };
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({
    propertyId: null,
    current_highest_bid: null,
    startTime: '',
    endTime: ''
  });

  const handleStartAuction = (propertyId) => {
    setShowAuctionModal(true);
    setAuctionDetails({
      ...auctionDetails,
      propertyId: propertyId,
    });
  };

  const handleAuctionChange = (e) => {
    const { name, value } = e.target;
    setAuctionDetails({
      ...auctionDetails,
      [name]: value
    });
  };

  const handleAuctionSubmit = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/get_auctions_time/${auctionDetails.propertyId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 添加验证头部如果需要
      },
      body: JSON.stringify({ startTime: auctionDetails.startTime,
        endTime: auctionDetails.endTime })
    });

    if (response.ok) {
      console.log('Auction started successfully');
      // 这里可以添加成功后的逻辑
    } else {
      console.error('Failed to start auction');
    }
  } catch (error) {
    console.error('Error starting auction:', error);
  }
  setShowAuctionModal(false);
};


  return (
    <div className="seller-portal-container">
      <div className="seller-portal-header">
        <button onClick={handleGoBack}>&larr;</button>
        <div className="seller-portal-logo">
          <img src={logoImage} alt="Logo" /> {/* 使用 logo 图片 */}
        </div>
        <div className="user-avatar">
          <img src={userAvatar} alt="User Avatar" />
        </div>
      </div>
      <h1 className="portal-title">Seller Portal</h1>
     <div className="content-container">
        <form className="property-form" onSubmit={handlePropertySubmit}>
          <input type="text" name="title" placeholder="Title" value={newProperty.title} onChange={handleInputChange} autoComplete="off" />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea name="property_descr" placeholder="Description" value={newProperty.property_descr} onChange={handleInputChange} autoComplete="off" />
          <input type="text" name="category" placeholder="Category" value={newProperty.category} onChange={handleInputChange} autoComplete="off" />
          <input type="text" name="start_bid_amount" placeholder="Start Bid Amount" value={newProperty.start_bid_amount} onChange={handleInputChange} autoComplete="off" />
          {/* <input type="number" name="seller_id" placeholder="Seller ID" value={newProperty.seller_id} onChange={handleInputChange} autoComplete="off" /> */}
          <input type="datetime-local" name="created_at" placeholder="Created At" value={newProperty.created_at} onChange={handleInputChange} autoComplete="off" />
          <input type="text" name="address" placeholder="Address" value={newProperty.address} onChange={handleInputChange} autoComplete="off" />
          <input type="number" name="zipcode" placeholder="Zipcode" value={newProperty.zipcode} onChange={handleInputChange} autoComplete="off" />
          <input type="number" name="squarefeet" placeholder="Square Feet" value={newProperty.squarefeet} onChange={handleInputChange} autoComplete="off" />
          <input type="text" name="room_type" placeholder="Room Type" value={newProperty.room_type} onChange={handleInputChange} autoComplete="off" />
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
              <li key={property.property_id} className="property-item">
                <p className="property-name">{property.title}</p>
                <p className="property-description">{property.property_descr}</p>
                <img src={property.image_url} alt={property.title} className="property-image" />
                <div className="button-container">
                  <button className="action-button" onClick={() => handleViewDetails(property.id)}>View Details</button>
                  <button className="action-button" onClick={() => handleAcceptOffer(property.id)}>Accept Offer</button>
                  <button className="action-button" onClick={() => handleStartAuction(property.id)}>Start Auction</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
    </div>
    {showAuctionModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Start Auction </h2>
            <label htmlFor="startTime">Start Time:</label>
            <input type="datetime-local" id="startTime" name="startTime" value={auctionDetails.startTime} onChange={handleAuctionChange} />
            <label htmlFor="endTime">End Time:</label>
            <input type="datetime-local" id="endTime" name="endTime" value={auctionDetails.endTime} onChange={handleAuctionChange} />
            <div className="modal-buttons">
              <button onClick={handleAuctionSubmit}>Confirm Auction</button>
              <button onClick={() => setShowAuctionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* {showAuctionModal && (
        <div className="modal">
          <h2>Start Auction for Property ID: {auctionDetails.propertyId}</h2>
          <input
            type="datetime-local"
            name="startTime"
            value={auctionDetails.startTime}
            onChange={handleAuctionChange}
            placeholder="Start Time"
          />
          <input
            type="datetime-local"
            name="endTime"
            value={auctionDetails.endTime}
            onChange={handleAuctionChange}
            placeholder="End Time"
          />
          <button onClick={handleAuctionSubmit}>Confirm Auction</button>
          <button onClick={() => setShowAuctionModal(false)}>Cancel</button>
        </div>
    )} */}
    </div>
  );
}

export default SellerPortal;
