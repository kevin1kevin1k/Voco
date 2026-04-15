## Why

刪除按鈕後，`grid.order` 中該格變為 `null`，Grid 畫面出現空白格，破壞視覺連貫性。刪除頁面（board）時，父板面中指向該頁的導航按鈕未被移除，同樣遺留孤兒按鈕與空格。

## What Changes

- `deleteButton` reducer 在移除按鈕後，對 `grid.order` 執行 compaction：攤平 → 過濾 null → 依原 rows × columns 從左上填回，尾端補 null
- `DeleteBoardModal` 在 dispatch `deleteBoard` 前，掃描所有板面找出 `load_board.id === board.id` 的導航按鈕並 dispatch `deleteButton`，compaction 由 reducer 自動完成

## Non-Goals

- 不自動縮減 `grid.rows` / `grid.columns` 維度（避免 CSS grid 抖動）
- 不處理 VSD（Visual Scene Display）板面，VSD 使用熱點定位，不受 grid.order 影響

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `button-deletion`: `deleteButton` reducer 新增 compaction 步驟，刪除後 grid 無空格
- `board-deletion`: `DeleteBoardModal` 在刪除板面前先移除父板面中的導航按鈕

## Impact

- Affected specs: `button-deletion`, `board-deletion`
- Affected code:
  - `src/features/board/boardSlice.js` — `deleteButton` reducer 加 compaction
  - `src/features/caregiver/DeleteBoardModal.jsx` — confirm 前先 dispatch `deleteButton`
