import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient();

/**
 * 產生「完整的回饋建議 (文字)」
 */
function generateTrendFeedback(records) {
  const feedbackList = [];

  // 1) 運動次數
  const exerciseRecords = records.filter((r) => r.exercise !== "無運動");
  const exerciseCount = exerciseRecords.length;

  // 2) 心情分類統計
  const positiveMoods = ["super_happy", "happy"];
  const negativeMoods = ["unhappy", "crying", "angry"];
  const neutralMoods = ["neutral", "calm"];

  const positiveCount = records.filter((r) => positiveMoods.includes(r.mood)).length;
  const negativeCount = records.filter((r) => negativeMoods.includes(r.mood)).length;
  const neutralCount  = records.filter((r) => neutralMoods.includes(r.mood)).length;

  // 3) 卡路里、平均消耗
  const totalCalories = records.reduce((sum, r) => sum + parseFloat(r.calories || 0), 0);
  const averageCaloriesPerExercise = exerciseCount > 0
    ? (totalCalories / exerciseCount).toFixed(2)
    : 0;

  // 4) 收入 vs 支出
  const totalIncome = records
    .filter((r) => r.transactionType === "income")
    .reduce((acc, r) => acc + parseFloat(r.amount || 0), 0);
  const totalExpense = records
    .filter((r) => r.transactionType === "expense")
    .reduce((acc, r) => acc + parseFloat(r.amount || 0), 0);

  // 5) 最常進行的運動
  const exerciseFrequency = exerciseRecords.reduce((acc, r) => {
    acc[r.exercise] = (acc[r.exercise] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentExercise = Object.entries(exerciseFrequency)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "無運動";

  // 6) 建立習慣目標 (假設最後一筆是本月記錄；過去紀錄為 records.slice(0, -1))
  const pastRecords = records.slice(0, -1);
  const pastExerciseCount = pastRecords.filter((r) => r.exercise !== "無運動").length;
  const pastCalories = pastRecords.reduce(
    (sum, r) => sum + parseFloat(r.calories || 0),
    0
  );

  const suggestedGoal = {
    exercise: pastRecords.length > 0
      ? Math.ceil((pastExerciseCount / pastRecords.length) * 30)
      : 5,
    calories: pastRecords.length > 0
      ? Math.ceil(pastCalories / pastRecords.length)
      : 200,
  };

  // 7) 根據上述統計 push 回饋文字

  // 如果沒有運動
  if (exerciseCount === 0) {
    feedbackList.push("最近你還沒開始運動，不妨從簡單的運動開始，動起來！💪");
  }

  // 心情判斷
  if (positiveCount > negativeCount) {
    feedbackList.push("最近你的心情總體較正面，保持運動習慣能讓你繼續維持好心情！😊");
  }
  if (negativeCount > positiveCount) {
    feedbackList.push("最近的負面情緒較多，試著增加運動次數，改善你的心情吧！🌟");
  }
  if (neutralCount > positiveCount && neutralCount > negativeCount) {
    feedbackList.push("最近你的心情以中性為主，嘗試新的活動讓生活多些色彩吧！✨");
  }

  // 卡路里情況
  if (totalCalories > 2000) {
    feedbackList.push(
      `你這段時間共消耗了 ${totalCalories} 卡路里，平均每次運動消耗 ${averageCaloriesPerExercise} 卡路里，表現非常棒！🔥`
    );
  }

  // 收支情況
  if (totalIncome > totalExpense) {
    feedbackList.push(
      `財務方面，你的收入 (${totalIncome} 元) 大於支出 (${totalExpense} 元)，穩定存錢！繼續保持！💰`
    );
  } else {
    feedbackList.push("你的支出高於收入，建議重新評估財務狀況，控制不必要的花費。💡");
    feedbackList.push("試著設定每月存儲目標，讓財務更加健康！📈");
  }

  // 最常運動
  if (mostFrequentExercise) {
    feedbackList.push(
      `本月最常進行的運動是「${mostFrequentExercise}」，試著挑戰一些新運動，讓運動計畫更有趣！🏋️‍♀️`
    );
  }

  // 建議目標
  feedbackList.push(
    `基於你的歷史記錄，建議每月至少運動 ${suggestedGoal.exercise} 天，每次運動消耗 ${suggestedGoal.calories} 卡路里，讓生活更健康！📊`
  );

  return feedbackList;
}

/**
 * 產生「補充分析資料」，例如：moodAfterExercise、exerciseFrequency、mostFrequentExercise
 */
function generateAnalysis(records) {
  // 心情與運動的關聯性
  const moodAfterExercise = records.reduce((stats, record) => {
    if (record.exercise !== "無運動") {
      stats[record.mood] = (stats[record.mood] || 0) + 1;
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

  // 使用者最常用的運動
  const mostFrequentExercise =
    Object.entries(exerciseFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || "無";

  return {
    moodAfterExercise,
    exerciseFrequency,
    mostFrequentExercise,
  };
}

/**
 * Lambda 主 handler
 * 1. 依照 email 查詢 DynamoDB
 * 2. 整理資料
 * 3. 分別呼叫 generateTrendFeedback(records) 和 generateAnalysis(records)
 * 4. 回傳 { records, feedbackList, analysis }
 */
export const handler = async (event) => {
  try {
    // 1. 取得 email
    const email = event.queryStringParameters?.email;
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "缺少 email 參數" }),
      };
    }

    // 2. 查詢 DynamoDB
    const params = {
      TableName: "LifeLensDataNew",
      IndexName: "email-index",
      KeyConditionExpression: "email = :emailVal",
      ExpressionAttributeValues: {
        ":emailVal": { S: email },
      },
    };
    const data = await client.send(new QueryCommand(params));

    // 查無資料
    if (!data.Items || data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "找不到符合的資料" }),
      };
    }

    // 3. 整理成前端需要的 records
    const records = data.Items.map((item) => {
      const content = JSON.parse(item.content?.S || "{}");
      return {
        entryID: item.entryID?.S,
        date: item.date?.S,
        mood: content.mood || "neutral",
        note: content.note || "",
        exercise: content.exercise || "無運動",
        exerciseDetails: content.exerciseDetails || "",
        calories: parseFloat(content.calories || 0),
        amount: parseFloat(content.amount || 0),
        transactionType: content.transactionType || "expense",
      };
    });

    // 4. 產生整合分析
    const feedbackList = generateTrendFeedback(records);
    const analysis = generateAnalysis(records);

    // 5. 一併回傳
    return {
      statusCode: 200,
      body: JSON.stringify({
        records,
        feedbackList,
        analysis,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
