const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function ensureScoreRuleCategoryColumn() {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable('score_rules');

  if (table.category) {
    return false;
  }

  try {
    await queryInterface.addColumn('score_rules', 'category', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '其他'
    });
  } catch (err) {
    if (err?.original?.code === 'ER_DUP_FIELDNAME' || err?.parent?.code === 'ER_DUP_FIELDNAME') {
      return false;
    }
    throw err;
  }

  return true;
}

module.exports = {
  ensureScoreRuleCategoryColumn
};
