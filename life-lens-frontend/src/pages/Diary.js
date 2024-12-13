import React, { useState } from "react";
import { useEffect } from "react"; // 新增
import { queryEntries } from "../utils/dynamoDB"; // 新增


// 輔助函數：計算一年前的今天日期
const getOneYearAgoDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 1);
  console.log("today", today);
  return today.toISOString().split("T")[0]; // 格式化為 YYYY-MM-DD
};

const Diary = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTimeCapsule, setShowTimeCapsule] = useState(false); // 用來控制顯示時光膠囊紀錄
  const [showModal, setShowModal] = useState(false); // 控制彈跳視窗顯示
  const [timeCapsuleRecord, setTimeCapsuleRecord] = useState(null); // 用來存儲一年前的紀錄

  const [records, setRecords] = useState([
    {
      date: "2024/12/01",
      mood: "happy",
      note: "今天很開心，去了公園散步。",
      exercise: "跑步",
      exerciseDetails: "跑了5公里",
      calories: "500",
      amount: "1000",
      transactionType: "income",
    },
    {
      date: "2023/12/10",
      mood: "happy",
      note: "今天心情好，工作有點壓力。",
      exercise: "游泳",
      exerciseDetails: "游了50分鐘",
      calories: "600",
      amount: "300",
      transactionType: "expense",
    },
    {
      date: "2023/12/09",
      mood: "unhappy",
      note: "今天心情不太好，工作有點壓力。",
      exercise: "游泳",
      exerciseDetails: "游了30分鐘",
      calories: "400",
      amount: "200",
      transactionType: "expense",
    },
  ]);

  useEffect(() => {
    const fetchRecords = async () => {
        const userID = "exampleUser"; // 替換為當前用戶 ID
        const startDate = "2023-01-01"; // 起始日期
        const endDate = new Date().toISOString().split("T")[0]; // 當前日期

        try {
            const data = await queryEntries(userID, startDate, endDate);
            console.log("Query result:", data);

            if (!data || !Array.isArray(data)) {
                console.error("No data or invalid data structure");
                setRecords([]); // 如果數據無效，設置為空數組
                return;
            }

            const transformedData = data.map((record) => {
              try {
                  const content = JSON.parse(record.content.S || "{}"); // 確保解析成功
                  return {
                    entryID: record.entryID.S, // 加入 entryID
                    date: record.date.S,
                    mood: content.mood || "neutral",
                    note: content.note || "",
                    exercise: content.exercise || "無運動",
                    exerciseDetails: content.exerciseDetails || "",
                    calories: parseFloat(content.calories || 0),
                    amount: parseFloat(content.amount || 0),
                    transactionType: content.transactionType || "expense",
                    image: content.image || null,
                  };
              } catch (error) {
                  console.error("解析記錄失敗:", error);
                  return null; // 跳過錯誤記錄
              }
          }).filter((record) => record); // 過濾掉無效記錄
          

            setRecords(transformedData); // 更新 records 為平面結構
        } catch (error) {
            console.error("Error fetching records:", error);
            setRecords([]); // 發生錯誤時設置為空數組
        }
    };

    fetchRecords();
}, []);


  


  

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleBackToDiary = () => {
    setSelectedDate(null);
  };

  const handleTimeCapsule = () => {
    const oneYearAgoDate = getOneYearAgoDate(); // 獲取一年前的日期
    console.log("oneYearAgoDate", oneYearAgoDate);

    const foundRecord = records.find((record) => {
        const formattedRecordDate = record.date.replace(/\//g, "-"); // 確保日期格式一致
        return formattedRecordDate === oneYearAgoDate;
    });

    console.log("foundRecord", foundRecord);

    setTimeCapsuleRecord(foundRecord || null); // 更新時光膠囊數據
    setShowModal(true); // 顯示彈跳視窗
};

  
  

  const closeModal = () => {
    setShowModal(false);
  };

  const moodIcons = {
    super_happy: "🤩",
    happy: "😊",
    neutral: "😐",
    unhappy: "😞",
    crying: "😢",
    angry: "😡",
    surprised: "😲",
    tired: "😴",
    confused: "🤔",
  };

  const handleOutsideClick = (e) => {
    // 判斷點擊區域是否為彈跳視窗外部
    if (e.target.id === "modal-background") {
      setShowModal(false);
    }
  };

  // 如果有選擇日期，顯示該日期的紀錄
  if (selectedDate) {
    const selectedRecord = records.find(
      (record) => record.date === selectedDate
    ) || {};
    


    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <button
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleBackToDiary}
        >
          返回主頁
        </button>
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          {selectedDate} 的紀錄
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="font-medium text-lg">
              心情：{moodIcons[selectedRecord.mood]}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="font-medium text-lg">日記：</p>
            <p className="text-gray-600">{selectedRecord.note}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="font-medium text-lg">
              運動：{selectedRecord.exercise}
            </p>
            <p className="text-gray-600">
              運動詳情：{selectedRecord.exerciseDetails}
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="font-medium text-lg">卡路里消耗：</p>
            <p className="text-gray-600">{selectedRecord.calories} 卡路里</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <p className="font-medium text-lg">
              {selectedRecord.transactionType === "income" ? "收入" : "支出"}：
            </p>
            <p className="text-gray-600">{selectedRecord.amount} 元</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
        我的日記
      </h2>
      <div className="space-y-4">
        <button
          className="w-full px-6 py-4 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all ease-in-out duration-200"
          onClick={handleTimeCapsule}
        >
          時光膠囊
        </button>

        {records.length > 0 ? (
    records.map((record, index) => (
        <button
            key={index}
            onClick={() => handleDateClick(record.date)}
            className="w-full text-left px-6 py-4 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition-all ease-in-out duration-200"
        >
            <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                    {record.date}
                    <span className="text-xl">{moodIcons[record.mood] || "😐"}</span>
                </span>
                <span
                    className={`text-sm font-semibold ${
                        record.transactionType === "income"
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {record.transactionType === "income" ? "收入" : "支出"}
                </span>
            </div>
            <p className="text-gray-600 mt-2">
                {record.note ? record.note.slice(0, 50) : "無內容"}...
            </p>
        </button>
    ))
) : (
    <p className="text-center text-gray-500">目前沒有日記紀錄。</p>
)}





      </div>

      {/* 時光膠囊彈跳視窗 */}
      {showModal && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600"
              onClick={closeModal}
            >
              返回
            </button>
            {timeCapsuleRecord ? (
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  一年前的今日紀錄：
                </h3>

                <p>日期：{timeCapsuleRecord.date || "未知日期"}</p>
                <p>心情：{moodIcons[timeCapsuleRecord.mood] || "😐"}</p>
                <p className="mt-2">日記：{timeCapsuleRecord.note || "無內容"}</p>
                <p className="mt-2">運動：{timeCapsuleRecord.exercise || "無運動"}</p>
                <p className="mt-2">
                  卡路里消耗：{timeCapsuleRecord.calories || 0} 卡路里
                </p>
                <p className="mt-2">
                  {timeCapsuleRecord.transactionType === "income" ? "收入" : "支出"}：
                  {timeCapsuleRecord.amount || 0} 元
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-4">一年前的今天</h3>
                <p className="text-gray-600">沒有紀錄，加油，繼續保持紀錄！</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Diary;
