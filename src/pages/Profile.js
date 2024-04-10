import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import styles

const Profile = ({ username, onclose }) => {
    // You can add profile-related logic here
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                // Make a fetch request to your backend API to fetch profile data
                const response = await fetch("http://localhost:8000/profile/", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    // If the request is successful, parse the response as JSON
                    const data = await response.json();
                    // Set the profile data in the state
                    setProfileData(data);
                } else {
                    // If the request fails, log an error
                    console.error('Failed to fetch profile data:', response.status);
                }
            } catch (error) {
                // If an error occurs during the fetch request, log it
                console.error('Error fetching profile data:', error);
            }
        };

        // Call the fetchProfileData function when the component mounts
        fetchProfileData();
    }, [username]);

    const handleClose = () => {
        // Navigate back to the homepage
        console.log('Close button clicked'); 
        navigate('/');
    };
    

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile</h2>
                <button className="close-btn" onClick={handleClose}>Close</button>
            </div>
            <div className="profile-content">
                
                {/* Add other profile information */}
                {/* <p>First Name: {firstName}</p>
                <p>Last Name: {lastName}</p>
                <p>Email: {email}</p>
                <p>Phone: {phone}</p> */}
                {profileData && (
                    <>
                        <p>Username: {profileData.username}</p>
                        <p>First Name: {profileData.first_name}</p>
                        <p>Last Name: {profileData.last_name}</p>
                        <p>Email: {profileData.email}</p>
                        <p>Phone: {profileData.phone}</p>
                        <p>Address: {profileData.address}</p>
                        {/* Add more profile information as needed */}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
