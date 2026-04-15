## Why

照護者目前無法移除已建立的按鈕或頁面，導致錯誤新增的內容只能累積無法清除，不符合實際照護場景的維護需求。

## What Changes

- `EditButtonModal` 新增「刪除」按鈕，採 inline 二步確認（第一次顯示確認提示，第二次才執行刪除），執行後關閉 modal
- `NavigationBar` 在編輯模式且非 root 頁面時新增「刪除頁面」按鈕，點擊開啟 `DeleteBoardModal`
- 新增 `DeleteBoardModal` 元件：顯示警告文字，確認後刪除頁面並導航回首頁
- `boardSlice` 新增 `deleteButton(boardId, buttonId)` reducer：從 `buttons` 陣列移除按鈕，並將 `grid.order` 中對應 ID 設為 `null`
- `boardSlice` 新增 `deleteBoard(boardId)` reducer：從 `byId` 與 `allIds` 移除板面
- 刪除頁面後自動 dispatch `goHome()` 清除 navigation history

## Non-Goals (optional)

- 不支援 undo/redo（刪除為即時且不可逆）
- 不支援批次刪除多個按鈕
- 不處理「按鈕連結至被刪頁面」的孤兒清理（load_board 指向不存在 board 的按鈕留給未來處理）
- root 板面不可刪除（NavigationBar 已有 `isRoot` 判斷）

## Capabilities

### New Capabilities

- `button-deletion`: 在編輯模式下從板面移除按鈕
- `board-deletion`: 在編輯模式下刪除非 root 頁面

### Modified Capabilities

- `button-editing`: EditButtonModal 新增刪除功能入口
- `board-persistence`: deleteBoard 後需同步更新 localStorage

## Impact

- Affected specs: `button-deletion` (new), `board-deletion` (new), `button-editing` (modified), `board-persistence` (modified)
- Affected code:
  - `src/features/board/boardSlice.js` — 新增 `deleteButton`、`deleteBoard` reducer 與對應 export
  - `src/features/caregiver/EditButtonModal.jsx` — 新增刪除按鈕與 inline 二步確認狀態
  - `src/features/caregiver/EditButtonModal.css`（或 `ModalShell.css`）— 刪除按鈕紅色樣式
  - `src/features/navigation/NavigationBar.jsx` — 非 root 編輯模式下新增「刪除頁面」按鈕
  - `src/features/caregiver/DeleteBoardModal.jsx`（新） — 刪除頁面確認 modal
  - `src/features/navigation/NavigationBar.css` — 刪除按鈕紅色樣式
  - `src/app/store.js` — 確認 boardSlice listeners 正確持久化（boardStorage middleware）
