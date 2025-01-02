import React, { useState } from "react";
import { FaUserAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addUser, queryUserByUsername, queryUserByEmail } from "../utils/dynamoDB"; // 引入 DynamoDB 工具
import { v4 as uuidv4 } from "uuid";
import bcrypt from 'bcryptjs'; // 引入 bcrypt
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // 模擬註冊處理
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 檢查密碼是否匹配
    if (password !== confirmPassword) {
      setErrorMessage("密碼與確認密碼不匹配");
      return;
    }

    if (username && email && password) {
      try {
        const existingUsers = await queryUserByUsername(username);
        if (existingUsers.length > 0) {
          setErrorMessage("此帳號已被使用");
          return;
        }

        const existingEmails = await queryUserByEmail(email);
        if (existingEmails.length > 0) {
          setErrorMessage("此電子郵件已被使用");
          return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userID = uuidv4();
        await addUser(userID, username, email, hashedPassword);
        alert("註冊成功！");
        // 跳轉到登入頁面
        navigate("/login");
      } catch (error) {
        console.error("註冊失敗:", error);
        setErrorMessage("系統錯誤，請稍後再試");
      }
    } else {
      setErrorMessage("請填寫所有欄位");
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
          註冊
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

          {/* 電子郵件欄位 */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              電子郵件
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaEnvelope className="ml-3 mr-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-5 pr-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="輸入電子郵件"
              />
            </div>
          </div>

          {/* 密碼欄位 */}
          <div className="mb-5">
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

          {/* 確認密碼欄位 */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-medium text-gray-700"
            >
              確認密碼
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FaLock className="ml-3 mr-4 text-gray-400" />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pl-5 pr-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="再次輸入密碼"
              />
            </div>
          </div>

          {/* 註冊按鈕 */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              註冊
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            我要登入
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
