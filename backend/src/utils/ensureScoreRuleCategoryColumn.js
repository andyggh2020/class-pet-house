const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function ensureScoreRuleCategoryColumn() {
  const queryInterface = sequelize.getQueryInterface();

  // 获取表结构，表不存在则跳过
  let table;
  try {
    table = await queryInterface.describeTable('score_rules');
  } catch (err) {
    console.warn('⚠️ score_rules 表不存在，跳过字段补齐:', err.message);
    return false;
  }

  const added = [];

  // ---- category 列 ----
  if (!table.category) {
    console.log('📋 score_rules.category 列缺失，准备添加...');
    try {
      await queryInterface.addColumn('score_rules', 'category', {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '其他'
      });
      added.push('category');
      console.log('✅ category 列已添加');
    } catch (err) {
      if (err?.original?.code !== 'ER_DUP_FIELDNAME' && err?.parent?.code !== 'ER_DUP_FIELDNAME') {
        console.warn('⚠️ 添加 category 列失败:', err.message, err?.original?.code || '');
      }
    }
  } else {
    console.log('📋 score_rules.category 列已存在');
  }

  // ---- sort_order 列 ----
  if (!table.sort_order) {
    console.log('📋 score_rules.sort_order 列缺失，准备添加...');
    try {
      await queryInterface.addColumn('score_rules', 'sort_order', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
      added.push('sort_order');
      console.log('✅ sort_order 列已添加');
    } catch (err) {
      if (err?.original?.code !== 'ER_DUP_FIELDNAME' && err?.parent?.code !== 'ER_DUP_FIELDNAME') {
        console.warn('⚠️ 添加 sort_order 列失败:', err.message, err?.original?.code || '');
      }
    }
  } else {
    console.log('📋 score_rules.sort_order 列已存在');
  }

  // ---- icon 列 ----
  if (!table.icon) {
    console.log('📋 score_rules.icon 列缺失，准备添加...');
    try {
      // 先用 DataTypes.STRING 添加（兼容所有 charset），后续再尝试转为 utf8mb4
      try {
        await queryInterface.addColumn('score_rules', 'icon', {
          type: DataTypes.STRING(50),
          allowNull: true,
          defaultValue: '⭐'
        });
        added.push('icon');
        console.log('✅ icon 列已添加（含默认值）');
      } catch (addErr) {
        // 如果带默认值的添加失败（如 charset 不支持 emoji），不加默认值重试
        if (addErr?.original?.code !== 'ER_DUP_FIELDNAME' && addErr?.parent?.code !== 'ER_DUP_FIELDNAME') {
          console.warn('⚠️ 带默认值添加 icon 列失败，尝试无默认值:', addErr.message);
          await queryInterface.addColumn('score_rules', 'icon', {
            type: DataTypes.STRING(50),
            allowNull: true
          });
          added.push('icon');
          console.log('✅ icon 列已添加（无默认值）');
        }
      }
    } catch (err) {
      console.warn('⚠️ 添加 icon 列失败:', err.message);
    }
  } else {
    console.log('📋 score_rules.icon 列已存在');
  }

  // ---- 检查并记录当前 icon 列 charset ----
  try {
    const [rows] = await sequelize.query(
      "SELECT COLUMN_NAME, COLLATION_NAME, CHARACTER_SET_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'score_rules' AND COLUMN_NAME = 'icon'"
    );
    const collation = rows[0]?.COLLATION_NAME || '';
    const charset = rows[0]?.CHARACTER_SET_NAME || '';
    console.log(`📋 icon 列 charset: ${charset}, collation: ${collation}`);

    // ---- 尝试将 icon 列转为 utf8mb4（尽力而为） ----
    if (collation && !collation.startsWith('utf8mb4')) {
      console.log('🔄 准备转换 icon 列为 utf8mb4...');
      await sequelize.query(
        "ALTER TABLE `score_rules` MODIFY COLUMN `icon` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL"
      );
      console.log('✅ 已转换 icon 列为 utf8mb4');
    }
  } catch (e) {
    console.warn('⚠️ icon 列 charset 检查/转换异常:', e.message);
  }

  return added.length > 0 ? added : false;
}

module.exports = {
  ensureScoreRuleCategoryColumn
};
