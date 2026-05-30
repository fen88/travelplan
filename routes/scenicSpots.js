const express = require('express');
const router = express.Router();
const controller = require('../controllers/scenicSpotController');

// 景點 CRUD 路由
router.get('/', controller.getAll);        // 獲取所有景點
router.get('/:id', controller.getById);    // 獲取單個景點
router.post('/', controller.create);       // 新增景點
router.put('/:id', controller.update);     // 更新景點
router.delete('/:id', controller.remove);  // 刪除景點

module.exports = router;
