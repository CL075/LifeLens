import React, { useState, useEffect } from "react";
import { queryUserByUsername, updateUserData, getUserIDByUsername, updateUserDataByID } from "../utils/dynamoDB";
import bcrypt from "bcryptjs";

const Profile = () => {
  // user 資料
  const [user, setUser] = useState({
    username: "",
    email: "",
    picture: "https://via.placeholder.com/150",
  });

  // 控制編輯表單顯示的狀態
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function updateUser(username, updatedData) {
    try {
      const userID = await getUserIDByUsername(username);
      await updateUserDataByID(userID, updatedData);
      console.log("用戶資料更新成功！");
    } catch (error) {
      console.error("更新用戶資料失敗：", error);
    }
  }
  // console.log("user.email 的值:", user.email);
  // console.log("user.name 的值:", user.name);
  console.log("user:", user);



  useEffect(() => {
    // 从 localStorage 获取用户数据
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    const savedPicture = localStorage.getItem("userPicture");
    if (savedUser) {
      setUser({
        username: typeof savedUser.username === "object" ? savedUser.username.S : savedUser.username,
        email: savedUser.email?.S || savedUser.email, // 解包多層結構
        picture:  savedPicture || "https://via.placeholder.com/150",
      });
    }
  }, []);
  
  const handleSave = async () => {
    try {
      // 構造更新數據
      const updatedUser = {
        username: newUsername,
      };
  
      // 如果有新密碼，進行加密處理
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updatedUser.pwHash = hashedPassword;
      }
  
      console.log("提交的更新數據:", updatedUser);
  
      // 調用更新後端資料的函數
      await updateUser(user.username, updatedUser);
  
      // 更新本地狀態
      setUser((prevUser) => ({
        ...prevUser,
        username: newUsername,
      }));
  
      alert("資料已更新！");
      toggleEditForm(); // 關閉編輯表單
    } catch (error) {
      console.error("更新失敗：", error);
      alert("更新失敗，請稍後再試！");
    }
  };
  
  

  useEffect(() => {
    // 從資料庫取得用戶資料
    const fetchUserData = async () => {
      const username = localStorage.getItem("username"); // 從 localStorage 取得用戶名
      const userData = await queryUserByUsername(username);
      if (userData.length > 0) {
        const userInfo = userData[0];
        setUser({
          username: userInfo.username?.S || userInfo.username,
          email: userInfo.email?.S || userInfo.email, // 解包多層結構
          picture: userInfo.picture?.S || userInfo.picture || "https://via.placeholder.com/150",
        });
        setNewUsername(userInfo.username.S);
      }
    };

    fetchUserData();
  }, []);


  const handleImageClick = () => {
    document.getElementById("fileInput").click(); // 點擊圖片後，觸發文件選擇框
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;// 轉換成 Base64 Data URL
        setUser((prevUser) => ({
          ...prevUser,
          picture: imageData, // 設置選擇的圖片為新頭像
        }));
        localStorage.setItem("userPicture", imageData);
      };
      reader.readAsDataURL(file); // 讀取文件並轉換為 Data URL
    }
  };

  // 開啟或關閉編輯表單
  const toggleEditForm = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // 更新用户数据
    const updatedUser = {
      ...user,
      username: newUsername,
    };
  
    setUser(updatedUser);
  
    // 更新 localStorage
    localStorage.setItem("userData", JSON.stringify(updatedUser));
  
    setIsEditing(false); // 关闭编辑表单
  };
  

  
  

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-center pt-6">
          <img
            src={user.picture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 cursor-pointer"
            onClick={handleImageClick} // 點擊圖片觸發更新
          />
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange} // 監聽文件選擇變更
          />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {typeof user.username === "object" ? user.username.S : user.username}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {typeof user.email === "object" ? user.email.S : user.email}
            </p>
        </div>
        <div className="mt-6 p-4">
          <button
            onClick={toggleEditForm}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            編輯資料
          </button>
        </div>
      </div>

      {/* 編輯表單，當 isEditing 為 true 時顯示 */}
      {isEditing && (
        <EditForm
          newUsername={newUsername}
          newPassword={newPassword}
          setNewUsername={setNewUsername}
          setNewPassword={setNewPassword}
          toggleEditForm={toggleEditForm}
          setUser={setUser}
          handleSave={handleSave} // 將 handleSave 傳遞到子組件
        />
      )}
    </div>
  );
};

// 編輯表單元件
const EditForm = ({
  newUsername,
  newPassword,
  setNewUsername,
  setNewPassword,
  toggleEditForm,
  setUser,
  handleSave,
}) => {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-semibold text-center mb-4">編輯資料</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">用戶名</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">電子郵件</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">密碼 (選填)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="輸入新密碼"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          保存
        </button>
        <button
          onClick={toggleEditForm}
          className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg"
        >
          取消
        </button>
      </div>
    </div>
  );
};

export default Profile;
