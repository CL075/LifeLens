import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIAXTKEZOTGE4CL67D7", // 替换为您的 Access Key ID
        secretAccessKey: "O0gPh69diU1bp2NZ0yp2bfkTSbVSySROx1u+W8Ys", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEPn//////////wEaCXVzLXdlc3QtMiJIMEYCIQDy7IDV+DIyXwUYLrrJt/U9qSmZfkQdsoP3Ur9PwURzlAIhAPW+l96HSHXCyzbiDOdYhdQ17yAWBoqShBiwTVTFMkeLKroCCNL//////////wEQARoMNTIyNTE5NjcyMDEyIgzj600Nl2HYZ3x+IoUqjgIfJzYzFXQhw8vxNsb7PMvRV1bM9VuhkcEJgAYaJP3uIMVc9r+R869ZozKFKr44ppWms/C1DbR7+zUE3uiCiswgTdabgPSJ1S7+uw9kCXxwR3ZKkJ3/DtNvPL5uS5L9Mf3Fb2Xk+0Cg5du5sslzeMJtLuoe7FawKheNpRFiNwH/E8/dqncsq3YJdBRP9GvmHnITyq/JXPw03fbJUlLSimYmvzFuPLb2X4sKvzqoE3Xcw+NePJ2eZKkyyJkZjUDQ3f5Wn4I8mCqwJdXYzM90Op899gcZhNr5+V8hZAEvqcFKgMink+bukhXUpU5SiNCjxbRlPcf0dgNEnwim+SMXxlm1DBtnsnVOcKEcTt0o/JYwup/ZuwY6nAEGtfAQISvaFt1wp2F9PjkPW/nQABwndU6anHbAd2jHl5VWJsKJKNoGoJcIWGhG9Or+Y2D4lnLzoy+VroGWoZXgLCUE0rsqmRTMLOU95kBZ9UWowDroKvGLJwh9VNVAh1B7o0omnnOB0YK3LjIb5Lj2Mrc3M7JnbmOl8ZdOAqp24Ij83PUYRAgXoEWlLYIn8OP/IzgRHJpadxAsE7s=", // 替换为您的 Session Token
    },
});

// 新增数据
// 修正 addEntry 函數
export async function addEntry(userID, date, entryType, content) {
    const entryID = uuidv4();

    const params = {
        TableName: "LifeLensDataNew", // 替換為您的表名稱
        Item: {
            entryID: { S: entryID },
            userID: { S: userID },
            date: { S: date },
            entryType: { S: entryType },
            content: { S: content }, 
        },
    };

    try {
        const data = await dynamoDBClient.send(new PutItemCommand(params));
        console.log("Data added successfully:", data);
    } catch (err) {
        console.error("Error adding data:", err);
    }
}





// 查询数据
export async function queryEntries(userID, startDate, endDate) {
    const params = {
        TableName: "LifeLensDataNew",
        IndexName: "userID-date-index",
        KeyConditionExpression: "userID = :userID AND #dt BETWEEN :startDate AND :endDate",
        ExpressionAttributeNames: {
            "#dt": "date", // 避免 DynamoDB 保留字問題
        },
        ExpressionAttributeValues: {
            ":userID": { S: userID },
            ":startDate": { S: startDate },
            ":endDate": { S: endDate },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        console.log("Query result:", data.Items);
        return data.Items || [];
    } catch (err) {
        console.error("Error querying data:", err);
        return [];
    }
}


export async function getEntryByID(entryID) {
    const params = {
        TableName: "LifeLensDataNew",
        IndexName: "entryID-index", // 使用 GSI
        KeyConditionExpression: "entryID = :entryID",
        ExpressionAttributeValues: {
            ":entryID": { S: entryID },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return data.Items[0] || null; // 返回第一條匹配的記錄
    } catch (err) {
        console.error("Error querying by entryID:", err);
        return null;
    }
}



