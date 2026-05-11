const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.sollus.cn/pet-garden/pets';
const OUTPUT_DIR = path.resolve(__dirname, '../assets/pets');

const PETS = [
  'west-highland', 'bichon', 'border-collie', 'shiba', 'golden-retriever',
  'samoyed', 'husky', 'tabby-cat', 'persian-cat', 'ragdoll-cat',
  'orange-cat', 'lop-rabbit', 'angora-rabbit', 'hamster', 'winter-hamster',
  'call-duck', 'alpaca', 'red-panda', 'corgi',
  'white-tiger', 'unicorn', 'azure-dragon', 'vermilion-bird',
  'succulent-spirit', 'pixiu', 'suanni'
];

const STAGES = 8;
const CONCURRENCY = 5;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { file.close(); reject(e); });
  });
}

async function run() {
  let ok = 0, fail = 0;
  const tasks = [];

  for (const pet of PETS) {
    const dir = path.join(OUTPUT_DIR, pet);
    fs.mkdirSync(dir, { recursive: true });

    for (let lv = 1; lv <= STAGES; lv++) {
      const url = `${BASE_URL}/${pet}/lv${lv}.png`;
      const dest = path.join(dir, `lv${lv}.png`);
      if (fs.existsSync(dest)) { ok++; continue; }
      tasks.push({ pet, lv, url, dest });
    }
  }

  console.log(`📦 需下载 ${tasks.length} 张图片`);

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const chunk = tasks.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(chunk.map(t =>
      download(t.url, t.dest).then(() => { ok++; console.log(`✅ ${t.pet}/lv${t.lv}`); })
    ));
    for (const r of results) {
      if (r.status === 'rejected') { fail++; console.error(`❌ ${r.reason.message}`); }
    }
  }

  console.log(`\n完成: ${ok} 成功, ${fail} 失败`);
}

run().catch(e => { console.error(e); process.exit(1); });
