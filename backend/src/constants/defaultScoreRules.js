const { ScoreRule } = require('../models');

const SCORE_RULE_CATEGORIES = ['学习', '行为', '健康', '其他'];

// icon 置空，前端 ScoreRuleModal.vue 第 77 行已有 fallback（加分→🌟 扣分→⚠️）
// 避免生产环境 MySQL charset 不支持 utf8mb4 导致 emoji 插入失败
const CATEGORY_ICONS = {
  学习: '',
  行为: '',
  健康: '',
  其他: ''
};

const rulesByCategory = {
  学习: [
    [3, '平时测验满分'],
    [3, '作业完成优秀'],
    [2, '平时测验达优秀'],
    [2, '单元测验显著进步'],
    [2, '课堂积极发言'],
    [1, '作业完成优秀'],
    [1, '默写全对'],
    [1, '订正态度认真'],
    [1, '优秀作业,值得表扬'],
    [1, '近期学习状态进步'],
    [1, '被老师点名表扬'],
    [-1, '不交作业'],
    [-1, '作业潦草'],
    [-2, '未完成作业'],
    [-2, '订正不认真'],
    [-2, '学习显著退步'],
    [-5, '抄袭作业'],
    [-5, '考试作弊']
  ],
  行为: [
    [5, '拾金不昧(贵重物品)'],
    [3, '主动帮助生病同学'],
    [3, '主动调解同学矛盾、化解冲突'],
    [3, '做好人好事被学校提出表扬'],
    [3, '积极参与校内外志愿服务'],
    [2, '守纪表现优秀(被表扬)'],
    [2, '主动帮助同学'],
    [2, '拾金不昧(一般物品)'],
    [2, '帮助同学'],
    [1, '早读认真专注'],
    [1, '课前准备充分'],
    [1, '眼保健操全程认真'],
    [1, '升旗仪式安静整齐'],
    [1, '犯错主动认错,积极协商'],
    [1, '遵守纪律'],
    [-1, '无故迟到或早退'],
    [-1, '未佩戴红领巾,不穿校服'],
    [-1, '上课讲话、开小差'],
    [-1, '中午自习说话、随意走动'],
    [-1, '排队时说话或小动作不停,被点名'],
    [-1, '迟到'],
    [-2, '撒谎、隐瞒真实情况'],
    [-2, '说脏话,骂人,起绰号'],
    [-3, '私自旷课或课间操'],
    [-3, '扰乱课堂'],
    [-3, '课间追逐打闹'],
    [-3, '追逐打闹(酿成事故)'],
    [-3, '私自带玩具或零食或危险物品'],
    [-3, '挑拨离间、拉帮结派'],
    [-3, '不尊重同学、孤立他人'],
    [-3, '为私欲包庇犯错者'],
    [-3, '恶意举报、诬陷他人'],
    [-3, '课堂捣乱'],
    [-5, '传播脏话或不良歌谣'],
    [-5, '破坏校园设施'],
    [-10, '欺负、推搡、伤害同学']
  ],
  健康: [
    [2, '主动倒垃圾并套垃圾袋'],
    [2, '主动打扫卫生'],
    [2, '坚持运动'],
    [1, '认真完成包干区值日'],
    [1, '主动为班级擦黑板'],
    [1, '主动整理讲台'],
    [1, '主动整理黑板粉笔槽'],
    [1, '座位整洁无涂画,桌椅干净'],
    [1, '座位周围无垃圾'],
    [-1, '个人座位卫生不合格'],
    [-1, '校园内乱扔垃圾'],
    [-1, '桌洞脏乱、物品杂乱'],
    [-1, '不讲卫生'],
    [-2, '打扫包干区时间玩耍,不认真'],
    [-2, '破坏卫生、乱涂乱画'],
    [-2, '浪费粮食'],
    [-3, '破坏班级绿植、把玩绿植']
  ],
  其他: [
    [8, '区级及以上:一等奖'],
    [6, '区级及以上:二等奖'],
    [5, '校级比赛:一等奖'],
    [5, '为班级争得荣誉'],
    [4, '校级比赛:二等奖'],
    [4, '区级及以上:三等奖'],
    [3, '代表班级参赛'],
    [3, '校级比赛:三等奖'],
    [2, '主动整理图书、摆放整齐'],
    [2, '主动帮同学更换桌椅'],
    [2, '主动承担班级任务'],
    [2, '积极参加班级墙面布置'],
    [2, '活动中表现优秀'],
    [2, '联欢会或文艺汇演积极参与'],
    [2, '小组全周无违纪、全员交作业'],
    [1, '积极参加班级或学校活动'],
    [-1, '损坏公物、乱刻乱画'],
    [-1, '浪费水电、屡教不改'],
    [-2, '故意损坏卫生工具'],
    [-3, '故意玩弄损坏公共电器'],
    [-8, '扣分严重/打架/作弊/严重违纪']
  ]
};

const DEFAULT_SCORE_RULES = SCORE_RULE_CATEGORIES.flatMap(category =>
  rulesByCategory[category].map(([value, name], index) => ({
    category,
    name,
    icon: CATEGORY_ICONS[category],
    value,
    sort_order: SCORE_RULE_CATEGORIES.indexOf(category) * 100 + index
  }))
);

function normalizeScoreRuleCategory(category) {
  return SCORE_RULE_CATEGORIES.includes(category) ? category : '其他';
}

// icon 已改为空字符串，不存在 emoji charset 问题；保留 try/catch 兜底
async function _bulkCreateWithFallback(classId, rules, options = {}) {
  try {
    return await ScoreRule.bulkCreate(
      rules.map(rule => ({ class_id: classId, ...rule })),
      options
    );
  } catch (err) {
    const errCode = err?.original?.code || err?.parent?.code || '';
    const errMsg = err?.original?.message || err?.parent?.message || err?.message || '';
    console.error('❌ bulkCreate 失败, code:', errCode, 'message:', errMsg);
    throw err;
  }
}

async function createDefaultScoreRules(classId, options = {}) {
  return _bulkCreateWithFallback(classId, DEFAULT_SCORE_RULES, options);
}

async function syncDefaultScoreRules(classId, options = {}) {
  const existingRules = await ScoreRule.findAll({
    where: { class_id: classId },
    attributes: ['name', 'value'],
    transaction: options.transaction
  });
  const existingKeys = new Set(existingRules.map(rule => `${rule.name}::${rule.value}`));
  const missingRules = DEFAULT_SCORE_RULES.filter(rule => !existingKeys.has(`${rule.name}::${rule.value}`));
  if (!missingRules.length) return { created: 0, total: existingRules.length };

  await _bulkCreateWithFallback(classId, missingRules, options);
  return { created: missingRules.length, total: existingRules.length + missingRules.length };
}

module.exports = {
  SCORE_RULE_CATEGORIES,
  DEFAULT_SCORE_RULES,
  normalizeScoreRuleCategory,
  createDefaultScoreRules,
  syncDefaultScoreRules
};
