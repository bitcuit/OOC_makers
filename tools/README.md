# tools

| 도구 | 하는 일 | 마지막 쓴 날 |
|---|---|---|
| [fearless-assets.mjs](fearless-assets.mjs) | FEARLESS FILE 그림(`img/` · `img/desk/`)을 data URL 로 담은 `assets.js` · `desk-assets.js` 를 만든다. 파일로 바로 연 페이지에서도 PNG 저장이 되게. 그림을 바꾸면 `node tools/fearless-assets.mjs` | 2026-10-28 |
| [hand-sort-build.mjs](hand-sort-build.mjs) | `font-traits.json`의 165종 분류·6묶음·16태그를 PEPERO DAY의 글꼴 목록·OOC 태그 목록과 `글씨체정리.html`에 함께 반영한다. `node tools/hand-sort-build.mjs` | 2026-11-10 |

분류 원본은 [font-traits.json](font-traits.json)이다. 같은 문장·크기로 실제 글꼴을 띄워 보고 6개 묶음·16개 태그를 매겼으며, 글꼴마다 판단 근거를 담았다. 묶음은 가장 두드러진 형태 하나, 태그는 함께 보이는 특징이다. 인상은 글씨 모양에 관한 말만 쓴다. 다정함·자유로움처럼 글쓴이의 성격을 연상시키는 말은 붙이지 않는다.

화면에서 고친 값은 브라우저에 저장한다. 이전 기준으로 직접 고친 값이 있으면 새 분류와 따로 보관하며 `이전 수정 저장`으로 받을 수 있다. `JSON 저장`에는 현재 분류 전체를 담고, 직접 고친 항목의 원본 판단 근거는 `baselineObservation`에 남긴다. 화면에서 고친 분류는 JSON을 분류 원본에 반영한 뒤 재생성해야 PEPERO DAY 추천에도 적용된다. 다른 도구는 별도로 반영한다.
