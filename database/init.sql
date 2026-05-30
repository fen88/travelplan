-- ============================================================
-- Travel Database 初始化腳本
-- ============================================================

-- 建立 scenic_spots（景點表）
CREATE TABLE IF NOT EXISTS `scenic_spots` (
  `id`           INT UNSIGNED    NOT NULL AUTO_INCREMENT  COMMENT '景點唯一ID',
  `name`         VARCHAR(100)    NOT NULL                 COMMENT '景點名稱',
  `address`      VARCHAR(255)    NOT NULL DEFAULT ''      COMMENT '詳細地址',
  `price`        DECIMAL(10,2)   NOT NULL DEFAULT 0.00    COMMENT '門票價格（元）',
  `description`  TEXT                                     COMMENT '景點描述',
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '創建時間',
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新時間',
  PRIMARY KEY (`id`),
  INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景點表';
