## 1. Persistence Layer

- [x] 1.1 Create `src/utils/boardStorage.js` with `saveBoardsToStorage(boards)` that serializes `{ byId, allIds }` to localStorage key `voco_boards` (localStorage 資料格式)
- [x] 1.2 Create `readBoardsFromStorage()` in `boardStorage.js` that reads and parses `voco_boards`; returns null on missing key or invalid JSON (no error thrown) (board-persistence: Merge localStorage boards on app startup)
- [x] 1.3 Update `loadAllBoards()` in `src/utils/obfParser.js` to call `readBoardsFromStorage()` after loading static boards and merge: localStorage boards override same-ID static boards, new IDs are appended (localStorage 合併策略, user-created boards resolve from navigation)
- [x] 1.4 Add a `store.subscribe` listener in `src/app/store.js` that calls `saveBoardsToStorage` with only the user-modified boards whenever `addBoard` or `updateBoard` is dispatched (持久化時機, board-persistence: Persist user-edited boards to localStorage)

## 2. Edit Mode UI in NavigationBar

- [x] 2.1 Import `selectIsEditMode` and `toggleEditMode` from `caregiverSlice` in `NavigationBar.jsx`; add "編輯"/"完成" button to NavBar right side that dispatches `toggleEditMode` (編輯模式入口位置, edit mode toggle in NavigationBar)
- [x] 2.2 Add "＋ 新增頁面" button in NavBar that appears only when `isEditMode` is true; clicking it opens `AddBoardModal` (add board modal opens from NavigationBar)
- [x] 2.3 Add ✎ icon next to the board title in NavBar when `isEditMode` is true; clicking it opens `EditBoardNameModal` pre-filled with current board name (board name edit button in NavigationBar)
- [x] 2.4 Update `NavigationBar.css` with styles for the edit/complete button, "＋ 新增頁面" button, and title ✎ icon

## 3. Shared Modal Shell

- [x] 3.1 Create `src/features/caregiver/ModalShell.jsx` rendering a full-screen overlay with a centered card, title prop, children slot, "確認" button (disabled when `confirmDisabled` prop is true), and "取消" button (modal 設計)
- [x] 3.2 Create `src/features/caregiver/ModalShell.css` with overlay (fixed, full viewport, semi-transparent background), card (centered, white, rounded, padded), and button styles

## 4. EditButtonModal

- [x] 4.1 Create `src/features/caregiver/EditButtonModal.jsx` accepting `button`, `onConfirm(label, vocalization)`, `onClose` props; render `ModalShell` with label input (pre-filled with `button.label`) and vocalization input (pre-filled with `button.vocalization || button.label`); "確認" disabled when label is empty (edit button modal opens on ✎ click, empty label is rejected)
- [x] 4.2 Wire `onConfirm` to dispatch `updateBoard` with the button's `label` and `vocalization` updated; close modal after dispatch (confirm button edit saves changes)

## 5. AddButtonModal

- [x] 5.1 Create `src/features/caregiver/AddButtonModal.jsx` accepting `onConfirm(label, vocalization)`, `onClose` props; render `ModalShell` with empty label and vocalization inputs; "確認" disabled when label is empty (add button modal opens from Grid add cell, empty label is rejected in AddButtonModal)
- [x] 5.2 Wire `onConfirm` to generate button ID as `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, create button object with `background_color: "rgb(240, 240, 240)"`, append to `board.buttons`, append ID to last grid row (or new row if full), dispatch `updateBoard`; close modal (confirm button creation adds button to board, 新按鈕的 ID 生成)

## 6. AddBoardModal

- [x] 6.1 Create `src/features/caregiver/AddBoardModal.jsx` accepting `onConfirm(name)`, `onClose` props; render `ModalShell` with empty name input; "確認" disabled when name is empty (add board modal opens from NavigationBar, empty name is rejected in AddBoardModal)
- [x] 6.2 Wire `onConfirm` to generate board ID as `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, create board object with 2×3 empty grid (新板面的 Grid 預設), dispatch `addBoard`, dispatch `navigateTo(newBoardId)`; close modal (confirm board creation creates and navigates to new board)

## 7. EditBoardNameModal

- [x] 7.1 Create `src/features/caregiver/EditBoardNameModal.jsx` accepting `board`, `onConfirm(name)`, `onClose` props; render `ModalShell` with name input pre-filled with `board.name`; "確認" disabled when name is empty (board name edit button in NavigationBar, empty name is rejected in EditBoardNameModal)
- [x] 7.2 Wire `onConfirm` to dispatch `updateBoard` with `board.name` updated to new value; close modal (confirm board name edit updates board)

## 8. GridView Edit Mode Integration

- [x] 8.1 In `GridView.jsx`, import `selectIsEditMode` from `caregiverSlice`; when `isEditMode` is true, render ✎ overlay on each button cell and open `EditButtonModal` on ✎ click (edit mode visual indicator on Grid buttons, edit button modal opens on ✎ click)
- [x] 8.2 When `isEditMode` is true, append a "＋ 新增按鈕" cell after the last button that opens `AddButtonModal` on click (add button cell in Grid edit mode, add button modal opens from Grid add cell)
- [x] 8.3 Update `GridView.css` with styles for the ✎ overlay icon (positioned top-right, visible only in edit mode) and the "＋ 新增按鈕" add cell
