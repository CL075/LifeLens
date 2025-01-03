import { DynamoDBClient, PutItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIAZ3TE2CMVPWKNAVEO", // 替换为您的 Access Key ID
        secretAccessKey: "RxAcxakml7CR3hkiOkYCSyBq5hTlKtgFaTg3w5Zf", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEBcaCXVzLXdlc3QtMiJGMEQCIDtoN508Rs9HkyJde8JE6msziJ8ZVh6QmZ1RHxHikgwVAiBDVZOzhb4v8X9os8FQCFwtldXQXpWKWi+4gONwytg2Ziq6Agjw//////////8BEAAaDDY3Nzc0MjUxNDk4NiIMA02k5Km+CNcXVlxUKo4CCdvj5Af8zFRdbCm02K8cs1d+TuGs/KrAusxNg0l7AHI0AO8EMBAGHBthLnPt8ZAhGkW/5NbAKJAa6xF7X268bBZ4iQasM9YMEbBFRikWagro8QVZj2w6XsMhcEsYY2j8hfomofJymAL4/HQD1/MEluZGCheZ/khc1agydAMTMRdnwnFlV4T3jzTQ2b/BmyrX5jI2UaUwUCKbXWF/sSX+J1DRm6VvjQUWtlR7F52WkR5GRguJxaf73IEvXV7OiFquIhkSi2itkL+h9vfB/8bl76vKet2O6ZHU4Ewv7zP97IlKTBX307Gyflqj/9yyOHZvJrxU5FPgrtN8tVSZSCgcmSVqHYWClBU8rWE0IA0iMO7z37sGOp4BXZzbK/oTD/gTgzyOxC1bk06rt6Jy98lOZievK6gRAqQzz++yXOTZ5ZPAEzvbGkbjxsYusUt/k/geDjPBewhT0u6yfuPMkwB5gt35d/Ytc8mCnEp+Xk37fHEBtYSsU6/bZZN+VljdbW4rZZZH5w9s5GnT0fRSBv4D1xwidzYCtV7Cvxt1fd5sjZAaEdzSEvcyMsxM15lnRLtKW6bcm6E=", // 替换为您的 Session Token
    },
    // logger: console, // 啟用調試日誌
});

// 新增数据
// 修正 addEntry 函數
export async function addEntry(userID, email, date, entryType, content) {
    const entryID = uuidv4();

    const params = {
        TableName: "LifeLensDataNew", // 替換為您的表名稱
        Item: {
            entryID: { S: entryID },
            userID: { S: userID },
            email: { S: email }, // 新增 email 欄位
            date: { S: date },
            entryType: { S: entryType },
            content: { S: content }, 
        },
    };

    try {
        console.log("新增數據參數：", JSON.stringify(params, null, 2)); // 調試輸出
        const data = await dynamoDBClient.send(new PutItemCommand(params));
        console.log("新增數據成功：", data);
        return data;
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


// 更新用戶資料函式
export async function updateUserData(updatedUser) {
    const params = {
        TableName: "UsersTable",
        Key: {
        username: { S: updatedUser.username }, // 使用主鍵查詢
        },
        UpdateExpression: "SET email = :email",
        ExpressionAttributeValues: {
        ":email": { S: updatedUser.email },
        },
    };

    try {
        const data = await dynamoDBClient.send(new UpdateItemCommand(params));
        console.log("資料更新成功：", data);
    } catch (err) {
        console.error("資料更新失敗：", err);
        throw err;
    }
}


export async function getUserIDByUsername(username) {
const params = {
    TableName: "UsersTable",
    IndexName: "username-index", // 使用 GSI
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
    ":username": { S: username },
    },
};

try {
    const data = await dynamoDBClient.send(new QueryCommand(params));
    if (data.Items.length > 0) {
    return data.Items[0].userID.S; // 返回 userID
    } else {
    throw new Error("User not found");
    }
} catch (err) {
    console.error("查詢 userID 失敗：", err);
    throw err;
}
}

export async function getUserIDByEmail(email) {
    const params = {
        TableName: "UsersTable",
        IndexName: "email-index", // 使用 GSI
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
        ":email": { S: email },
        },
    };

    try {
        const data = await dynamoDBClient.send(new QueryCommand(params));
        if (data.Items.length > 0) {
        return data.Items[0].userID.S; // 返回 userID
        } else {
        throw new Error("User not found");
        }
    } catch (err) {
        console.error("查詢 userID 失敗：", err);
        throw err;
    }
}

export async function updateUserDataByID(userID, updatedData) {
    if (!updatedData.username && !updatedData.pwHash) {
        throw new Error("更新數據中缺少必須的字段");
    }

    const params = {
        TableName: "UsersTable",
        Key: {
        userID: { S: userID }, // 必須使用 userID
        },
        UpdateExpression: "SET " +
            (updatedData.username ? "username = :username" : "") +
            (updatedData.username && updatedData.pwHash ? ", " : "") +
            (updatedData.pwHash ? "pwHash = :pwHash" : ""),
        ExpressionAttributeValues: {
            ...(updatedData.username && { ":username": { S: updatedData.username } }),
            ...(updatedData.pwHash && { ":pwHash": { S: updatedData.pwHash } }),
            },
};
console.log("構造的更新參數：", params);

    try {
        const data = await dynamoDBClient.send(new UpdateItemCommand(params));
        console.log("資料更新成功：", data);
        return data;
    } catch (err) {
        console.error("資料更新失敗：", err);
        throw err;
    }
}

// 整合邏輯：查詢並更新用戶資料
export async function updateUser(username, updatedData) {
    try {
        const userID = await getUserIDByUsername(username);
        await updateUserDataByID(userID, updatedData);
        console.log("用戶資料更新成功！");
    } catch (error) {
        console.error("更新用戶資料失敗：", error);
    }
}

// 查詢 UsersTable 取得 email
export async function getEmailByUserID(userID) {
const params = {
    TableName: "UsersTable",
    KeyConditionExpression: "userID = :userID",
    ExpressionAttributeValues: {
    ":userID": { S: userID },
    },
};

try {
    console.log("查詢參數：", params); // 調試輸出查詢參數

    const data = await dynamoDBClient.send(new QueryCommand(params));
    console.log("查詢結果：", data); // 調試輸出查詢結果

    if (!data.Items || data.Items.length === 0) {
      throw new Error("No records found for the given userID");
    }

    // const email = data.Items[0].email?.S;
    const email = await getEmailByUserID(userID);
    console.log("獲取的 email：", email);

    if (!email) {
    console.error("無效的 email:", email);
      throw new Error("Email not found in the record");
    }

    return email; // 返回 email
  } catch (err) {
    console.error("查詢 email 失敗：", err);
    throw err;
  }
}

// 基於 email 查詢日記資料
export async function queryEntriesByEmail(email) {
    const params = {
      TableName: "LifeLensDataNew",
      IndexName: "email-index", // 假設已建立 email-index
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    };
  
    try {
      const data = await dynamoDBClient.send(new QueryCommand(params));
      return data.Items || []; // 返回日記資料
    } catch (err) {
      console.error("查詢日記失敗：", err);
      throw err;
    }
  }