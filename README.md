# Voco - 智慧數位溝通義肢

Voco 是一款為「高認知能力、具表達性失語症（Broca's Aphasia）」中風長者設計的 AAC（擴大替代溝通）Progressive Web App。它以寬扁型階層導航作為入口，依情境切換 `VSD`（Visual Scene Display）或成人化 `Grid`，協助使用者用低挫折方式表達需求。

## 核心能力

- `Fat Hierarchy`：首頁以住家、地點、家人、醫療等大分類降低詞彙搜尋成本。
- `VSD 場景`：以照片或格局圖作為背景，疊加可點擊熱點並朗讀對應語句。
- `Grid 板面`：以成人化大按鈕呈現家人、醫療、地點等分類詞彙。
- `語音輸出`：使用 Web Speech API，優先使用 `zh-TW`，並具備中文與瀏覽器預設 fallback。
- `輕量推薦`：根據本地點擊歷史與語意關聯產生 Grid 推薦詞彙。
- `照護者 VSD 編輯`：可在本地新增 VSD 頁面、上傳背景圖、建立與編輯矩形區域。

## 技術棧

- React + Vite
- Redux Toolkit
- Web Speech API
- PWA via `vite-plugin-pwa`
- Open Board Format（OBF）JSON + `ext_voco_` 擴充欄位
- `localStorage` 儲存 board metadata
- `IndexedDB` 儲存照護者上傳的 VSD 背景圖 blob
- Playwright E2E testing
- Node 內建 `node:test` unit testing

## 快速開始

```bash
npm install
npm run dev
```

常用指令：

```bash
npm run dev       # 啟動開發伺服器
npm run build     # 建立 production build 與 PWA service worker
npm run preview   # 預覽 production build
npm run lint      # 執行 ESLint
npm run verify:pwa        # 檢查 PWA manifest、資產與 build artifacts
npm run verify:lighthouse # 執行 Lighthouse a11y / best-practices 驗證
```

## 測試與驗證

```bash
npm run test:unit
npm run test:e2e
npm run test:e2e -- e2e/add-board.spec.js
npm run test:e2e -- e2e/grid-presentation.spec.js
npm run test:e2e -- e2e/user-mode.spec.js
npm run verify:pwa
npm run verify:lighthouse
```

目前測試涵蓋：

- `obfParser`、navigation reducer、prediction logic、speech helper 的 unit tests。
- 新增 board、reload 持久化、VSD 背景圖上傳的 Playwright flows。
- 成人化 Grid 顯示與推薦列 smoke test。
- User Mode 主分類切換、Grid 語音、VSD 熱點語音與導航歷史 Playwright flows。
- PWA manifest / service worker artifact 檢查與 Lighthouse accessibility / best-practices baseline。

## 專案結構

```text
src/
├── app/store.js                  # Redux store
├── data/boards/*.obf.json        # 內建 OBF board 資料
├── features/
│   ├── board/                    # BoardRenderer、GridView、VSDView、button/hotspot UI
│   ├── caregiver/                # 編輯模式、board/button/VSD 編輯 modal
│   ├── navigation/               # Fat Hierarchy 導航狀態與主導航列
│   ├── prediction/               # 點擊歷史與 Grid 推薦邏輯
│   └── speech/                   # Web Speech API hook 與 fallback helper
└── utils/
    ├── boardStorage.js           # localStorage / IndexedDB persistence helpers
    └── obfParser.js              # OBF parsing helpers

docs/
├── PRD.md                        # 產品需求與目前狀態
├── TODO.md                       # 分階段實作與追蹤清單
└── VERIFICATION.md               # 自動化與人工驗證流程

openspec/
├── specs/                        # 已歸檔或穩定的 Spectra specs
└── changes/                      # 進行中或待 archive 的 Spectra changes
```

## OBF 擴充欄位

Voco 的 board 資料以 OBF JSON 為核心，並使用 `ext_voco_` 前綴擴充：

- `ext_voco_display_type`: `grid` 或 `vsd`，決定板面渲染模式。
- `ext_voco_background`: VSD 背景圖設定，包含 `image_id`、`width`、`height`。
- `ext_voco_hotspot`: VSD 熱點位置，使用百分比座標 `x`、`y`、`width`、`height` 與 `shape`。
- `ext_voco_related_button_ids`: Grid 推薦用的語意關聯 button ids。
- `ext_voco_user_owned_vsd`: 標記內建 VSD 是否已被照護者本地資產覆蓋。

## 目前限制

- 首版沒有後端、帳號系統或雲端同步。
- 照護者上傳的 VSD 圖片只保存在目前裝置的 IndexedDB。
- AI Vision 熱點自動生成尚未實作，目前只保留資料與產品方向。
- VSD 區域第一版只支援矩形，不支援多邊形或自由形狀。
- PWA 已可 build 並產生 service worker，並具備 artifact 檢查、Lighthouse baseline 與人工離線/安裝驗證流程。

## 相關文件

- [docs/PRD.md](docs/PRD.md)：產品目標、使用者情境、功能需求與目前落差。
- [docs/TODO.md](docs/TODO.md)：分階段待辦與 checkbox 追蹤。
- [docs/VERIFICATION.md](docs/VERIFICATION.md)：自動化驗證命令與人工 PWA / a11y 檢查流程。
- [AGENTS.md](AGENTS.md)：協作規範、回覆格式、專案架構與開發注意事項。
