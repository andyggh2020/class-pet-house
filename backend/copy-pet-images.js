const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OLD_BASE = path.resolve(__dirname, '../../class-pet-garden-master/public/pets');
const NEW_BASE = path.resolve(__dirname, '../assets/pets');

// 旧项目英文名 → 新项目中文名文件夹
const MAPPING = {
  'bichon': '比熊十阶段图片',
  'border-collie': '边牧十阶段图片',
  'ragdoll-cat': '布偶十阶段图片',
  'shiba': '柴犬十阶段图片',
  'orange-cat': '橘猫十阶段图片',
  'corgi': '柯基十阶段图片',
  'golden-retriever': '金毛十阶段图片',
  'samoyed': '萨摩耶十阶段图片',
  'husky': '哈士奇十阶段图片',
  'hamster': '仓鼠十阶段图片',
  'tabby-cat': '虎斑十阶段图片',
  'west-highland': '西高地十阶段图片',
  'lop-rabbit': '小兔子十阶段图片',
  'red-panda': '小熊猫十阶段图片',
  'call-duck': '鸭子十阶段图片',
  'alpaca': '小羊羔十阶段图片',
  'persian-cat': '加菲猫十阶段图片',
  'unicorn': '独角兽十阶段图片',
  'white-tiger': '老虎十阶段图片',
  'angora-rabbit': '小兔子十阶段图片',
};

async function convert() {
  let count = 0;
  for (const [oldFolder, newFolder] of Object.entries(MAPPING)) {
    const oldDir = path.join(OLD_BASE, oldFolder);
    if (!fs.existsSync(oldDir)) {
      console.log(`⚠️ 跳过不存在的: ${oldFolder}`);
      continue;
    }

    const newDir = path.join(NEW_BASE, newFolder);
    fs.mkdirSync(newDir, { recursive: true });

    // 旧项目 lv1-lv8 → 新项目 1-10
    // lv1→1, lv2→2, ... lv8→8, 然后 lv8 复制为 9 和 10
    for (let oldStage = 1; oldStage <= 8; oldStage++) {
      const src = path.join(oldDir, `lv${oldStage}.png`);
      if (!fs.existsSync(src)) continue;

      for (const newStage of getNewStages(oldStage)) {
        const dest = path.join(newDir, `${newStage}.webp`);
        if (fs.existsSync(dest)) continue;
        await sharp(src).webp({ quality: 85 }).toFile(dest);
        count++;
      }
    }
    console.log(`✅ ${oldFolder} → ${newFolder}`);
  }
  console.log(`\n共转换 ${count} 张图片`);
}

function getNewStages(oldStage) {
  // 8阶段映射到10阶段: 1→1, 2→2, 3→3, 4→4, 5→5, 6→7, 7→8, 8→9,10
  const map = { 1: [1], 2: [2], 3: [3], 4: [4], 5: [5, 6], 6: [7], 7: [8], 8: [9, 10] };
  return map[oldStage] || [oldStage];
}

convert().catch(err => { console.error(err); process.exit(1); });
