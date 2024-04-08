import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css'


const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const { id } = useParams();

    useEffect(() => {
        fetchUserInfo(userId);
    }, [userId]);

    const fetchUserInfo = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/profile/${id}`);
            if (response.ok) {
                const userData = await response.json();
                setUserInfo(userData);
                setFormData(userData);
            } else {
                console.error('Failed to fetch user information');
            }
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setFormData(userInfo);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8000/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setUserInfo(formData);
                setEditing(false);
            } else {
                console.error('Failed to update user information');
            }
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            {userInfo ? (
                <div>
                    {editing ? (
                        <div>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} />
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                            <input type="password" name="password" value={formData.password} onChange={handleChange} />
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                            <input type="text" name="mailingAddress" value={formData.mailingAddress} onChange={handleChange} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <p>Email: {userInfo.email}</p>
                            <p>First Name: {userInfo.firstName}</p>
                            <p>Last Name: {userInfo.lastName}</p>
                            <p>Password: ********</p> {/* Do not display the password */}
                            <p>Phone: {userInfo.phone}</p>
                            <p>Mailing Address: {userInfo.mailingAddress}</p>
                            <button onClick={handleEdit}>Edit</button>
                        </div>
                    )}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Profile;
