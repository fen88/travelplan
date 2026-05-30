const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const scenicRoutes = require('./routes/scenicSpots');

const app = express();
const PORT = process.env.PORT || 3000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- 靜態檔案（旅遊首頁、布吉頁面等） ----
app.use(express.static(path.join(__dirname, 'public')));

// ---- API 路由 ----

// 數據庫健康檢查
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./config/db');
    const [result] = await pool.query('SELECT 1 AS ping');
    res.json({ db: 'connected', ping: result[0].ping });
  } catch (err) {
    res.status(500).json({ db: 'disconnected', error: err.message });
  }
});

// 景點 CRUD API
app.use('/api/scenic-spots', scenicRoutes);

// ---- 404 處理 ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: '路由不存在' });
});

// ---- 全局錯誤處理 ----
app.use((err, req, res, next) => {
  console.error('❌ 未捕獲錯誤:', err);
  res.status(500).json({ success: false, message: '服務器內部錯誤' });
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`🚀 Travel Backend 啟動成功，端口: ${PORT}`);
});
