const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

async function addColumnIfMissing(queryInterface, table, columnName, columnDef) {
  if (table[columnName]) return false;
  try {
    await queryInterface.addColumn('score_rules', columnName, columnDef);
    return true;
  } catch (err) {
    if (err?.original?.code === 'ER_DUP_FIELDNAME' || err?.parent?.code === 'ER_DUP_FIELDNAME') {
      return false;
    }
    throw err;
  }
}

async function ensureScoreRuleCategoryColumn() {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable('score_rules');

  const added = [];

  if (await addColumnIfMissing(queryInterface, table, 'category', {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '其他'
  })) added.push('category');

  if (await addColumnIfMissing(queryInterface, table, 'sort_order', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  })) added.push('sort_order');

  if (await addColumnIfMissing(queryInterface, table, 'icon', {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: '⭐'
  })) added.push('icon');

  return added.length > 0 ? added : false;
}

module.exports = {
  ensureScoreRuleCategoryColumn
};
