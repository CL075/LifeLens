import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // 引入 Navbar
import Footer from "../components/Footer"; // 引入 Footer

const Home = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!isLoggedIn) {
    window.location.href = "/login"; // 未登录则跳转到登录页
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col items-center justify-center py-8">
        <h2
          className="text-4xl font-semibold text-blue-600 mb-6"
          style={{ fontFamily: "Chewy, cursive" }}
        >
          Welcome to Life Lens
        </h2>
        <p className="text-lg text-gray-700 text-center mb-8">
          Life Lens
          是一個幫助你追蹤生活習慣、分析趨勢並改善生活品質的工具。隨時了解你的日常行為，並提升自我。
        </p>
        <p>歡迎, {userData?.username || "用户"}!</p>
      </div>
    </div>
  );
};

export default Home;
