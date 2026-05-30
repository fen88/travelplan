const pool = require('../config/db');

const scenicSpotController = {
  // GET /api/scenic-spots — 獲取所有景點
  async getAll(req, res) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM scenic_spots ORDER BY created_at DESC'
      );
      res.json({ success: true, count: rows.length, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/scenic-spots/:id — 獲取單個景點
  async getById(req, res) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM scenic_spots WHERE id = ?',
        [req.params.id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: '景點不存在' });
      }
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/scenic-spots — 新增景點
  async create(req, res) {
    try {
      const { name, address, price, description } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: '名稱不能為空' });
      }

      const [result] = await pool.query(
        'INSERT INTO scenic_spots (name, address, price, description) VALUES (?, ?, ?, ?)',
        [name.trim(), address || '', price ?? 0, description || null]
      );

      const [newRow] = await pool.query(
        'SELECT * FROM scenic_spots WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json({ success: true, data: newRow[0] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // PUT /api/scenic-spots/:id — 更新景點
  async update(req, res) {
    try {
      const { name, address, price, description } = req.body;

      const [existing] = await pool.query(
        'SELECT id FROM scenic_spots WHERE id = ?',
        [req.params.id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ success: false, error: '景點不存在' });
      }

      await pool.query(
        'UPDATE scenic_spots SET name = ?, address = ?, price = ?, description = ? WHERE id = ?',
        [
          name !== undefined ? name : existing[0].name,
          address !== undefined ? address : existing[0].address,
          price !== undefined ? price : existing[0].price,
          description !== undefined ? description : existing[0].description,
          req.params.id,
        ]
      );

      const [updated] = await pool.query(
        'SELECT * FROM scenic_spots WHERE id = ?',
        [req.params.id]
      );

      res.json({ success: true, data: updated[0] });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // DELETE /api/scenic-spots/:id — 刪除景點
  async remove(req, res) {
    try {
      const [existing] = await pool.query(
        'SELECT id FROM scenic_spots WHERE id = ?',
        [req.params.id]
      );
      if (existing.length === 0) {
        return res.status(404).json({ success: false, error: '景點不存在' });
      }

      await pool.query('DELETE FROM scenic_spots WHERE id = ?', [
        req.params.id,
      ]);

      res.json({ success: true, message: '景點已刪除' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = scenicSpotController;
