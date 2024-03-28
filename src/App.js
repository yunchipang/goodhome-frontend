import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import SellerPortal from './pages/SellerPortal';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Update the URL to match your backend app's URL
    // Assuming your Django app is running on localhost:8000 and has an endpoint `api/message`
    const apiUrl = "http://localhost:8000/";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("There was an error!", error);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <Router>
      <Routes> {/* 使用Routes替代Switch */}
        <Route path="/seller-portal" element={<SellerPortal />} />
        {/* 使用element属性替代component，传入组件实例 */}
        {/* 其他路由配置 */}
      </Routes>
    </Router>
  );
}

export default App;
