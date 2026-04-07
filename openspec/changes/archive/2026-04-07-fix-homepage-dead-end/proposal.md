## Why

The root board (`root.obf.json`) exposes four navigation entries — 住家, 家人, 醫療, 地點 — but the `medical` and `places` OBF boards do not exist. Clicking either entry dispatches `navigateTo('medical'|'places')`, which leaves `BoardRenderer` stuck on "載入中..." indefinitely because `selectBoardById` returns `undefined`. This blocks MVP acceptance criterion #1: "no dead-end navigation."

## What Changes

- Add `src/data/boards/medical.obf.json` — a 2×3 Grid board with 6 medical-need buttons (藥物, 看診, 打針, 痛, 不舒服, 廁所), each with a `vocalization` sentence
- Add `src/data/boards/places.obf.json` — a 2×3 Grid board with 6 common-place buttons (醫院, 超市, 公園, 餐廳, 銀行, 回家), each with a `vocalization` sentence
- Update `BoardRenderer.jsx`: change the `!board` fallback message from "載入中..." to "此板面正在建立中" to distinguish loading state from a genuinely missing board

## Non-Goals

- Does not add VSD-mode scenes for medical or places
- Does not add icons/images to the new buttons (symbol-only for now)
- Does not add medical or places boards to the NavigationBar quick-nav

## Capabilities

### New Capabilities

- `board-completeness`: All root-level navigation entries resolve to a valid, renderable board

### Modified Capabilities

(none)

## Impact

- Affected code:
  - `src/data/boards/medical.obf.json` (new)
  - `src/data/boards/places.obf.json` (new)
  - `src/features/board/BoardRenderer.jsx` (1-line message change)
