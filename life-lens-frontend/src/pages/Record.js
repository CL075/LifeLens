import React, { useEffect, useState } from "react";

const Record = () => {
  const [mood, setMood] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [exercise, setExercise] = useState("");
  const [exerciseDetails, setExerciseDetails] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [amount, setAmount] = useState("");
  const [calories, setCalories] = useState("");
  const [transactionType, setTransactionType] = useState("income");

  const today = new Date().toLocaleDateString("zh-TW");

  const handleMoodChange = (event) => setMood(event.target.value);
  const handleNoteChange = (event) => setNote(event.target.value);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleExerciseChange = (event) => setExercise(event.target.value);
  const handleExerciseDetailsChange = (event) =>
    setExerciseDetails(event.target.value);
  const handleCaloriesChange = (event) => setCalories(event.target.value);
  const handleAmountChange = (event) => setAmount(event.target.value);
  const handleTransactionTypeChange = (event) =>
    setTransactionType(event.target.value);

  // 保存记录的函数
  const handleSaveRecord = async () => {
    const newRecord = {
      date: new Date().toLocaleDateString("zh-TW"),
      mood,
      note,
      exercise,
      exerciseDetails,
      calories,
      amount,
      transactionType,
    };

    try {
      const response = await fetch("http://54.209.222.76:5000/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      if (response.ok) {
        alert("紀錄已保存！");
        setMood(""); // 重置狀態
        setNote("");
        setExercise("");
        setExerciseDetails("");
        setCalories("");
        setAmount("");
        setTransactionType("income");
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("紀錄保存失敗：" + errorData.message);
      }
    } catch (error) {
      console.error("Error saving record:", error);
      alert("紀錄保存時發生錯誤！");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
        記錄你的日常
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-center text-gray-500 mb-4">
        今天是 {today}
      </p>

      {/* 心情選擇 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">選擇你的心情</label>
        <div className="flex flex-wrap space-x-4 mb-4">
          <button
            onClick={() => setMood("super_happy")}
            className={`p-2 rounded-full ${
              mood === "super_happy" ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            🤩
          </button>
          <button
            onClick={() => setMood("happy")}
            className={`p-2 rounded-full ${
              mood === "happy" ? "bg-yellow-500" : "bg-gray-200"
            }`}
          >
            😊
          </button>
          <button
            onClick={() => setMood("neutral")}
            className={`p-2 rounded-full ${
              mood === "neutral" ? "bg-blue-400" : "bg-gray-200"
            }`}
          >
            😐
          </button>
          <button
            onClick={() => setMood("unhappy")}
            className={`p-2 rounded-full ${
              mood === "unhappy" ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            😞
          </button>
          <button
            onClick={() => setMood("crying")}
            className={`p-2 rounded-full ${
              mood === "crying" ? "bg-indigo-600" : "bg-gray-200"
            }`}
          >
            😢
          </button>
          <button
            onClick={() => setMood("angry")}
            className={`p-2 rounded-full ${
              mood === "angry" ? "bg-red-600" : "bg-gray-200"
            }`}
          >
            😡
          </button>
          <button
            onClick={() => setMood("surprised")}
            className={`p-2 rounded-full ${
              mood === "surprised" ? "bg-green-400" : "bg-gray-200"
            }`}
          >
            😲
          </button>
          <button
            onClick={() => setMood("tired")}
            className={`p-2 rounded-full ${
              mood === "tired" ? "bg-purple-600" : "bg-gray-200"
            }`}
          >
            😴
          </button>
          <button
            onClick={() => setMood("confused")}
            className={`p-2 rounded-full ${
              mood === "confused" ? "bg-indigo-400" : "bg-gray-200"
            }`}
          >
            🤔
          </button>
        </div>
      </div>

      {/* 心得或日記 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          紀錄你的心情或日記
        </label>
        <textarea
          value={note}
          onChange={handleNoteChange}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="寫下你的想法..."
        />
      </div>

      {/* 圖片上傳 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">上傳圖片</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="p-2 w-full border border-gray-300 rounded-lg"
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="預覽圖片"
              className="w-full max-w-xs h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      {/* 運動標籤 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">記錄運動</label>
        <input
          type="text"
          value={exercise}
          onChange={handleExerciseChange}
          placeholder="例如：跑步、游泳"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* 運動詳情 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">運動詳情</label>
        <textarea
          value={exerciseDetails}
          onChange={handleExerciseDetailsChange}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="描述你的運動過程..."
        />
      </div>

      {/* 卡路里消耗 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">卡路里消耗</label>
        <input
          type="number"
          value={calories}
          onChange={handleCaloriesChange}
          placeholder="卡路里"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* 收支記錄 */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">收支記錄</label>
        <div className="flex flex-wrap space-x-4 mb-2">
          <button
            onClick={() => setTransactionType("income")}
            className={`px-4 py-2 rounded-lg ${
              transactionType === "income"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            收入
          </button>
          <button
            onClick={() => setTransactionType("expense")}
            className={`px-4 py-2 rounded-lg ${
              transactionType === "expense"
                ? "bg-red-500 text-white"
                : "bg-gray-200"
            }`}
          >
            支出
          </button>
        </div>
        <input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="金額"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* 提交按鈕 */}
      <div className="text-center">
        <button
          className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg"
          // onClick={() => alert("記錄已保存！")}
          onClick={handleSaveRecord}
        >
          記錄！
        </button>
      </div>
    </div>
  );
};

export default Record;
