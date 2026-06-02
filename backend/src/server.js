const app = require('./app');
const { sequelize, ScoreRule } = require('./models');
const { ensureScoreRuleCategoryColumn } = require('./utils/ensureScoreRuleCategoryColumn');

const PORT = process.env.PORT || 3000;

async function start() {
  // 先启动 HTTP 服务，确保健康检查可以响应
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });

  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    try {
      const categoryColumnAdded = await ensureScoreRuleCategoryColumn();
      if (categoryColumnAdded) {
        console.log('✅ 已补齐 score_rules 字段:', categoryColumnAdded.join(', '));
      }
    } catch (colErr) {
      console.error('⚠️ score_rules 字段补齐失败:', colErr.message);
    }

    // 生产环境也同步 score_rules 表（只同步这一个表，确保列结构完整）
    try {
      await ScoreRule.sync({ alter: true });
      console.log('✅ score_rules 表结构已同步');
    } catch (syncErr) {
      console.warn('⚠️ score_rules 表同步失败（skip）:', syncErr.message);
    }

    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('✅ 数据表同步完成');
    }
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
    // 不退出进程，让服务保持运行以便排查
  }
}

start();
