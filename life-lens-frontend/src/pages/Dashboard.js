import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect } from "react";
import { queryEntries, queryEntriesByEmail, getEmailByUserID, } from "../utils/dynamoDB"; // 新增
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
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
    // const fetchRecords = async () => {
    //   const userID = "exampleUser"; // 替換為用戶 ID
    //   const data = await queryEntries(userID, "record");
    //   setRecords(data || []); // 更新 records
    // };
    const fetchRecords = async () => {
      const userID = "exampleUser"; // 替換為當前用戶 ID
      const startDate = "2023-01-01"; // 起始日期
      const endDate = new Date().toISOString().split("T")[0]; // 當前日期

      try {
              // 從 localStorage 獲取 email
              const userData = JSON.parse(localStorage.getItem("userData"));
              if (!userData || !userData.email) {
                console.error("無法找到用戶 email");
                return;
              }
        
              const email = typeof userData.email === "object" ? userData.email.S : userData.email;
              console.log("正在查詢的 email:", email);
        
              // 基於 email 查詢日記資料
              const data = await queryEntriesByEmail(email); // 使用基於 email 的查詢函數
              console.log("查詢到的日記資料：", data);
        
              // 轉換並處理查詢結果
              const transformedData = await Promise.all(
                data.map(async (record) => {
                  try {
                    console.log("處理中的記錄：", record); // 檢查每條記錄
                    const content = JSON.parse(record.content.S || "{}");
                    console.log("解析出的 content:", content); // 調試輸出
        
                    // 動態生成預簽名 URL（如果有圖片）
                    
        
                    return {
                      entryID: record.entryID.S,
                      date: record.date.S,
                      mood: content.mood || "neutral",
                      note: content.note || "",
                      exercise: content.exercise || "無運動",
                      exerciseDetails: content.exerciseDetails || "",
                      calories: parseFloat(content.calories || 0),
                      amount: parseFloat(content.amount || 0),
                      transactionType: content.transactionType || "expense",
                      
                    };
                  } catch (error) {
                    console.error("解析記錄失敗：", error);
                    return null;
                  }
                })
              );
        
              setRecords(transformedData.filter((record) => record)); // 過濾掉無效記錄
              console.log("處理後的記錄列表:", transformedData);
            } catch (error) {
              console.error("查詢過程中出錯：", error);
              setRecords([]);
            }
  };
    fetchRecords();
}, []);

const totalCalories = records.reduce(
  (total, record) => total + parseFloat(record.calories?.S || record.calories || 0),
  0
);

const totalIncome = records
.filter((record) => record.transactionType?.S === "income")
.reduce((total, record) => total + parseFloat(record.amount?.S || record.amount || 0), 0);


const totalExpense = records
.filter((record) => record.transactionType?.S === "expense")
.reduce((total, record) => total + parseFloat(record.amount?.S || record.amount || 0), 0);

const exerciseStats = records.reduce((stats, record) => {
  const exercise = record.exercise?.S || record.exercise || "";
  const calories = parseFloat(record.calories?.S || record.calories || 0);

  if (exercise) {
    if (!stats[exercise]) stats[exercise] = 0;
    stats[exercise] += calories;
  }
  return stats;
}, {});

const moodStats = records.reduce((stats, record) => {
  const mood = record.mood?.S || record.mood || "";
  if (mood) {
    if (!stats[mood]) stats[mood] = 0;
    stats[mood] += 1;
  }
  return stats;
}, {});

  // 定義心情對應的表情符號和顏色
  const moodLabels = {
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

  // 心情圓餅圖數據
  const moodChartData = {
    labels: Object.keys(moodStats).map((mood) => moodLabels[mood] || mood),
    datasets: [
      {
        data: Object.values(moodStats),
        backgroundColor: [
          "#FF6384", // 超級開心
          "#36A2EB", // 開心
          "#FFCE56", // 中性
          "#4BC0C0", // 不開心
          "#9966FF", // 哭泣
          "#FF5733", // 生氣
          "#B3B6B7", // 驚訝
          "#FFC300", // 疲憊
          "#9C27B0", // 困惑
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF5733",
          "#B3B6B7",
          "#FFC300",
          "#9C27B0",
        ],
      },
    ],
  };

  // 運動條形圖數據
  const exerciseChartData = {
    labels: Object.keys(exerciseStats),
    datasets: [
      {
        label: "卡路里消耗",
        data: Object.values(exerciseStats),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 收支折線圖數據
  const incomeExpenseChartData = {
    labels: records.map((record) => record.date),
    datasets: [
      {
        label: "收入",
        data: records.map((record) =>
          record.transactionType === "income" ? parseFloat(record.amount) : 0
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "支出",
        data: records.map((record) =>
          record.transactionType === "expense" ? parseFloat(record.amount) : 0
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-4">儀表板和洞察</h2>

      {/* 心情統計圖表 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">心情分佈</h3>
        <Doughnut data={moodChartData} />
      </div>

      {/* 運動統計圖表 */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">運動卡路里消耗</h3>
        <Bar data={exerciseChartData} />
      </div>

      {/* 收支統計圖表 */}
      <div>
        <h3 className="text-xl font-semibold mb-2">收支趨勢</h3>
        <Line data={incomeExpenseChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
