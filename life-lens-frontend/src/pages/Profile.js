import React, { useState, useEffect } from "react";

const Profile = () => {
  // 假設 user 資料
  const [user, setUser] = useState({
    username: "admin",
    email: "admin@mail.com",
    picture: "https://via.placeholder.com/150", // 預設圖片
  });

  // 控制編輯表單顯示的狀態
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user.email);

  const handleImageClick = () => {
    document.getElementById("fileInput").click(); // 點擊圖片後，觸發文件選擇框
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          picture: reader.result, // 設置選擇的圖片為新頭像
        }));
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
    // 在這裡處理用戶更新邏輯（例如，更新用戶名、密碼等）
    setUser((prevUser) => ({
      ...prevUser,
      username: newUsername,
      email: newEmail,
    }));
    setIsEditing(false); // 提交後關閉編輯表單
  };

  useEffect(() => {
    // 獲取當前用戶資料
    const fetchUserData = async () => {
      try {
        // const userData = await Auth.currentAuthenticatedUser();
        // setUser(userData);
      } catch (error) {
        console.error("無法獲取用戶資料", error);
      }
    };

    fetchUserData();
  }, []);

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
            {user.username}
          </h2>
          <p className="text-sm text-gray-500 mt-2">{user.email}</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-semibold text-center mb-4">編輯資料</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  用戶名
                </label>
                <input
                  id="username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  電子郵件
                </label>
                <input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  密碼
                </label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  提交
                </button>
                <button
                  type="button"
                  onClick={toggleEditForm}
                  className="ml-4 text-gray-500 hover:text-gray-700"
                >
                  X
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
