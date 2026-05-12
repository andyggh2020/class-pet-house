export const SCORE_RULE_CATEGORIES = [
  { id: '学习', icon: '📚', label: '学习' },
  { id: '行为', icon: '🎯', label: '行为' },
  { id: '健康', icon: '💪', label: '健康' },
  { id: '其他', icon: '📌', label: '其他' }
]

export function normalizeScoreRuleCategory(category) {
  return SCORE_RULE_CATEGORIES.some(c => c.id === category) ? category : '其他'
}

export function groupScoreRulesByCategory(rules) {
  return SCORE_RULE_CATEGORIES.map(category => ({
    ...category,
    rules: (rules || []).filter(rule => normalizeScoreRuleCategory(rule.category) === category.id)
  })).filter(group => group.rules.length)
}
