const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PETS } = require('../frontend/src/utils/pets');

const STAGES = 10;
const SIZE = 256;
const OUTPUT_DIR = path.resolve(__dirname, '../assets/pets');

const COLORS = [
  [255, 182, 193], [255, 218, 185], [255, 255, 224], [144, 238, 144],
  [173, 216, 230], [221, 160, 221], [255, 192, 203], [176, 224, 230],
  [255, 228, 196], [152, 251, 152], [135, 206, 250], [238, 130, 238],
];

async function generatePlaceholder(pet, stage) {
  const colorIdx = pet.id.charCodeAt(0) % COLORS.length;
  const [r, g, b] = COLORS[colorIdx];
  const alpha = Math.round(180 + (stage / STAGES) * 75);

  const svg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${SIZE}" height="${SIZE}" fill="rgb(${r},${g},${b})" rx="32"/>
    <text x="50%" y="40%" font-size="48" text-anchor="middle" dominant-baseline="middle">${pet.name}</text>
    <text x="50%" y="65%" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#666">阶段 ${stage}</text>
  </svg>`;

  return sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer();
}

async function main() {
  let count = 0;
  for (const pet of PETS) {
    const dir = path.join(OUTPUT_DIR, pet.folder);
    fs.mkdirSync(dir, { recursive: true });

    for (let stage = 1; stage <= STAGES; stage++) {
      const filePath = path.join(dir, `${stage}.webp`);
      if (!fs.existsSync(filePath)) {
        const buf = await generatePlaceholder(pet, stage);
        fs.writeFileSync(filePath, buf);
        count++;
      }
    }
  }
  console.log(`✅ 生成 ${count} 张占位图到 ${OUTPUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
