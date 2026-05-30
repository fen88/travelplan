/**
 * 景點路由 - 所有 /api/scenic-spots 相關路由
 */
const { Router } = require('express');
const router = Router();

const {
  list,
  detail,
  create,
  update,
  remove,
} = require('../controllers/scenicController');

// GET    /api/scenic-spots        → 列表（支援分頁 & 搜尋）
router.get('/', list);

// GET    /api/scenic-spots/:id    → 詳情
router.get('/:id', detail);

// POST   /api/scenic-spots        → 新增
router.post('/', create);

// PUT    /api/scenic-spots/:id    → 修改
router.put('/:id', update);

// DELETE /api/scenic-spots/:id    → 刪除
router.delete('/:id', remove);

module.exports = router;
