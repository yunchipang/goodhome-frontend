import React, { useState, useEffect } from 'react';
import './AdminFeature.css';

const AdminFeature = () => {
    const [userStats, setUserStats] = useState({ total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 检查是否有管理员权限
        const isAdmin = localStorage.getItem('is_admin') === 'true'; // 假设你已经在登录时保存了这个信息
        if (!isAdmin) {
            alert('You do not have permission to access this page.');
            window.location.href = '/'; // 重定向到首页或登录页
            return;
        }

        // 如果用户是管理员，则继续获取数据
        fetch('http://localhost:8000/admin_feature/stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setUserStats({
                total: data.total_users
            });
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching user statistics:', error);
            setLoading(false); // 在发生错误时也应停止加载状态
        });
    }, []);

    if (loading) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="stats">
                <h2>User Statistics</h2>
                <p>Total Users: {userStats.total}</p>
            </div>
            <button onClick={() => {
                localStorage.clear();
                window.location.href = '/signuplogin';
            }} className="logout-button">Logout</button>
        </div>
    );
};

export default AdminFeature;
