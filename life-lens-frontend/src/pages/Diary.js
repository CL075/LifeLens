import React, { useState } from "react";
import { useEffect } from "react"; // 新增
import { queryEntries, queryEntriesByEmail, getEmailByUserID, } from "../utils/dynamoDB"; // 新增
import s3Client from "../utils/awsClient"; // 引入共享的 S3 客户端
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";





// 輔助函數：計算一年前的今天日期
const getOneYearAgoDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 1);
  console.log("today", today);
  return today.toISOString().split("T")[0]; // 格式化為 YYYY-MM-DD
};

const Diary = ({ userID }) => {
  const [selectedEntryID, setSelectedEntryID] = useState(null); // 替換 selectedDate 為 entryID
  const [showTimeCapsule, setShowTimeCapsule] = useState(false); // 用來控制顯示時光膠囊紀錄
  const [showModal, setShowModal] = useState(false); // 控制彈跳視窗顯示
  const [timeCapsuleRecord, setTimeCapsuleRecord] = useState(null); // 用來存儲一年前的紀錄
  const [email, setEmail] = useState(""); // 保存用戶 email 的狀態
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchEmailAndRecords = async () => {
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
              const presignedUrl = content.image
                ? await getPresignedUrl(content.image)
                : null;
  
              console.log("生成的預簽名 URL:", presignedUrl);
  
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
                image: presignedUrl || content.image,
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
  
    fetchEmailAndRecords();
  }, [userID]); // 根據 userID 觸發更新
  

  // useEffect(() => {
  //   const fetchEmailAndRecords = async () => {
  //     try {
  //       // 從 localStorage 獲取 email
  //       const userData = JSON.parse(localStorage.getItem("userData"));
  //       if (!userData || !userData.email) {
  //         console.error("無法找到用戶 email");
  //         return;
  //       }

  //       const email = typeof userData.email === "object" ? userData.email.S : userData.email;
  //       console.log("正在查詢的 email:", email);
        
  //       // 基於 email 查詢日記資料
  //       const fetchedRecords = await queryEntriesByEmail(email);
  //       // console.log("查詢到的日記資料:", fetchedRecords);

  //       // 過濾結果，僅保留 email 匹配的記錄
  //       const filteredRecords = fetchedRecords.filter(
  //         (record) => record.email.S === email
  //       );
  //       //console.log("過濾後的記錄filteredRecords：", filteredRecords);

  //       // 處理數據以顯示在頁面上
  //       setRecords(
  //         filteredRecords.map((record) => {
  //           try {
  //             const content = record.content ? JSON.parse(record.content.S || "{}") : {};
  //             // console.log("解析出的 content:", content);

  //             //console.log("生成的預簽名 URL:", presignedUrl);
            
  //             if (content.image) {
  //               console.log("處理中的圖片檔名:", content.image);
  //             }
        
  //             return {
  //               entryID: record.entryID.S,
  //               date: record.date.S,
  //               note: content.note || "無內容",
  //               mood: content.mood || "neutral",
  //               exercise: content.exercise || "無運動",
  //               exerciseDetails: content.exerciseDetails || "無詳情",
  //               calories: parseFloat(content.calories || 0),
  //               amount: parseFloat(content.amount || 0),
  //               transactionType: content.transactionType || "expense",
  //               image: content.image || null,
  //               //image: presignedUrl,
  //             };
  //           } catch (error) {
  //             console.error("解析記錄失敗：", error, "記錄內容：", record);
  //             return null; // 如果解析失敗，返回 null
  //           }
  //         }).filter((record) => record !== null) // 過濾掉無效記錄
  //       );

  //       console.log("處理後的 records:", records);

  //     } catch (error) {
  //       console.error("查詢過程中出錯：", error);
  //       setRecords([]);
  //     }
  //   };

  //   fetchEmailAndRecords();
  // }, [userID]);

//   useEffect(() => {
//     // ** 步驟 2：基於 email 查詢日記資料 **
//     const fetchRecordsByEmail = async () => {
//       if (!email) return; // 如果 email 尚未獲取，不執行查詢
//       try {
//         const data = await queryEntriesByEmail(email); // 使用基於 email 的查詢函數
//         console.log("查詢到的日記資料：", data);

//         // 轉換並處理查詢結果
//         const transformedData = await Promise.all(
//           data.map(async (record) => {
//             try {
//               const content = JSON.parse(record.content.S || "{}");

//               // 動態生成預簽名 URL（如果有圖片）
//               const presignedUrl = content.image
//                 ? await getPresignedUrl(content.image)
//                 : null;

//               return {
//                 entryID: record.entryID.S,
//                 date: record.date.S,
//                 mood: content.mood || "neutral",
//                 note: content.note || "",
//                 exercise: content.exercise || "無運動",
//                 exerciseDetails: content.exerciseDetails || "",
//                 calories: parseFloat(content.calories || 0),
//                 amount: parseFloat(content.amount || 0),
//                 transactionType: content.transactionType || "expense",
//                 image: presignedUrl,
//               };
//             } catch (error) {
//               console.error("解析記錄失敗：", error);
//               return null;
//             }
//           })
//         );

        // setRecords(transformedData.filter((record) => record)); // 過濾掉無效記錄
//       } catch (error) {
//         console.error("查詢日記資料失敗：", error);
//         setRecords([]); // 若查詢失敗，設置為空數組
//       }
//     };

//     fetchRecordsByEmail();
//   }, [email]); // 當 email 改變時重新查詢


// useEffect(() => {  //蔡
//   const fetchRecords = async () => {
//       const userID = "exampleUser"; // 替換為當前用戶 ID
//       const startDate = "2023-01-01"; // 起始日期
//       const endDate = new Date().toISOString().split("T")[0]; // 當前日期

