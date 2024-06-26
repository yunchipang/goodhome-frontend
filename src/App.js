import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SellerPortal from "./pages/SellerPortal";
import BuyerPortal from "./pages/BuyerPortal";
import PropertyList from "./pages/PropertyList";
import HomePage from "./pages/HomePage";
import SignupLogin from "./pages/SignupLogin";
import Profile from "./pages/Profile";
import BuyHistory from "./pages/BuyHistory";
import SellerRating from "./pages/SellerRating";
import { ToastContainer } from "react-toastify"; // 导入ToastContainer
import "react-toastify/dist/ReactToastify.css"; // 导入样式文件
// import Logout from "./pages/HomePage";
import Payment from "./pages/Payment";
import PropertyDetails from './pages/PropertyDetails';
import AuctionResult from './pages/AuctionResult';
import ChatPage from "./pages/ChatPage";
import ChatRoomWrapper from "./components/ChatRoomWrapper";
import QueryExecutor from "./pages/QueryExecutor";
import AdminFeature from "./pages/AdminFeature";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

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
      // eslint-disable-next-line no-unused-vars
      .then((data) => setMessage(data))
      .catch((error) => {
        console.error("There was an error!", error);
        setMessage("Failed to load message");
      });
  }, []);

  return (
    <Router>
      <Routes>
        {" "}
        {/* 使用Routes替代Switch */}
        <Route path="/seller-portal" element={<SellerPortal />} />
        <Route path="/buyer-portal" element={<BuyerPortal />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminFeature />} />
        <Route path="/signuplogin" element={<SignupLogin />} />
        <Route path="/logout" element={<HomePage />} />{" "}
        {/* Add the logout route */}
        <Route path="/profile" element={<Profile username={username} />} />
        <Route path="/buyhistory" element={<BuyHistory />} />
        <Route path="/payment/:amount" element={<Payment />} />
        <Route path="/sellerrating/:sellerId" element={<SellerRating />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/auction-result/:propertyId" element={<AuctionResult />} />
        {/* 使用element属性替代component，传入组件实例 */}
        {/* 其他路由配置 */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomWrapper />} />
        <Route path="/query" element={<QueryExecutor />} />
      </Routes>
      <ToastContainer /> {/* 在应用的顶层添加ToastContainer */}
    </Router>
  );
}

export default App;
