const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();  // 載入 .env 檔案
const AWS = require('aws-sdk');
// 印出 process.env.AWS_REGION
console.log(process.env.AWS_REGION);
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
});


const recordRoutes = require('./routes/recordRoutes');

const app = express();

// 中間件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/api/records', recordRoutes);

// 錯誤處理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('伺服器錯誤！');
});

module.exports = app;
