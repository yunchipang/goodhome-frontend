import React, { useState, useEffect } from 'react';
import './SellerPortal.css'; // 导入样式文件
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate hook
import logoImage from '../img/goodhomelogo.jpg';
import userAvatar from '../img/user-avatar.jpg';

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
    zipcode: '',
    image_url: null
  });
  const [file, setFile] = useState(null);

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

  const formData = new FormData();
  formData.append('title', newProperty.title);
  formData.append('property_descr', newProperty.property_descr);
  formData.append('category', newProperty.category);
  formData.append('start_bid_amount', newProperty.start_bid_amount);
  formData.append('seller_id', newProperty.seller_id);
  formData.append('created_at', newProperty.created_at);
  formData.append('address', newProperty.address);
  formData.append('squarefeet', newProperty.squarefeet);
  formData.append('room_type', newProperty.room_type);
  formData.append('zipcode', newProperty.zipcode);
  formData.append('is_active', newProperty.is_active);
  // 确保您已经有一个 state 来保存文件
  if (file) {
    formData.append('image_url', file);
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/upload_property/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken, // 保留 CSRF 令牌
      },
      credentials: 'include',
      body: formData, // 使用 FormData 对象
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
        zipcode: '',
        image_url: null
      });
      fetchSellerProperties();
    } else {
      console.error('Failed to upload property');
    }
  } catch (error) {
    console.error('Error uploading property:', error.message);
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
    navigate(`/property/${propertyId}`);
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
          <input type="number" name="seller_id" placeholder="Seller ID" value={newProperty.seller_id} onChange={handleInputChange} autoComplete="off" />
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
                <img src={`http://127.0.0.1:8000/media/${property.image_url}`} alt={property.title} className="property-image" />
                <div className="button-container">
                  <button className="action-button" onClick={() => handleViewDetails(property.id)}>View Details</button>
                  <button className="action-button" onClick={() => handleAcceptOffer(property.id)}>Accept Offer</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SellerPortal;
