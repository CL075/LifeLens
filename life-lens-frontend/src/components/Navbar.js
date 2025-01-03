import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  // 嘗試從 localStorage 讀取登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    return storedLoginStatus === "true"; // 如果有儲存登入狀態且為 "true"，則為已登入
  });
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 更新登入狀態並保存至 localStorage
  const toggleLogin = () => {
    const newStatus = !isLoggedIn;
    setIsLoggedIn(newStatus);
    localStorage.setItem("isLoggedIn", newStatus.toString()); // 更新 localStorage 中的登入狀態
  };

  // 登出時清除 localStorage 的登入狀態
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // 清除 localStorage 中的登入狀態
    alert("已登出");
  };


  return (
    <nav className="bg-blue-500 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* 將 Home 功能放在左邊的 Life Lens 標題上，字體稍微大一點 */}
        <h1
          className="text-4xl font-bold transition-all duration-300 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white hover:scale-105"
          style={{ fontFamily: "Chewy, cursive" }}
        >
          <Link to="/" className="">
            Life Lens
          </Link>
        </h1>
        {/* 右邊的選單 */}
        <div className="flex items-center space-x-4">
          {/* 作弊按鈕，控制登入登出狀態 */}
          {/* <button
            onClick={toggleLogin}
            className="px-1 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all duration-300"
          >
            {isLoggedIn ? "作弊登出" : "作弊登入"}
          </button> */}

          {/* 登入後顯示其他選項 */}
          {isLoggedIn ? (
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/diary"
                  className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  我的日記
                </Link>
              </li>
              <li>
                <Link
                  to="/record"
                  className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  紀錄日常
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  儀表板和洞察
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  個人資料
                </Link>
              </li>
            </ul>
          ) : (
            // 登入前顯示登入選項
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
                >
                  登入
                </Link>
              </li>
            </ul>
          )}

          {/* 登出按鈕*/}
          {isLoggedIn && (
            <Link
              to="/"
              onClick={handleLogout}
              className="px-4 py-2 rounded-md hover:bg-white hover:text-blue-500 transition-all duration-300"
            >
              登出
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
