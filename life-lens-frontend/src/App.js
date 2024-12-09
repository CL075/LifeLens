import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // 引入 Navbar
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import Record from "./pages/Record";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  useEffect(() => {
    document.title = "Life Lens"; // 設定視窗名稱
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* 這裡判斷是否顯示 Navbar */}
        <Routes>
          {/* 當訪問 Login 頁面時，不顯示 Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <div className="py-8">
                  {" "}
                  {/* 增加上下間距 */}
                  <Home />
                </div>
              </>
            }
          />
          <Route
            path="/diary"
            element={
              <>
                <Navbar />
                <div className="py-8">
                  {" "}
                  {/* 增加上下間距 */}
                  <Diary />
                </div>
              </>
            }
          />
          <Route
            path="/record"
            element={
              <>
                <Navbar />
                <div className="py-8">
                  {" "}
                  {/* 增加上下間距 */}
                  <Record />
                </div>
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Navbar />
                <div className="py-8">
                  {" "}
                  {/* 增加上下間距 */}
                  <Dashboard />
                </div>
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <div className="py-8">
                  {" "}
                  {/* 增加上下間距 */}
                  <Profile />
                </div>
              </>
            }
          />
        </Routes>

        {/* 全局頁腳 */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
