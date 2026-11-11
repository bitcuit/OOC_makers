// 분류 원본을 편지 도구와 글씨체 정리 화면에 함께 반영한다.
// 쓰는 법: node tools/hand-sort-build.mjs  (OOC_makers 폴더에서)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
const here = dirname(fileURLToPath(import.meta.url));
const appPath = join(here, '../Pepero_Day/index.html');
let src = readFileSync(appPath, 'utf8');
// 한 줄에 쓰인 배열: `const 이름=[...];` 줄을 찾아 = 뒤부터 마지막 ; 앞까지
const pick = name => { const line = src.split(/\r?\n/).find(l => l.startsWith(`const ${name}=[`)); if (!line) throw Error(name + ' 없음'); return line.slice(line.indexOf('=') + 1, line.lastIndexOf(';')); };
const tpl = readFileSync(join(here, 'hand-sort.template.html'), 'utf8');
const hands = runInNewContext(pick('HANDS'));
const traits = JSON.parse(readFileSync(join(here, 'font-traits.json'), 'utf8'));
const families = new Set(hands.map(h => h[1]));
const tags = new Set(traits.axes.flatMap(a => a.tags.map(t => t.name)));
const groups = new Set(traits.groups.map(g => g.name));
const seen = new Set();
for (const h of traits.hands) {
  if (!families.has(h.family) || seen.has(h.family)) throw Error('글씨체 식별자 확인: ' + h.family);
  if (!groups.has(h.group) || !h.tags.length || h.tags.some(t => !tags.has(t)) || new Set(h.tags).size !== h.tags.length || !h.observation) throw Error('분류 확인: ' + h.family);
  seen.add(h.family);
}
if (seen.size !== families.size) throw Error('빠진 글씨체: ' + hands.filter(h => !seen.has(h[1])).map(h => h[0]).join(', '));
const byFamily = new Map(traits.hands.map(h => [h.family, h]));
for (const h of hands) { const v = byFamily.get(h[1]); h[5] = v.group; h[7] = v.tags.join(' '); }
const appTraits = { id: traits.id, revision: traits.revision, groups: traits.groups, axes: traits.axes };
if (!/^const HAND_TRAITS=.+;$/m.test(src)) throw Error('편지 도구의 글씨 분류 자리 없음');
const updated = src.replace(/^const HANDS=.+;$/m, () => 'const HANDS=' + JSON.stringify(hands) + ';')
  .replace(/^const HAND_TRAITS=.+;$/m, () => 'const HAND_TRAITS=' + JSON.stringify(appTraits).replace(/</g, '\\u003c') + ';')
  .replace(/^글씨 태그: .+$/m, () => '글씨 태그: ' + traits.axes.flatMap(a => a.tags.map(t => '#' + t.name)).join(' '));
if (updated !== src) writeFileSync(appPath, updated);
src = updated;
const out = tpl.replace('/*HANDS*/[]', () => JSON.stringify(hands.map(h => h.slice(0, 5)))).replace('/*RANGES*/[]', () => pick('RANGES')).replace('/*TRAITS*/{}', () => JSON.stringify(traits).replace(/</g, '\\u003c'));
writeFileSync(join(here, '글씨체정리.html'), out);
console.log('글씨체정리.html', out.length);
