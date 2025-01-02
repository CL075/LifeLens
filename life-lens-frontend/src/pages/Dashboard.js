import React, { useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect } from "react";
import { queryEntries } from "../utils/dynamoDB"; // 新增
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
    if (records.length > 0) {
      const feedback = generateTrendFeedback();
      setFeedbackList(feedback); // 將返回的 feedbackList 設置到狀態中
    }
  }, [records]);

const [streak, setStreak] = useState(0);
const [showAchievement, setShowAchievement] = useState(false);

useEffect(() => {
  if (records.length > 0) {
    const currentStreak = checkStreak(records);
    setStreak(currentStreak);

    console.log("currentStreak", currentStreak);

    if (currentStreak === 7 || currentStreak === 30) {
      setShowAchievement(true); // 當達到目標時顯示成就視窗
    }
  }
}, [records]);
  // 檢查連續寫日記的天數
const checkStreak = (records) => {
  // 提取所有日期並按升序排序
  const dates = records
    .map((record) => new Date(record.date))
    .sort((a, b) => a - b);

  let streak = 1; // 初始化連續天數
  for (let i = 1; i < dates.length; i++) {
    const diffInDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24); // 計算日期差值（以天為單位）
    if (diffInDays === 1) {
      streak++; // 如果差一天，增加連續天數
    } else {
      streak = 1; // 非連續時重置
    }
  }
  


  

  return streak;
};

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
        const data = await queryEntries(userID, startDate, endDate);
        console.log("Query result:", data);

        if (!data || !Array.isArray(data)) {
          console.error("No data or invalid data structure");
          setRecords([]); // 如果數據無效，設置為空數組
          return;
        }

        const transformedData = data
          .map((record) => {
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
          })
          .filter((record) => record); // 過濾掉無效記錄

        setRecords(transformedData); // 更新 records 為平面結構
      } catch (error) {
        console.error("Error fetching records:", error);
        setRecords([]); // 發生錯誤時設置為空數組
      }
    };
    fetchRecords();
  }, []);

  const totalCalories = records.reduce(
    (total, record) =>
      total + parseFloat(record.calories?.S || record.calories || 0),
    0
  );

  const totalIncome = records
    .filter((record) => record.transactionType?.S === "income")
    .reduce(
      (total, record) =>
        total + parseFloat(record.amount?.S || record.amount || 0),
      0
    );

  const totalExpense = records
    .filter((record) => record.transactionType?.S === "expense")
    .reduce(
      (total, record) =>
        total + parseFloat(record.amount?.S || record.amount || 0),
      0
    );

  const exerciseStats = records.reduce((stats, record) => {
    const exercise = record.exercise?.S || record.exercise || "";
    const calories = parseFloat(record.calories?.S || record.calories || 0);

    if (exercise) {
      if (!stats[exercise]) stats[exercise] = 0;
      stats[exercise] += calories;
    }
    return stats;
  }, {});

  // 回饋報告狀態
  const [feedbackList, setFeedbackList] = useState([]);
  // 生成分析報告的函數
  const generateFeedback = () => {
    // 心情與運動的關聯性
    const moodAfterExercise = records.reduce((stats, record) => {
      if (record.exercise !== "無運動") {
        if (!stats[record.mood]) stats[record.mood] = 0;
        stats[record.mood] += 1;
      }
      return stats;
    }, {});

    // 運動頻率統計
    const exerciseFrequency = records.reduce((stats, record) => {
      if (record.exercise && record.exercise !== "無運動") {
        stats[record.exercise] = (stats[record.exercise] || 0) + 1;
      }
      return stats;
    }, {});

    // 使用者最常用的運動標籤
    const mostFrequentExercise =
      Object.entries(exerciseFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "無";

    return { moodAfterExercise, exerciseFrequency, mostFrequentExercise };
  };

  const generateTrendFeedback = () => {
  const feedbackList = [];

  const totalRecords = records.length;

  // 運動次數統計
  const exerciseRecords = records.filter((record) => record.exercise !== "無運動");
  const exerciseCount = exerciseRecords.length;

  // 心情統計：正面、負面與中性
  const positiveMoods = ["super_happy", "happy"];
  const negativeMoods = ["unhappy", "crying", "angry"];
  const neutralMoods = ["neutral", "calm"];
  const positiveCount = records.filter((record) =>
    positiveMoods.includes(record.mood)
  ).length;
  const negativeCount = records.filter((record) =>
    negativeMoods.includes(record.mood)
  ).length;
  const neutralCount = records.filter((record) =>
    neutralMoods.includes(record.mood)
  ).length;

  // 卡路里消耗統計
  const totalCalories = records.reduce(
    (total, record) => total + parseFloat(record.calories || 0),
    0
  );
  const averageCaloriesPerExercise =
    exerciseCount > 0 ? (totalCalories / exerciseCount).toFixed(2) : 0;

  // 財務統計
  const totalIncome = records
    .filter((record) => record.transactionType === "income")
    .reduce((total, record) => total + parseFloat(record.amount || 0), 0);
  const totalExpense = records
    .filter((record) => record.transactionType === "expense")
    .reduce((total, record) => total + parseFloat(record.amount || 0), 0);

  // 運動類型統計
  const exerciseFrequency = exerciseRecords.reduce((acc, record) => {
    acc[record.exercise] = (acc[record.exercise] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentExercise = Object.entries(exerciseFrequency).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0] || "無運動";

  // 歷史分析：生成習慣目標
  const pastRecords = records.slice(0, -1); // 假設最後一條為本月記錄
  const pastExerciseCount = pastRecords.filter((record) => record.exercise !== "無運動").length;
  const pastCalories = pastRecords.reduce(
    (total, record) => total + parseFloat(record.calories || 0),
    0
  );
  const suggestedGoal = {
    exercise: Math.ceil(pastExerciseCount / pastRecords.length * 30) || 5, // 建議每月運動次數
    calories: Math.ceil(pastCalories / pastRecords.length) || 200, // 每次運動建議卡路里
  };

  // 根據統計數據生成多個回饋
  if (exerciseCount === 0) {
    feedbackList.push("最近你還沒開始運動，不妨從簡單的運動開始，動起來！💪");
  }

  if (positiveCount > negativeCount) {
    feedbackList.push("最近你的心情總體較正面，保持運動習慣能讓你繼續維持好心情！😊");
  }

  if (negativeCount > positiveCount) {
    feedbackList.push("最近的負面情緒較多，試著增加運動次數，改善你的心情吧！🌟");
  }

  if (neutralCount > positiveCount && neutralCount > negativeCount) {
    feedbackList.push("最近你的心情以中性為主，嘗試新的活動讓生活多些色彩吧！✨");
  }

  if (totalCalories > 2000) {
    feedbackList.push(
      `你這段時間共消耗了 ${totalCalories} 卡路里，平均每次運動消耗 ${averageCaloriesPerExercise} 卡路里，表現非常棒！🔥`
    );
  }

  if (totalIncome > totalExpense) {
    feedbackList.push(
      `財務方面，你的收入 (${totalIncome} 元) 大於支出 (${totalExpense} 元)，穩定存錢！繼續保持！💰`
    );
  } else {
    feedbackList.push(
      "你的支出高於收入，建議重新評估財務狀況，控制不必要的花費。💡"
    );
    feedbackList.push("試著設定每月存儲目標，讓財務更加健康！📈");
  }

  if (mostFrequentExercise) {
    feedbackList.push(
      `本月最常進行的運動是「${mostFrequentExercise}」，試著挑戰一些新運動，讓運動計畫更有趣！🏋️‍♀️`
    );
  }

  // 新增習慣目標建議
  feedbackList.push(
    `基於你的歷史記錄，建議每月至少運動 ${suggestedGoal.exercise} 天，每次運動消耗 ${suggestedGoal.calories} 卡路里，讓生活更健康！📊`
  );

  return feedbackList;
};

  
  

  // 回饋報告狀態
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (records.length > 0) {
      setFeedback(generateFeedback());
    }
  }, [records]);

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

  // 計算最近四周的收入和支出並繪製折線圖
  function incomeExpenseChartData(records) {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 表示星期日，1 表示星期一，以此類推
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - dayOfWeek); 

    // 計算最近四周的起始日期
    const startOfWeeks = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeek = new Date(startOfCurrentWeek);
      startOfWeek.setDate(startOfCurrentWeek.getDate() - i * 7);
      startOfWeeks.unshift(startOfWeek); // 按升序排列
    }
  
    // 格式化數據為按周分組
    function groupDataByWeek(data, startOfWeek, endOfWeek) {
      const groupedData = {
        income: 0,
        expense: 0,
      };
  
      data.forEach((record) => {
        const recordDate = new Date(record.date);
        if (recordDate >= startOfWeek && recordDate < endOfWeek) {
          if (record.transactionType === "income") {
            groupedData.income += parseFloat(record.amount);
          } else if (record.transactionType === "expense") {
            groupedData.expense += parseFloat(record.amount);
          }
        }
      });
  
      return groupedData;
    }
  
    // 計算每周的收支數據
    const weeklyData = startOfWeeks.map((startOfWeek, index) => {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
  
      const groupedData = groupDataByWeek(records, startOfWeek, endOfWeek);
  
      return {
        week: `${startOfWeek.toISOString().split("T")[0]} ~ ${new Date(endOfWeek - 1).toISOString().split("T")[0]}`,
    ...groupedData,
      };
    });
  
    // 整理為折線圖格式
    return {
      labels: weeklyData.map((data) => data.week),
      datasets: [
        {
          label: "收入",
          data: weeklyData.map((data) => data.income),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
        {
          label: "支出",
          data: weeklyData.map((data) => data.expense),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    };
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
    {/* 成就彈窗 */}
    {showAchievement && (
      <AchievementModal  streak={streak} onClose={() => setShowAchievement(false)} />
    )}
    {/* 分析回饋區塊 */}
    <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
    <h3 className="text-xl font-semibold mb-2">你的日記洞察分析</h3>
    {feedbackList && feedbackList.length > 0 ? (
      <div>
        {/* 心情與運動的關聯性 */}
        <p className="mb-2">
          <strong>運動後的心情統計：</strong>
          {Object.entries(feedback.moodAfterExercise).map(([mood, count]) => (
            <span key={mood} className="ml-2">
              {moodLabels[mood] || mood}: {count} 次
            </span>
          ))}
        </p>

        {/* 最常運動的類型 */}
        <p className="mb-2">
          <strong>這個月最常進行的運動：</strong> {feedback.mostFrequentExercise}
        </p>

        {/* 展示分析回饋 */}
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
        <Line data={incomeExpenseChartData(records)} />
      </div>

      
    </div>
  );
};

export default Dashboard;
