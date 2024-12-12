const AWS = require('aws-sdk');

// 設定 AWS 區域（例如：亞太區 / 東京）
AWS.config.update({
  region: 'ap-northeast-1',  // 這是東京區域，根據你所使用的 AWS 區域進行更改
});

// 創建 DynamoDB 客戶端
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// 儲存記錄
exports.saveRecord = async (data) => {
  const params = {
    TableName: 'DailyRecords', // 你 DynamoDB 中的資料表名稱
    Item: {
      id: Date.now().toString(),  // 每一條記錄的唯一 ID
      ...data                    // 填入傳過來的資料（如心情、筆記等）
    }
  };

  try {
    await dynamoDb.put(params).promise();  // 將資料寫入 DynamoDB
    return params.Item;
  } catch (error) {
    throw new Error(`儲存資料失敗: ${error.message}`);
  }
};

// 取得所有記錄
exports.getRecords = async () => {
  const params = { TableName: 'DailyRecords' };

  try {
    const result = await dynamoDb.scan(params).promise();  // 從資料表中讀取所有記錄
    return result.Items;
  } catch (error) {
    throw new Error(`讀取資料失敗: ${error.message}`);
  }
};
