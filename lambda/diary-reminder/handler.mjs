import { SNSClient, PublishCommand, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns'; 

// 假設的用戶資料
const users = [
  {
    username: "Mimi",
    email: "linchiah01@gmail.com",
    password: "123123123",
    topicArn: "", // 初始為空，如果不存在將動態創建
    records: [
      { date: "2024/12/18", mood: "happy", note: "今天很開心，完成了運動目標！", exercise: "跑步", exerciseDetails: "跑了5公里", calories: 400, amount: 200, transactionType: "expense" }
    ],
  },
  {
    username: "Adam",
    email: "notwentyseven27b@gmail.com",
    password: "123123123",
    topicArn: "", // 初始為空，如果不存在將動態創建
    records: [
      { date: "2024/12/01", mood: "neutral", note: "今天有點累，沒有做運動。", exercise: "", exerciseDetails: "", calories: 0, amount: 1500, transactionType: "income" }
    ],
  },
];

const snsClient = new SNSClient({ region: "us-east-1" });

// 格式化日期為 yyyy/MM/dd
function formatToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

// 創建 SNS Topic 並自動訂閱 Email
async function createSNSTopic(username, email) {
  try {
    // 創建 Topic
    const createParams = { Name: `${username}_Topic` };
    const createResponse = await snsClient.send(new CreateTopicCommand(createParams));
    const topicArn = createResponse.TopicArn;
    console.log(`成功為用戶 ${username} 創建 Topic: ${topicArn}`);

    // 自動訂閱 Email
    const subscribeParams = {
      Protocol: "email", // 使用 Email 作為訂閱方式
      TopicArn: topicArn,
      Endpoint: email, // 用戶的 Email
    };
    await snsClient.send(new SubscribeCommand(subscribeParams));
    console.log(`成功為 ${email} 發送訂閱確認請求 (${topicArn})`);

    return topicArn;
  } catch (error) {
    console.error(`創建 Topic 或訂閱失敗 (${username}): ${error.message}`);
    throw error;
  }
}

// 發送提醒至指定 SNS Topic
async function sendReminderViaSNS(username, topicArn) {
  const subject = "日記提醒：今天還沒有完成日記記錄！";
  const message = `親愛的 ${username},\n\n我們注意到您今天尚未記錄日記，請記得完成！\n\n祝您有美好的一天！`;

  const publishParams = {
    Message: message,
    Subject: subject,
    TopicArn: topicArn,
  };

  try {
    await snsClient.send(new PublishCommand(publishParams));
    console.log(`提醒已成功發送給用戶 ${username}`);
  } catch (error) {
    console.error(`發送失敗 (${username}): ${error.message}`);
  }
}

// Lambda 主處理邏輯
export const handler = async () => {
  const today = formatToday(); // 格式化今天的日期為 yyyy/MM/dd

  // 檢查並處理每位用戶
  const reminders = users.map(async (user) => {
    // 如果沒有 TopicArn，則動態創建並訂閱 Email
    if (!user.topicArn) {
      try {
        user.topicArn = await createSNSTopic(user.username, user.email);
      } catch (error) {
        console.error(`用戶 ${user.username} 的 Topic 或訂閱創建失敗，跳過通知處理`);
        return;
      }
    }

    // 檢查是否有今日記錄
    const hasTodayRecord = user.records.some((record) => record.date === today);
    if (!hasTodayRecord) {
      console.log(`未找到 ${user.username} 的今日記錄，發送提醒。`);
      await sendReminderViaSNS(user.username, user.topicArn);
    } else {
      console.log(`用戶 ${user.username} 今天已有日記記錄，無需提醒。`);
    }
  });

  // 等待所有用戶的處理完成
  await Promise.all(reminders);
  console.log("所有用戶的日記提醒檢查已完成");
};
