import {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  SubscribeCommand,
} from "@aws-sdk/client-sns";
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
const snsClient = new SNSClient({ region: "us-east-1" });

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: "ASIA27HET6GPX6OEKZB7", // 替换为您的 Access Key ID
    secretAccessKey: "CSZh4fOet6dfCbXcpdvc6Sk1kK3ufGmG1I6kUnM0", // 替换为您的 Secret Access Key
    sessionToken:
      "IQoJb3JpZ2luX2VjEFYaCXVzLXdlc3QtMiJGMEQCIAUr/E3L+Ym0b34x7lneKBxsKcjfU+N8ixHk8GtBRg/vAiBhlTJcceAnPd3GWGTMTBqbR0BHJrkYavczWLva3ganPCqxAgg/EAEaDDc1NDI0NjIxODE0MyIMpjDJmKvrCRCwcgl/Ko4CLtbIu6+bjMKcnZ3fbDeuRJ7gQmkfOc84YBsbADU40xjq1uCVYgahG/iIN14MOMz/ik2kyWfuQkShiipsBJQ3jmd2b9Z/uwEeVDXeSYsrSDUF4I+/56/q8kP1y20nmfOSsG7YowfUlxJP1MqGzyAvX8scmxO2dTfMk+T9MCtCXUFwoSOUhSC8x5YEl21Y0h0XHzPNtEh4RwZpoAHpmS2WU0znk6oRRHYolK2m0w52ciNuBq3FzLB2TtQliMIV3yphSXg9YMsidst/lhFbZcBZSX8fCZWrufGWLf3nzptUURpYreFrE22nPyw7vkEd6xigMUMtbbZ9Jau2iSo5jHp6XSCTUGdeey2RWM9Jwm0lMOPd7bsGOp4BB1GwXwPqS8YPrYE5YY7mR56wmTh9g50Ep+Mej3pm/mpVSPaXq+x3ytnpuAHTqpb6bWpQGkXNMEyB2leCZ3PG7xwaiOkNOwOQQgXT1V3j5cKtuuDspor1u8U/sQlJzEDw2uXB+RT/6oh9gRApCz10DRrjv8kFtcOAopv9MvyJtn/JAmSZgA+dtaG8VLpPmxfpwuMM+irPI0HBIimXC8A=", // 替换为您的 Session Token    },
  },
  logger: console, // 啟用調試日誌
});

async function getAllUsersEmail() {
  let allUsersEmail = [];
  let lastEvaluatedKey = null;

  do {
    const params = {
      TableName: "UsersTable", // 替換為您的資料表名稱
      ExclusiveStartKey: lastEvaluatedKey, // 用於分頁
      ProjectionExpression: "email", // 僅檢索 email 欄位
    };

    try {
      const command = new ScanCommand(params);
      const response = await dynamoDBClient.send(command);

      // 合併結果
      const emails = (response.Items || []).map((item) => item.email.S); // 假設 email 是 String 類型
      allUsersEmail.push(...emails);
      // 更新分頁起點
      lastEvaluatedKey = response.LastEvaluatedKey;
    } catch (error) {
      console.error("Error scanning table:", error);
      throw error;
    }
  } while (lastEvaluatedKey); // 繼續處理分頁

  return allUsersEmail;
}

const getRecordByEmail = async (email) => {
  try {
    const params = {
      TableName: "LifeLensDataNew", // 替換為第二個資料表名稱
      IndexName: "email-index",
      KeyConditionExpression: "email = :email", // 假設 email 為分區鍵
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
      ProjectionExpression: "#d", // 使用映射的名字
      ExpressionAttributeNames: {
        "#d": "date", // 將 "date" 映射為 #d
      },
    };

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("mail得到record=", response.Items);
    return response.Items || []; // 返回 date 資料
  } catch (error) {
    console.error(`檢查 Email(${email}) 的 Date 時發生錯誤:`, error);
    throw error;
  }
};

const getUsernameByEmail = async (email) => {
  try {
    const params = {
      TableName: "UsersTable", // 替換為第二個資料表名稱
      IndexName: "email-index",
      KeyConditionExpression: "email = :email", // 假設 email 為分區鍵
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
      ProjectionExpression: "#n", // 使用映射的名字
      ExpressionAttributeNames: {
        "#n": "username",
      },
    };

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    return response.Items[0].username.S || ""; // 返回 date 資料
  } catch (error) {
    console.error(`檢查 Email(${email}) 的 Username 時發生錯誤:`, error);
    throw error;
  }
};

