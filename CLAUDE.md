# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

```
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
