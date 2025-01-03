#打包專案
Lambda 上建立新的函數
並將index.mjs複製上去
TOKEN要改成自己的資料庫
然後部署

#設定 Lambda 的執行條件
建立觸發器： Amazon EventBridge 設定每天晚上 8 點觸發執行。
輸入 cron(0 12 * * ? *)
因為要轉換為對應的UTC時間
