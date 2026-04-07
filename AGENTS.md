<!-- SPECTRA:START v1.0.1 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `$spectra-*` skills when:

- A discussion needs structure before coding → `$spectra-discuss`
- User wants to plan, propose, or design a change → `$spectra-propose`
- Tasks are ready to implement → `$spectra-apply`
- There's an in-progress change to continue → `$spectra-ingest`
- User asks about specs or how something works → `$spectra-ask`
- Implementation is done → `$spectra-archive`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `$spectra-apply` and `$spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

## Response Format & Language
- For every implementation report response, always use Traditional Chinese.
- For `/review` slash command responses, always use Traditional Chinese (technical terms may remain in English).
- For every implementation report response (but not commit-only replies such as `建立 commit` after an already-reported batch), always include these sections in order:
  1. `實作結果摘要` (clear summary + impacted area)
  2. `修改檔案` (reviewer scan order: docs/config -> backend -> frontend -> tests/helpers; include one-line summary per file; always use ordered numbering `1. 2. 3.` instead of bullet points; every file label must be the full repository-relative path such as `frontend/e2e/auth.spec.ts`)
  3. `測試方式與結果` (fully executable commands with concrete values, plus key outputs)
  4. `人工驗證步驟` (only for behavior not fully covered by automation; include expected result per step)

## Commit & Pull Request Guidelines
Use Conventional Commits:
- `feat: add token validation`
- `fix: handle empty config path`
- `docs: add onboarding notes`

Commit truthfulness rule:
- When the user asks to `建立 commit`, do not claim success unless `git commit` has actually been executed successfully.
- Before replying that a commit was created, always verify with `git log --oneline -1` and report the real latest commit hash/message from the repository state.
- If the expected changes are still present in `git status --short`, do not claim the commit is complete.
- Root cause note: a previous false report claimed a commit hash that did not exist because the reply was sent before verifying actual repo state. This must not happen again.

## Project Overview
Voco 是一款為「高認知能力、表達性失語症 (Broca's Aphasia)」中風長者設計的 AAC (擴大替代溝通) Progressive Web App。採用混合式介面：首頁為寬扁型階層導航，子板面動態切換 VSD (Visual Scene Display) 或 Grid 模式。

## Tech Stack
- React (Vite 8)
- Redux Toolkit (RTK) for state management
- Web Speech API (`window.speechSynthesis`, zh-TW)
- PWA via `vite-plugin-pwa`
- Data format: Open Board Format (OBF) JSON, 擴充欄位以 `ext_voco_` 前綴命名

## Commands
```bash
npm run dev      # 啟動開發伺服器
npm run build    # Production build
npm run preview  # 預覽 production build
```

## Architecture
```text
src/
├── app/store.js                  # Redux store (navigation, boards, speech, prediction, caregiver)
├── features/
│   ├── navigation/               # 階層式導航 (currentBoardId, history stack)
│   ├── board/                    # BoardRenderer 動態切換 VSD/Grid
│   │   ├── BoardRenderer.jsx     # 根據 ext_voco_display_type 渲染對應視圖
│   │   ├── GridView.jsx          # 傳統按鈕網格 + 推薦詞彙
│   │   └── VSDView.jsx           # 實景照片 + 熱點疊加
│   ├── speech/useSpeech.js       # Web Speech API hook (zh-TW 語音過濾)
│   ├── prediction/               # 基於點擊歷史的輕量級推薦
│   └── caregiver/                # 照護者後台 (編輯模式、使用追蹤)
├── data/boards/*.obf.json        # OBF 板面資料
└── utils/obfParser.js            # OBF 解析、熱點座標轉換、板面載入
```

## OBF Data Model
板面資料遵循 OBF 標準並以 `ext_voco_` 擴充：
- `ext_voco_display_type`: `"grid"` | `"vsd"` — 決定渲染模式
- `ext_voco_background`: VSD 背景圖設定 (`image_id`, `width`, `height`)
- `ext_voco_hotspot`: 按鈕上的熱點定位 (`x`, `y`, `width`, `height` 皆為百分比, `shape`)

板面透過 `import.meta.glob` 從 `src/data/boards/` 動態載入。

## Key Patterns
- 導航使用 history stack (`navigateTo` push, `goBack` pop, `goHome` reset)
- VSD 熱點座標以百分比定義，支援響應式縮放
- 推薦機制根據 `predictionSlice.clickHistory` 計算低頻按鈕推薦
- 語音輸出優先選擇 `zh-TW` voice，使用按鈕的 `vocalization` 欄位
