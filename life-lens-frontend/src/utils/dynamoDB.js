import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

// 配置 AWS DynamoDB 客户端
const REGION = "us-east-1"; // 替换为您的区域
const dynamoDBClient = new DynamoDBClient({
    region: REGION,
    credentials: {
        accessKeyId: "ASIA2IJ6WWFGXADDRTMX", // 替换为您的 Access Key ID
        secretAccessKey: "68nOn/QelO16ZnY30WhS1EPh6ovdD8WnNoqccqhN", // 替换为您的 Secret Access Key
        sessionToken: "IQoJb3JpZ2luX2VjEPz//////////wEaCXVzLXdlc3QtMiJHMEUCIQCnonYCP4s+SJTD/Aib153jSuuxG4J07NGhl9CGz8zS3AIgZpH1GlB0aIhsVvKr4ROO2bQrl7SBGH9uGgmlpzo/O0UqugII1f//////////ARACGgw3MDUwNDMwMTgwNjEiDFXizmAmNl1o0hDWLCqOAlBDMluBp7845SsR7xsAs/KRXgLi1YFOXWUcwXEQWURwtHm4/ASnJ9JrG2O5WFUfWLhEF+t3GC5z6Br2/k82T1LveyB0gXGi+XTkQdbzvWoY2TAkPbOgYefENYgmmMIsmlnBgf+ngUf7hCb2P8TU6bx0KzHccw/aZzr/c3yLJspbu+6qDocvunkJSHmKsr75frQHj6/sFR9UPx6mxtb8yL8zbHhGcToVYWTTGrg7eCydTjhTBFyvsUEtDJge582pJ7L10b9dLCqiHIyRhorIkTyQtF1GDGaCkXu2eSFKsxrof7Ccjq7SXEIbETRiNjZBWxdeDa50nahPu4B9QwFfJy7FgzfUcYobgJPZOUTj9zC6hdq7BjqdAVw2PGQQh2DgGJl6FuOISZrEED4i4mZJmYEjV9Jb4aIY8lnJaG9LKO7o6e9H//x3hVPk1tthI6mHhqfBMN9mHlRHgkYXQagQL7KIBs9KjKLXxCJJIot/gzQvXPu1dvRyMql2Khwpa2E8vdQQmG5kIQm0iEfQkqijSee5F6fCP/xePJDogRoXvBSBkDXDEZQdV4NiAezx+sQouFu36Go=", // 替换为您的 Session Token
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



