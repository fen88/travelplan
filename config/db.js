const mysql = require('mysql2/promise');
require('dotenv').config();

// 創建連接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'travel_user',
  password: process.env.DB_PASSWORD || 'Ab12345678!',
  database: process.env.DB_NAME || 'travel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// 測試連接
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL 數據庫連接成功');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL 數據庫連接失敗:', err.message);
  });

module.exports = pool;
