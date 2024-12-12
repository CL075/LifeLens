const app = require('./app');

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`伺服器運行於 http://localhost:${PORT}`);
});
