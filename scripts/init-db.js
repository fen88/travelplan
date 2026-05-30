/**
 * 一鍵執行建表腳本
 * 用法: node scripts/init-db.js
 *
 * 會讀取 database/ 下的 SQL 文件依次執行。
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ============ 配置 ============
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'travel_user',
  password: process.env.DB_PASSWORD || 'Ab12345678!',
  // 不用 database，因為要先確保 database 存在
};

const DB_NAME = process.env.DB_NAME || 'travel_db';

const SQL_DIR = path.join(__dirname, '..', 'database');

// ============ 主流程 ============
async function initDatabase() {
  let connection;
  try {
    // 1. 先連到 MySQL（不指定數據庫）
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ 已連接到 MySQL 服務器');

    // 2. 確保數據庫存在
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ 數據庫 "${DB_NAME}" 已就緒`);

    // 3. 切換到該數據庫
    await connection.query(`USE \`${DB_NAME}\``);

    // 4. 讀取並執行所有 .sql 文件
    const sqlFiles = fs
      .readdirSync(SQL_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort(); // 按文件名順序執行

    if (sqlFiles.length === 0) {
      console.log('⚠️  database/ 目錄下沒有 .sql 文件');
      return;
    }

    for (const file of sqlFiles) {
      const sqlPath = path.join(SQL_DIR, file);
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      console.log(`\n📄 執行: ${file}`);

      for (const stmt of statements) {
        await connection.query(stmt);
        // 只印頭 60 個字符作記錄
        const preview = stmt.split('\n')[0].substring(0, 60);
        console.log(`   ✓ ${preview}...`);
      }
    }

    console.log('\n🎉 所有 SQL 執行完成！');
  } catch (err) {
    console.error('\n❌ 執行失敗:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();
