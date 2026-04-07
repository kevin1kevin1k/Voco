## 1. Add Missing OBF Board Files

- [x] 1.1 Create `src/data/boards/medical.obf.json` — Grid board (`ext_voco_display_type: "grid"`, 2×3) ensuring all root navigation entries resolve to a valid board; include 6 buttons: 藥物 (`vocalization`: "我需要吃藥"), 看診 ("我要看醫生"), 打針 ("我要打針"), 痛 ("這裡很痛"), 不舒服 ("我不舒服"), 廁所 ("我要去廁所"); `background_color` for all buttons: `rgb(255, 205, 210)`
- [x] 1.2 Create `src/data/boards/places.obf.json` — Grid board (`ext_voco_display_type: "grid"`, 2×3) ensuring all root navigation entries resolve to a valid board; include 6 buttons: 醫院 (`vocalization`: "我要去醫院"), 超市 ("我要去超市"), 公園 ("我要去公園"), 餐廳 ("我要去餐廳"), 銀行 ("我要去銀行"), 回家 ("我要回家"); `background_color` for all buttons: `rgb(200, 230, 201)`

## 2. Fix BoardRenderer Fallback Message

- [x] 2.1 In `src/features/board/BoardRenderer.jsx`, change the `!board` fallback from `"載入中..."` to `"此板面正在建立中"` so that missing board shows an informative fallback message distinguishable from an in-progress data fetch
