import React, { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import bcrypt from 'bcryptjs'; // 引入 bcrypt
import { queryUserByUsername  } from "../utils/dynamoDB"; // 確保可以查詢用戶

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // 模擬登入處理
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   // 假設的登入邏輯
  //   if (username === "admin" && password === "12345") {
  //     alert("登入成功!");
  //     // 跳轉到主頁面，這裡可以使用 `useNavigate` 或其他路由工具
  //   } else {
  //     setErrorMessage("用戶名或密碼錯誤");
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userRecords = await queryUserByUsername(username);
      if (userRecords.length === 0) {
        setErrorMessage("帳號或密碼錯誤");
        return;
      }

      const user = userRecords[0];
      const isPasswordValid = await bcrypt.compare(password, user.pwHash.S);
      if (!isPasswordValid) {
        setErrorMessage("帳號或密碼錯誤");
      } else {
        alert("登入成功！");
        // 可跳轉到主頁
      }
    } catch (error) {
      console.error("登入失敗:", error);
      setErrorMessage("系統錯誤，請稍後再試");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h1
          className="text-blue-600 text-4xl font-bold transition-all duration-300 px-2 py-1 rounded-md hover:bg-blue-600 hover:text-white hover:scale-105 text-center"
          style={{ fontFamily: "Chewy, cursive" }}
        >
          <Link to="/" className="">
            Life Lens
          </Link>
        </h1>
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          登入
        </h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* 用戶名欄位 */}
          <div className="mb-5">
            <label
              htmlFor="username"
              className="block text-lg font-medium text-gray-700"
            >
              帳號
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaUserAlt className="ml-3 mr-4 text-gray-400" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-5 pr-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="輸入帳號"
              />
            </div>
          </div>

          {/* 密碼欄位 */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              密碼
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="ml-3 mr-4 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-5 pr-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="輸入密碼"
              />
            </div>
          </div>

          {/* 登入按鈕 */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              登入
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-500 hover:underline">
            註冊
          </a>
        </div>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-red-500 hover:underline">
            不知道要不要做忘記密碼
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
