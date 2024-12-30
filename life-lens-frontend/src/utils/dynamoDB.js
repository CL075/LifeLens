import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVK3734IGM", // 替换为您的 Access Key ID
        secretAccessKey: "As6XoMrjKUHlk4WEEXWwB7gOCUktI0rD0w8bAi7y", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjELP//////////wEaCXVzLXdlc3QtMiJIMEYCIQDfLz6bgdGxKTfOS+Dg5mKmdu0srgPzC4DfBj/zsdqgYAIhAMDho+NwlWRl5ye3sLjNf9nwVuE0glZGVWGQbPCbWvvJKroCCIz//////////wEQABoMNjc3NzQyNTE0OTg2IgyOZ77+Wxz+hjULvYwqjgIkHy+nuSs9j1xoWvHto44/GMiYT57qs0iiaSk1ftGxpz9Th6QpLzrGT72ujVNAlnsqLZ2k2Pr0jzm52BOWwwhSIXF9dokTHS1Rom7hFhZoDLCV9PPsMaXnNi5wSkqxaIHfFuu3Aks12+O+nMWWnLpMpFO51lriETZK2rYGiBJFhTTTxbjQE5ZinLQa6N99MV/mGH0eUN8KnAs1+BrKD/bFbbwN7vP+x/d8tpGKl5ogiOosu9Tkc5mzCtj87MDSMdAs0LbQJzgtg1uOn05bP5Lr2im0elh6f+LZl6JpCpAub1hLcUuCnJBKgk4gdOykXEeaxjNi7u8JAcg7mNhjr7GzL6yBA33E9Me8dccDPVowk/HJuwY6nAEaAbQ+HAKemwYbFXy/yF1mdo37op/3ZTkgLp+LSG6c1vbjX6ka6MZzSCF75zQInhqVwAKW4brUfnTI1WL0DuCOa07O46XNi8occVlIv6CaDPQtk+5XdMl/0xSXLpxecA1qRgr21uZVZfG6WE03Wa3VIf51sfFBfJY+xqibvtA0A6AfGIaMR0hZ3mZIg+OulQnx6HJBzGrHFyMfsH0=", // 替换为您的 Session Token
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



