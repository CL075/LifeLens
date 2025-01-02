import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVA65SERHS", // 替换为您的 Access Key ID
        secretAccessKey: "ya9hLMBqXe2NMpatDViGKxg0u9nGLmHznfrMPMj0", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEP3//////////wEaCXVzLXdlc3QtMiJHMEUCICEhE7UtEUqHGOIuv8dJ3dY7bLDXcIQ5Er6ybSjRiDyqAiEA7QbZq060owMwj/fYc1+FdzI4JUCcIItGCxucNlCVFRAqugII1v//////////ARAAGgw2Nzc3NDI1MTQ5ODYiDIf3LuNy59Y6Y+UMBCqOArJVu4sUD8DRY+rcbJDLmY5LgqD1O0Urhe/extdOvxGsvRCI5jp4vY/Ykey6wBTdT+hc0xVkeNbGm0vkGf1qSvygZeWE5N0u9RxYz7LEnVwiHomjcWWZDHff4OoeXVfIAZozPGUak1fKZxZohA29tMfzSGx9L48ktjmM2dAPSThYKQuEmj2Cb1yLB5owVBvoAQJ2KQCPSHskbPkOExKyh77aLaAlLseHa+18JY6e4igdVeu6tC3OuDkgZ0j3ZbjVxOeD+57aAZNmDbw5XLDNk0jDXFK4r80ecQrH9JlSc8WEcvdkhJdvNpIoymsj+YxaeQ5xu/H3il59mq+pc2nUFthadZA8wPzZHMENPClbRzCMjNq7BjqdAU1VDtjr5tXRHSfBoSytfGnad6AaMY46T3sbz/zeG4O1GOpbpb0aXx2Zoon2ffgVjpO/f7jjHCUa+RQyPWfRuD68wEfp2gTc6N+MxN2XWD+YEfloPKxFaQA8glzbBxQVUApqp8nCBT/If7vtED1JtOsjlQIiWec5Lf8iLRBjjGt246QjEC8oXKEhsjPOwC94DJPZxPkxBgqJuMK72Gg=", // 替换为您的 Session Token
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



