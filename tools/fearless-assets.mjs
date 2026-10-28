// FEARLESS FILE: PNG 저장에 쓰는 그림을 data URL 로 담은 스크립트를 만든다.
// 파일로 바로 연 페이지(file://)에서는 브라우저가 옆 폴더 그림을 읽어 PNG 에 넣지 못해서,
// 저장할 때만 이 스크립트(<script src> 는 file:// 에서도 읽힌다)의 데이터를 쓴다.
// 그림(img/ · img/desk/)을 바꾸면 다시 돌린다:  node tools/fearless-assets.mjs
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '../Fearless_contract');
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const pack = (sub, out, varName) => {
  const map = {};
  for (const f of fs.readdirSync(path.join(dir, sub)).sort()) {
    const m = mime[path.extname(f).toLowerCase()];
    if (!m) continue;
    map[`${sub}/${f}`] = `data:${m};base64,` + fs.readFileSync(path.join(dir, sub, f)).toString('base64');
  }
  fs.writeFileSync(path.join(dir, out), `// 자동 생성: node tools/fearless-assets.mjs (손으로 고치지 않는다)\nwindow.${varName}=Object.assign(window.${varName}||{},${JSON.stringify(map)});\n`);
  console.log(out, Object.keys(map).length, '개', Math.round(fs.statSync(path.join(dir, out)).size / 1024), 'KB');
};
pack('img', 'assets.js', 'FEARLESS_ASSETS');
pack('img/desk', 'desk-assets.js', 'FEARLESS_ASSETS');
