const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  // 先启动 HTTP 服务，确保健康检查可以响应
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  });

  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

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
