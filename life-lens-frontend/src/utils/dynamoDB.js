import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIA2IJ6WWFG7PMBASBS", // 替换为您的 Access Key ID
        secretAccessKey: "xec3rPnlEs0Whlk5/zp3b5hXVwaQHZq1q1qVkwnI", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEPj//////////wEaCXVzLXdlc3QtMiJHMEUCIHNaN+5iZtht6NbwcaSiXHGTfeX/z01IFxn4aB6eMGebAiEAmXYBiuZPcxhzgj6iEObrMVAa35a6etK54ehVsvfvr+EqugII0f//////////ARACGgw3MDUwNDMwMTgwNjEiDPx4xfAufN/U6ZSe9SqOAiteKYfRhZ6WaiFTnPtvR9i5obzLiCVBRAK0H/9KyjB4wAXEUmaJQuHvGeHf1UY9IPgSKRuyFKOgNL3gdv09/uE4CAmbAXqjioeubVLm9JB0+/iHaF5tyOtChWNZ7o/BAHVHebiS5nCTPYk9yHk7+nYCjjntayTRYNggPfYewknEfu9m7VLYZ9vO61Y+qhwC954weCNMK9ncmvcbwNvbPftESLHT+jZg26Dsf26jGh48I1MBBtS31qBYkQ4zqkQmCW6uzrNkcM2yUVrraIhZQ/sMMeL9vz/qCoPSSwi4yKxp3IMAqzb9Sk87IJK5OMzzKx9KnuhNx7q1z7AB4ZxmZt2JUchLqk+ydKHRK/is4DChj9m7BjqdASjlnWpfcuZFo3rmZWTTBjNsNDdpXEvek5AlY6nKkzW9V/CshKdf9/NW0/acGtDZFWiRqGet7v7gsRsi3L5A22UbbbeOMmarcaPLASXYHRkWF5NSLLEi+6/LEI4prILQZRG3LErygb/IK75oZqXInlKUnju096QUHXoYflceYoTq9gOHSE3S0ckpJLesocJqnMocH3cOAnKRq+Fcj/s=", // 替换为您的 Session Token
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

export async function queryUserByAttribute(attribute, value) {
    const params = {
        TableName: "UsersTable", // 替換為用戶表名
        IndexName: `${attribute}-index`, // 假設為每個屬性建立了索引
        KeyConditionExpression: `${attribute} = :value`,
        ExpressionAttributeValues: {
            ":value": { S: value },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        console.log(`Query result for ${attribute}:`, data.Items);
        return data.Items || [];
    } catch (err) {
        console.error(`Error querying ${attribute}:`, err);
        return [];
    }
}

export async function addUser(userID, username, email, pwHash) {
    const params = {
        TableName: "UsersTable",
        Item: {
            userID: { S: userID },
            username: { S: username },
            email: { S: email },
            pwHash: { S: pwHash },
            createdAt: { S: new Date().toISOString() },
            updatedAt: { S: new Date().toISOString() },
        },
    };

    try {
        const data = await dynamoDBClient.send(new PutItemCommand(params));
        console.log("User added successfully:", data);
    } catch (err) {
        console.error("Error adding user:", err);
    }
}

export async function queryUserByUsername(username) {
    const params = {
        TableName: "UsersTable",
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": { S: username },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return data.Items || [];
    } catch (err) {
        console.error("Error querying username:", err);
        return [];
    }
}

export async function queryUserByEmail(email) {
    const params = {
        TableName: "UsersTable",
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
            ":email": { S: email },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        return data.Items || [];
    } catch (err) {
        console.error("Error querying email:", err);
        return [];
    }
}



