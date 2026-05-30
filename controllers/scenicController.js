/**
 * 景點控制器 - scenic_spots CRUD 邏輯
 */

const pool = require('../config/db');

// ============ 輔助函數 ============

/** 包裝成功響應 */
function success(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

/** 包裝錯誤響應 */
function fail(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

// ============ CRUD ============

/**
 * GET /api/scenic-spots
 * 獲取所有景點列表（支援分頁 & 模糊搜尋）
 */
async function list(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      keyword = '',
    } = req.query;

    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);
    const size = Math.min(Math.max(1, Number(limit)), 100);

    let where = '';
    const params = [];

    if (keyword.trim()) {
      where = 'WHERE name LIKE ? OR address LIKE ?';
      params.push(`%${keyword.trim()}%`, `%${keyword.trim()}%`);
    }

    // 查總數
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM scenic_spots ${where}`,
      params
    );
    const total = countRows[0].total;

    // 查列表
    const [rows] = await pool.query(
      `SELECT * FROM scenic_spots ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, size, offset]
    );

    return success(res, {
      list: rows,
      pagination: {
        page: Number(page),
        limit: size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (err) {
    console.error('❌ list 錯誤:', err.message);
    return fail(res, '獲取景點列表失敗', 500);
  }
}

/**
 * GET /api/scenic-spots/:id
 * 根據 ID 獲取單個景點詳情
 */
async function detail(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM scenic_spots WHERE id = ?', [id]);

    if (rows.length === 0) {
      return fail(res, `景點 #${id} 不存在`, 404);
    }

    return success(res, rows[0]);
  } catch (err) {
    console.error('❌ detail 錯誤:', err.message);
    return fail(res, '獲取景點詳情失敗', 500);
  }
}

/**
 * POST /api/scenic-spots
 * 新增一個景點
 * Body: { name, address, price, description }
 */
async function create(req, res) {
  try {
    const { name, address, price, description } = req.body;

    // 必填校驗
    if (!name || !name.trim()) {
      return fail(res, '景點名稱 name 為必填項');
    }

    const [result] = await pool.query(
      `INSERT INTO scenic_spots (name, address, price, description) VALUES (?, ?, ?, ?)`,
      [name.trim(), (address || '').trim(), Number(price) || 0, description || '']
    );

    // 回傳新記錄
    const [rows] = await pool.query('SELECT * FROM scenic_spots WHERE id = ?', [result.insertId]);

    return success(res, rows[0], 201);
  } catch (err) {
    console.error('❌ create 錯誤:', err.message);
    return fail(res, '新增景點失敗', 500);
  }
}

/**
 * PUT /api/scenic-spots/:id
 * 修改景點信息（全量更新）
 * Body: { name, address, price, description }
 */
async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, address, price, description } = req.body;

    // 檢查是否存在
    const [existing] = await pool.query('SELECT id FROM scenic_spots WHERE id = ?', [id]);
    if (existing.length === 0) {
      return fail(res, `景點 #${id} 不存在`, 404);
    }

    // 必填校驗
    if (!name || !name.trim()) {
      return fail(res, '景點名稱 name 為必填項');
    }

    await pool.query(
      `UPDATE scenic_spots SET name = ?, address = ?, price = ?, description = ? WHERE id = ?`,
      [name.trim(), (address || '').trim(), Number(price) || 0, description || '', id]
    );

    // 回傳更新後資料
    const [rows] = await pool.query('SELECT * FROM scenic_spots WHERE id = ?', [id]);
    return success(res, rows[0]);
  } catch (err) {
    console.error('❌ update 錯誤:', err.message);
    return fail(res, '修改景點失敗', 500);
  }
}

/**
 * DELETE /api/scenic-spots/:id
 * 刪除景點
 */
async function remove(req, res) {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM scenic_spots WHERE id = ?', [id]);
    if (existing.length === 0) {
      return fail(res, `景點 #${id} 不存在`, 404);
    }

    await pool.query('DELETE FROM scenic_spots WHERE id = ?', [id]);

    return success(res, { id: Number(id), deleted: true });
  } catch (err) {
    console.error('❌ remove 錯誤:', err.message);
    return fail(res, '刪除景點失敗', 500);
  }
}

module.exports = { list, detail, create, update, remove };