const getSNSByEmail = async (email) => {
  try {
    const params = {
      TableName: "UsersTable", // 替換為第二個資料表名稱
      IndexName: "email-index",
      KeyConditionExpression: "email = :email", // 假設 email 為分區鍵
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
      ProjectionExpression: "#s", // 使用映射的名字
      ExpressionAttributeNames: {
        "#s": "SNS",
      },
    };

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("mail得到SNS=", response.Items);
    return response.Items[0].SNS.S || ""; // 返回 date 資料
  } catch (error) {
    console.error(`檢查 Email(${email}) 的 SNS 時發生錯誤:`, error);
    throw error;
  }
};

const getUserIDByEmail = async (email) => {
  try {
    const params = {
      TableName: "UsersTable", // 替換為第二個資料表名稱
      IndexName: "email-index",
      KeyConditionExpression: "email = :email", // 假設 email 為分區鍵
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
      ProjectionExpression: "#u", // 使用映射的名字
      ExpressionAttributeNames: {
        "#u": "userID",
      },
    };

    const command = new QueryCommand(params);
    const response = await dynamoDBClient.send(command);
    console.log("mail得到userID=", response.Items);
    return response.Items[0].userID.S || ""; // 返回 date 資料
  } catch (error) {
    console.error(`檢查 Email(${email}) 的 UserID 時發生錯誤:`, error);
    throw error;
  }
};

const updateSNSByEmail = async (email, SNS) => {
  console.log(`正在更新 DynamoDB 表中 Email 為 ${email} 的 TopicArn...`);
  const userID = await getUserIDByEmail(email);
  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: "UsersTable", // 替換為您的表名稱
      Key: {
        userID: { S: userID }, // 假設 Username 是主鍵
      },
      UpdateExpression: "SET SNS = :SNS",
      ExpressionAttributeValues: {
        ":SNS": { S: SNS },
      },
      ReturnValues: "UPDATED_NEW",
    })
  );
  console.log(`成功更新 DynamoDB 表中 Email 為 ${email} 的 TopicArn`);
};

// 創建 SNS Topic 並自動訂閱 Email
async function createSNSTopic(email) {
  const username = await getUsernameByEmail(email);
  try {
    // 創建 Topic
    console.log("createSNSTopic韓式");
    const createParams = { Name: `${username}_Topic` };
    const createResponse = await snsClient.send(
      new CreateTopicCommand(createParams)
    );
    const topicArn = createResponse.TopicArn;
    console.log(`成功為用戶 ${username} 創建 Topic: ${topicArn}`);

    // 自動訂閱 Email
    const subscribeParams = {
      Protocol: "email", // 使用 Email 作為訂閱方式
      TopicArn: topicArn,
      Endpoint: email, // 用戶的 Email
    };
    await snsClient.send(new SubscribeCommand(subscribeParams));
    console.log(`成功為 ${username} 發送訂閱確認請求 (${topicArn})`);

    await updateSNSByEmail(email, topicArn);

    return topicArn;
  } catch (error) {
    console.log("createSNSTopic失敗");
    console.error(`創建 Topic 或訂閱失敗 (${username}): ${error.message}`);
    throw error;
  }
}

// 發送提醒至指定 SNS Topic
async function sendReminderViaSNS(email, topicArn) {
  console.log("topicArn=", topicArn);
  const subject = "日記提醒：今天還沒有完成日記記錄！";
  const username = await getUsernameByEmail(email);
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
  const today = new Date();
  console.log("today:", today);
  const AllUsersEmail = await getAllUsersEmail();
  console.log("users:", AllUsersEmail);

  for (const email of AllUsersEmail) {
    console.log("username=", await getUsernameByEmail(email));
    console.log("SNS=", await getSNSByEmail(email));
    let SNSTopic = await getSNSByEmail(email);
    // 如果沒有 TopicArn，則動態創建並訂閱 Email
    if (!SNSTopic) {
      try {
        console.log("試著創建訂閱");
        SNSTopic = await createSNSTopic(email);
      } catch (error) {
        console.error(`用戶 ${email} 的 Topic 或訂閱創建失敗，跳過通知處理`);
        continue;
      }
    }

    const dates = await getRecordByEmail(email);
    let flag = 0;
    for (let i = 0; i < dates.length; i++) {
      console.log("date=", dates[i].date.S);
      console.log("today=", today.toISOString().split("T")[0]);
      if (dates[i].date.S === today.toISOString().split("T")[0]) {
        console.log("找到了", dates[i].date.S, "的資料");
        flag = 1;
        break;
      }
    }
    if (flag) {
      console.info(`Email(${email}) 在第二個資料表中有 Date 資料:`, dates);
      console.log(`用戶 ${email} 今天已有日記記錄，無需提醒。`);
    } else {
      console.info(`Email(${email}) 在第二個資料表中無 Date 資料`);
      console.log(`未找到 ${email} 的今日記錄，發送提醒。`);
      await sendReminderViaSNS(email, SNSTopic);
    }
  }

  // // 等待所有用戶的處理完成
  // await Promise.all(reminders);
  console.log("所有用戶的日記提醒檢查已完成");
};
