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
import axios from "axios";

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

// ---------------------------
// 成就彈窗元件
// ---------------------------
const AchievementModal = ({ streak, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center w-96">
        <h2 className="text-2xl font-bold mb-4">🎉 恭喜達成成就！ 🎉</h2>
        <p className="text-lg mb-6">
          你已經連續寫日記 <strong>{streak}</strong> 天了！保持這個好習慣，繼續加油！💪
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={onClose}
        >
          知道了
        </button>
      </div>
    </div>
  );
};

// ---------------------------
// Dashboard 主元件
// ---------------------------
const Dashboard = () => {
  // 從後端拿到的資料
  const [records, setRecords] = useState([]);
  // 從後端拿到的回饋建議 (文字陣列)
  const [feedbackList, setFeedbackList] = useState([]);
  // 從後端拿到的分析資料 (moodAfterExercise, etc.)
  const [analysis, setAnalysis] = useState(null);

  // 成就相關
  const [streak, setStreak] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);

  // ---------------------------
  // 1. 向後端抓取資料
  // ---------------------------
  useEffect(() => {
    const fetchDiaryRecords = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (!userData || !userData.email) {
          console.error("無法找到用戶 email");
          return;
        }
        const email = userData.email;

        // 呼叫你的 Lambda API
        const res = await axios.get(
          "https://5e4ppse887.execute-api.us-east-1.amazonaws.com/default/DiaryRecords",
          { params: { email } }
        );

        // 後端回傳格式： { records, feedbackList, analysis } (視實際情況而定)
        const { records, feedbackList, analysis } = res.data;
        console.log("Lambda 回傳資料:", records, feedbackList, analysis);

        setRecords(records || []);
        setFeedbackList(feedbackList || []);
        setAnalysis(analysis || null);
      } catch (error) {
        console.error(error);
        setRecords([]);
        setFeedbackList([]);
        setAnalysis(null);
      }
    };

    fetchDiaryRecords();
  }, []);

  // ---------------------------
  // 2. 每當 records 有變化，重新計算 streak
  // ---------------------------
  useEffect(() => {
    if (records.length > 0) {
      const currentStreak = checkStreak(records);
      setStreak(currentStreak);

      if (currentStreak === 7 || currentStreak === 30) {
        setShowAchievement(true);
      }
    }
  }, [records]);

  // 計算連續天數
  const checkStreak = (records) => {
    const dates = records
      .map((record) => new Date(record.date))
      .sort((a, b) => a - b);

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const diffInDays =
        (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      if (diffInDays === 1) {
        streak++;
      } else {
        streak = 1;
      }
    }
    return streak;
  };

  // ---------------------------
  // 3. 圖表計算
  // （下列邏輯保留在前端，以便動態繪圖）
  // ---------------------------

  // 計算心情數據 (前端自行運算)
  const moodStats = records.reduce((stats, record) => {
    const mood = record.mood || ""; // 不再取 record.mood?.S
    if (mood) {
      stats[mood] = (stats[mood] || 0) + 1;
    }
    return stats;
  }, {});

  // 心情對應表情符號
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

  const moodChartData = {
    labels: Object.keys(moodStats).map((mood) => moodLabels[mood] || mood),
    datasets: [
      {
        data: Object.values(moodStats),
        backgroundColor: [
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

  // 運動卡路里統計 (前端自行運算)
  const exerciseStats = records.reduce((stats, record) => {
    const exercise = record.exercise || "";
    const calories = parseFloat(record.calories || 0);
    if (exercise) {
      stats[exercise] = (stats[exercise] || 0) + calories;
    }
    return stats;
  }, {});

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

  // 收支折線圖 (前端自行運算)
  function incomeExpenseChartData(records) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);

    const startOfWeeks = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeek = new Date(startOfCurrentWeek);
      startOfWeek.setDate(startOfCurrentWeek.getDate() - i * 7);
      startOfWeeks.unshift(startOfWeek);
    }

    function groupDataByWeek(data, start, end) {
      const groupedData = { income: 0, expense: 0 };
      data.forEach((r) => {
        const recordDate = new Date(r.date);
        if (recordDate >= start && recordDate < end) {
          if (r.transactionType === "income") {
            groupedData.income += parseFloat(r.amount || 0);
          } else if (r.transactionType === "expense") {
            groupedData.expense += parseFloat(r.amount || 0);
          }
        }
      });
      return groupedData;
    }

    const weeklyData = startOfWeeks.map((startOfWeek) => {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);

      const groupedData = groupDataByWeek(records, startOfWeek, endOfWeek);
      return {
        week: `${startOfWeek.toISOString().split("T")[0]} ~ ${
          new Date(endOfWeek - 1).toISOString().split("T")[0]
        }`,
        ...groupedData,
      };
    });

    return {
      labels: weeklyData.map((d) => d.week),
      datasets: [
        {
          label: "收入",
          data: weeklyData.map((d) => d.income),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
        {
          label: "支出",
          data: weeklyData.map((d) => d.expense),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  }

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      {/* 成就彈窗 */}
      {showAchievement && (
        <AchievementModal
          streak={streak}
          onClose={() => setShowAchievement(false)}
        />
      )}

      {/* 分析回饋區塊：顯示從後端拿到的 feedbackList & analysis */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">你的日記洞察分析</h3>

        {/* 有 feedbackList 時顯示，否則顯示「正在生成」 */}
        {feedbackList.length > 0 ? (
          <div>
            {/* 假設後端也回傳了 analysis.moodAfterExercise */}
            {analysis?.moodAfterExercise && (
              <p className="mb-2">
                <strong>運動後的心情統計：</strong>
                {Object.entries(analysis.moodAfterExercise).map(([mood, count]) => (
                  <span key={mood} className="ml-2">
                    {moodLabels[mood] || mood}: {count} 次
                  </span>
                ))}
              </p>
            )}

            {/* 假設後端也回傳了 analysis.mostFrequentExercise */}
            {analysis?.mostFrequentExercise && (
              <p className="mb-2">
                <strong>這個月最常進行的運動：</strong>
                {analysis.mostFrequentExercise}
              </p>
            )}

            {/* 展示文字回饋 */}
            <h4 className="text-lg font-semibold mt-4">分析回饋：</h4>
            <ul className="list-disc list-inside">
              {feedbackList.map((item, index) => (
                <li key={index} className="mb-2 text-gray-800">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">正在生成您的分析報告...</p>
        )}
      </div>

      <h2 className="text-3xl font-semibold text-center mb-4">
        儀表板和洞察
      </h2>

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
        <Line data={incomeExpenseChartData(records)} />
      </div>
    </div>
  );
};

export default Dashboard;
