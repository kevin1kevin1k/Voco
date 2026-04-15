# board-deletion Specification

## Purpose

在編輯模式下，讓照護者透過 NavigationBar 的「刪除頁面」按鈕與 DeleteBoardModal 的確認流程刪除非根板面，並將刪除結果同步至 Redux 狀態。

## Requirements

### Requirement: Delete board button in NavigationBar

When `isEditMode` is true and `currentBoardId` is NOT `"root"`, the NavigationBar SHALL display a "刪除頁面" button. Clicking it SHALL open `DeleteBoardModal`. When `isEditMode` is false or `currentBoardId === "root"`, no "刪除頁面" button SHALL be rendered.

#### Scenario: Delete button visible on non-root board in edit mode

- **WHEN** `isEditMode` is true and the current board is not root
- **THEN** a "刪除頁面" button appears in NavigationBar

#### Scenario: Delete button hidden on root board

- **WHEN** `isEditMode` is true and the current board is root
- **THEN** no "刪除頁面" button appears in NavigationBar


<!-- @trace
source: add-delete-button-and-board
updated: 2026-04-16
code:
  - src/features/navigation/NavigationBar.css
  - src/features/navigation/NavigationBar.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/features/caregiver/EditButtonModal.css
  - src/app/store.js
  - src/features/board/boardSlice.js
  - src/features/caregiver/DeleteBoardModal.jsx
-->

---
### Requirement: DeleteBoardModal confirms and executes board deletion

`DeleteBoardModal` SHALL display the name of the board to be deleted and a warning that the action is irreversible. Clicking "確認刪除" SHALL: (1) scan all boards in `state.boards.byId` to find every button whose `load_board.id === board.id`, (2) dispatch `deleteButton({ boardId: parentBoardId, buttonId: navButtonId })` for each such button (which also compacts the parent board's grid), (3) dispatch `deleteBoard(boardId)`, (4) dispatch `goHome()`. Clicking "取消" SHALL close the modal without any dispatch.

#### Scenario: Confirm removes nav button, compacts parent, deletes board, navigates home

- **WHEN** user clicks "確認刪除" in DeleteBoardModal for board "朋友" whose navigation button exists in the root board
- **THEN** `deleteButton({ boardId: "root", buttonId: "<nav-btn-id>" })` is dispatched first (removing the nav button and compacting root grid), then `deleteBoard("朋友-id")` is dispatched, then `goHome()` is dispatched, and the user lands on the root board with no orphan button

#### Scenario: Cancel closes modal without changes

- **WHEN** user clicks "取消" in DeleteBoardModal
- **THEN** no dispatch occurs, modal closes, current board and all parent boards are unchanged


<!-- @trace
source: compact-grid-after-deletion
updated: 2026-04-16
code:
  - src/features/navigation/NavigationBar.css
  - src/app/store.js
  - src/features/caregiver/DeleteBoardModal.jsx
  - src/features/board/boardSlice.js
  - src/features/caregiver/EditButtonModal.jsx
  - src/features/navigation/NavigationBar.jsx
  - src/features/caregiver/EditButtonModal.css
-->

---
### Requirement: deleteBoard reducer removes board from state

`deleteBoard(state, boardId)` SHALL delete `state.byId[boardId]` and remove `boardId` from `state.allIds`. It SHALL NOT modify any other board. It SHALL NOT be callable on `boardId === "root"` (callers MUST prevent this at the UI level).

#### Scenario: Board removed from Redux state

- **WHEN** `deleteBoard("friends-board-id")` is dispatched
- **THEN** `state.byId["friends-board-id"]` is undefined and `"friends-board-id"` is absent from `state.allIds`

<!-- @trace
source: add-delete-button-and-board
updated: 2026-04-16
code:
  - src/features/navigation/NavigationBar.css
  - src/features/navigation/NavigationBar.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/features/caregiver/EditButtonModal.css
  - src/app/store.js
  - src/features/board/boardSlice.js
  - src/features/caregiver/DeleteBoardModal.jsx
-->