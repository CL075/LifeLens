import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVBVCLE5NE", // 替换为您的 Access Key ID
        secretAccessKey: "RLh5cYN5wydjnf9fZvrGAM/XD7t5WQKZc6El/Qjy", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEBsaCXVzLXdlc3QtMiJHMEUCIQC7duH6T6hsMHRA1cFmxQemmgwiUFd2Ox5qBkqIuR1JywIgTjvUzKpKYdfC7h0tedpuewwQ5ncADIIX8aqQMU9LZn8qugII1P//////////ARAAGgw2Nzc3NDI1MTQ5ODYiDG3NJ/2Pg1MiLJH47SqOAgTtBsb1y74ch35b6trrKOiCLdf8PAl2iSEPN85bTyv/+2Jadlkkn2RZTspPtIRgGt3CQ8gsIkZgV15Vn5E0Z/UzgySUozM3sjjr2WF7SS+a5Cb6xDqHJ93ORQZpWAoCBRawG4wopNTug0CqvqAeljcGgHs/TrMxQXRqcaAJjdZOYq1GiWHHiMgj3Vsk1Z4vK3x/xeHjZuG0zTAB7w2gw8pZ9k0BbKvA+px+Zx0xRxN5cFhSfmbwaFBARNp53F91wJcXO2Ug93EiVjS8atoS60eL/vQebZq3R6O5Q90xw1LXoK0CNgNIdrPdmW/65m/4bD2pbkcE/cBwBdtvibjTA4FBllvRKsDNl8ZUFgqwhTC0pfC6BjqdAXrq8Itnp4uyzSOKRGnG50ZKIOX3PTTTLs+pWzmEZlYE8KpjCAFjkfDFRXFCkNaSGGQsqBIcqSJe7yVTNIyHaa3rkrAKoYSFlFu6jqTis+rXIuRDjXZDE9B25susa0TsmHvfsfv58YtEMK8tRHciZXKkMpKp6cSrzdPzY8I6X3bz+Wxc5QoiUPLoKnQOQZd0xuHuBfMCCzG5GH2riYQ=", // 替换为您的 Session Token
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



