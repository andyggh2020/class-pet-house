const router = require('express').Router();
const { ScoreRule, Class } = require('../models');
const auth = require('../middleware/auth');
const { requireActivated } = require('../middleware/auth');
const { normalizeScoreRuleCategory, syncDefaultScoreRules } = require('../constants/defaultScoreRules');
const { ensureScoreRuleCategoryColumn } = require('../utils/ensureScoreRuleCategoryColumn');

const MAX_RULES_PER_CLASS = 200;

// 获取班级积分规则
router.get('/class/:classId', auth, requireActivated, async (req, res) => {
  try {
    const cls = await Class.findOne({
      where: { id: req.params.classId, user_id: req.userId }
    });
    if (!cls) return res.status(404).json({ error: '班级不存在' });

    const rules = await ScoreRule.findAll({
      where: { class_id: cls.id },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 补齐默认积分规则
router.post('/class/:classId/sync-defaults', auth, requireActivated, async (req, res) => {
  try {
    const cls = await Class.findOne({ where: { id: req.params.classId, user_id: req.userId } });
    if (!cls) return res.status(404).json({ error: '班级不存在' });

    // 先确保缺失的列已补齐（如 icon、sort_order），以防生产环境启动时未成功
    try {
      await ensureScoreRuleCategoryColumn();
    } catch (colErr) {
      console.warn('补齐 score_rules 字段失败，继续尝试同步默认规则:', colErr.message);
    }

    const result = await syncDefaultScoreRules(cls.id);
    const rules = await ScoreRule.findAll({
      where: { class_id: cls.id },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    res.json({ ...result, rules });
  } catch (err) {
    console.error('补齐默认积分规则失败:', err);
    res.status(500).json({ error: '补齐失败' });
  }
});

// 添加积分规则
router.post('/', auth, requireActivated, async (req, res) => {
  try {
    const { class_id, name, icon, value, category } = req.body;
    const cls = await Class.findOne({ where: { id: class_id, user_id: req.userId } });
    if (!cls) return res.status(404).json({ error: '班级不存在' });
    if (!name || value === undefined || value === 0) {
      return res.status(400).json({ error: '名称和分值不能为空，分值不能为0' });
    }

    const count = await ScoreRule.count({ where: { class_id } });
    if (count >= MAX_RULES_PER_CLASS) return res.status(400).json({ error: `最多创建${MAX_RULES_PER_CLASS}条规则` });
    const rule = await ScoreRule.create({
      class_id,
      category: normalizeScoreRuleCategory(category),
      name: name.trim(),
      icon: icon || '⭐',
      value,
      sort_order: count
    });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: '添加失败' });
  }
});

// 更新积分规则
router.put('/:id', auth, requireActivated, async (req, res) => {
  try {
    const rule = await ScoreRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: '规则不存在' });

    const cls = await Class.findOne({ where: { id: rule.class_id, user_id: req.userId } });
    if (!cls) return res.status(403).json({ error: '无权限' });

    const { name, icon, value, sort_order, category } = req.body;
    if (name !== undefined && (!name || typeof name !== 'string' || !name.trim())) {
      return res.status(400).json({ error: '规则名称不能为空' });
    }
    await rule.update({
      ...(name !== undefined && { name: name.trim() }),
      ...(icon !== undefined && { icon }),
      ...(value !== undefined && { value }),
      ...(sort_order !== undefined && { sort_order }),
      ...(category !== undefined && { category: normalizeScoreRuleCategory(category) })
    });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除积分规则
router.delete('/:id', auth, requireActivated, async (req, res) => {
  try {
    const rule = await ScoreRule.findByPk(req.params.id);
    if (!rule) return res.status(404).json({ error: '规则不存在' });

    const cls = await Class.findOne({ where: { id: rule.class_id, user_id: req.userId } });
    if (!cls) return res.status(403).json({ error: '无权限' });

    await rule.destroy();
    res.json({ message: '删除成功' });
  } catch (err) {
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
