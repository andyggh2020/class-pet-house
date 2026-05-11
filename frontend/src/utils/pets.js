export const PETS = [
  // 🐕 普通动物
  { id: 'west-highland', name: '西高地' },
  { id: 'bichon', name: '比熊' },
  { id: 'border-collie', name: '边牧' },
  { id: 'shiba', name: '柴犬' },
  { id: 'golden-retriever', name: '金毛' },
  { id: 'samoyed', name: '萨摩耶' },
  { id: 'husky', name: '哈士奇' },
  { id: 'tabby-cat', name: '虎斑猫' },
  { id: 'persian-cat', name: '波斯猫' },
  { id: 'ragdoll-cat', name: '布偶猫' },
  { id: 'orange-cat', name: '橘猫' },
  { id: 'lop-rabbit', name: '垂耳兔' },
  { id: 'angora-rabbit', name: '安哥拉兔' },
  { id: 'hamster', name: '仓鼠' },
  { id: 'winter-hamster', name: '银狐仓鼠' },
  { id: 'call-duck', name: '柯尔鸭' },
  { id: 'alpaca', name: '羊驼' },
  { id: 'red-panda', name: '小熊猫' },
  { id: 'corgi', name: '柯基' },
  // ✨ 神兽
  { id: 'white-tiger', name: '白虎' },
  { id: 'unicorn', name: '独角兽' },
  { id: 'azure-dragon', name: '青龙' },
  { id: 'vermilion-bird', name: '朱雀' },
  { id: 'succulent-spirit', name: '多肉精灵' },
  { id: 'pixiu', name: '貔貅' },
  { id: 'suanni', name: '狻猊' }
]

export const getPetImageUrl = (petId, stage) => {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || '/pet-images'
  const pet = PETS.find(p => p.id === petId)
  if (!pet) return ''
  const maxLv = 8
  const lvMap = [1, 2, 3, 4, 5, 5, 6, 7, 8, 8]
  const lv = stage <= maxLv ? stage : lvMap[stage - 1] || maxLv
  return `${baseUrl}/${pet.id}/lv${lv}.png?v=3`
}