//       try {
//           const data = await queryEntries(userID, startDate, endDate);
//           // const data = await queryEntriesByEmail(email); // 使用基於 email 的查詢函數
//           console.log("Query result:", data);

//           if (!data || !Array.isArray(data)) {
//               console.error("No data or invalid data structure");
              // setRecords([]); // 如果數據無效，設置為空數組
//               return;
//           }

//           const transformedData = await Promise.all(
//               data.map(async (record) => {
//                   try {
//                       const content = JSON.parse(record.content.S || "{}"); // 確保解析成功

//                       // 動態生成預簽名 URL（如果有圖片）
//                       const presignedUrl = content.image
//                           ? await getPresignedUrl(content.image)
//                           : null;

//                       return {
//                           entryID: record.entryID.S, // 加入 entryID
//                           date: record.date.S,
//                           mood: content.mood || "neutral",
//                           note: content.note || "",
//                           exercise: content.exercise || "無運動",
//                           exerciseDetails: content.exerciseDetails || "",
//                           calories: parseFloat(content.calories || 0),
//                           amount: parseFloat(content.amount || 0),
//                           transactionType: content.transactionType || "expense",
//                           image: presignedUrl, // 替換為預簽名 URL
//                       };
//                   } catch (error) {
//                       console.error("解析記錄失敗:", error);
//                       return null; // 跳過錯誤記錄
//                   }
//               })
//           );

//           setRecords(transformedData.filter((record) => record)); // 過濾掉無效記錄
//       } catch (error) {
//           console.error("Error fetching records:", error);
//           setRecords([]); // 發生錯誤時設置為空數組
//       }
//   };

//   fetchRecords();
// }, []);
// useEffect(() => {
//   const fetchRecords = async () => {
//     if (!email) return; // 如果 email 尚未獲取，不執行查詢

//     try {
//       const data = await queryEntriesByEmail(email); // 使用基於 email 的查詢函數
//       console.log("查詢到的日記資料：", data);

//       // 轉換並處理查詢結果
//       const transformedData = await Promise.all(
//         data.map(async (record) => {
//           try {
//             console.log("處理中的記錄：", record); // 檢查每條記錄
//             const content = JSON.parse(record.content.S || "{}");
//             console.log("解析出的 content:", content); // 調試輸出

//             // 動態生成預簽名 URL（如果有圖片）
//             const presignedUrl = content.image
//               ? await getPresignedUrl(content.image)
//               : null;

//               console.log("生成的預簽名 URL:", presignedUrl);
            
//               if (content.image) {
//                 console.log("處理中的圖片檔名:", content.image);
//               }
              

//             return {
//               entryID: record.entryID.S,
//               date: record.date.S,
//               mood: content.mood || "neutral",
//               note: content.note || "",
//               exercise: content.exercise || "無運動",
//               exerciseDetails: content.exerciseDetails || "",
//               calories: parseFloat(content.calories || 0),
//               amount: parseFloat(content.amount || 0),
//               transactionType: content.transactionType || "expense",
//               image: presignedUrl || content.image,
//             };
//           } catch (error) {
//             console.error("解析記錄失敗：", error);
//             return null;
//           }
//         })
//       );

//       setRecords(transformedData.filter((record) => record)); // 過濾掉無效記錄
//       console.log("處理後的記錄列表:", transformedData);
//     } catch (error) {
//       console.error("查詢日記資料失敗：", error);
//       setRecords([]); // 若查詢失敗，設置為空數組
//     }
//   };

//   fetchRecords();
// }, [email]); // 當 email 改變時重新查詢


// 動態生成預簽名 URL 的函數
const getPresignedUrl = async (fileName) => {
  const bucketName = "my-record-app-bucket"; // 替換為您的存儲桶名稱

  const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
  });

  try {
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 有效期 1 小時
  } catch (error) {
      console.error("生成預簽名 URL 出錯:", error);
      return null;
  }
};



const handleEntryClick = (entryID) => {
  //console.log("點擊的 Entry ID:", entryID); // 添加調試輸出
  setSelectedEntryID(entryID); // 設置選中的 entryID
};

  const handleBackToDiary = () => {
    setSelectedEntryID(null);
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
  if (selectedEntryID) {
    const selectedRecord = records.find(
      (record) => record.entryID === selectedEntryID) || {};

      console.log("選中的 Entry ID:", selectedEntryID);
      console.log("選中的記錄:", selectedRecord);


    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
        <button
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={handleBackToDiary}
        >
          返回主頁
        </button>
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
          {selectedRecord.date} 的紀錄
        </h2>
        <div className="space-y-4">
          {/* 显示完整图片 */}
          {selectedRecord.image && (
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="font-medium text-lg">日記圖片：</p>
                  <img
                      src={selectedRecord.image}
                      alt="日記圖片"
                      className="mt-2 max-w-full h-auto rounded-lg"
                      onError={(e) => {
                        e.target.src = "/path-to-placeholder-image.jpg"; // 替换为占位图
                        e.target.alt = "图片加载失败";
                    }}
                  />
                  {console.log("Image URL:", selectedRecord.image)}
              </div>
          )}
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
    records.map((record) => (
        <button
            key={record.entryID}
            onClick={() => handleEntryClick(record.entryID)}
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
            {/* 显示图片缩略图 */}
            {record.image && (
                <img
                    src={record.image}
                    alt="日记图片"
                    className="mt-2 h-20 w-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/path-to-placeholder-image.jpg"; // 替换为默认图片
                      e.target.alt = "图片加载失败";
                  }}
                />
            )}

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
