# button-deletion Specification

## Purpose

在編輯模式下，讓照護者透過 EditButtonModal 的兩步驟確認流程刪除按鈕，並將刪除結果同步至 Redux 狀態。

## Requirements

### Requirement: Delete button via EditButtonModal

When `isEditMode` is true and `EditButtonModal` is open, the modal SHALL display a "刪除" button. Clicking "刪除" for the first time SHALL switch the button to a red confirmation state showing "確認刪除？". Clicking "確認刪除？" SHALL dispatch `deleteButton({ boardId, buttonId })`, close the modal, and remove the button from the grid. Clicking anywhere else (e.g., "取消" or outside) while in the confirmation state SHALL cancel the delete and revert the button to normal state.

#### Scenario: First click enters confirmation state

- **WHEN** user clicks "刪除" in EditButtonModal
- **THEN** the "刪除" button changes to a red "確認刪除？" button; no deletion occurs yet

#### Scenario: Second click executes deletion

- **WHEN** user clicks "確認刪除？" in EditButtonModal
- **THEN** `deleteButton({ boardId: board.id, buttonId: button.id })` is dispatched; the button is removed from `board.buttons` and its grid cell becomes `null`; EditButtonModal closes

#### Scenario: Cancel aborts deletion

- **WHEN** user clicks "取消" while "確認刪除？" is displayed
- **THEN** the delete confirmation is cancelled; the button and board are unchanged; EditButtonModal closes


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
### Requirement: deleteButton reducer removes button from board

`deleteButton(state, { boardId, buttonId })` SHALL remove the button with the matching `buttonId` from `state.byId[boardId].buttons`. It SHALL replace every occurrence of `buttonId` in `state.byId[boardId].grid.order` with `null`. After removal, it SHALL compact `grid.order`: flatten the 2D array left-to-right top-to-bottom, filter out all `null` values, then refill the same `rows × columns` grid in row-major order, padding trailing cells with `null`. The `grid.rows` and `grid.columns` values SHALL NOT be changed. All other buttons and grid cells SHALL remain unchanged.

#### Scenario: Button removed and grid compacted

- **WHEN** `deleteButton({ boardId: "meals", buttonId: "btn-1" })` is dispatched and "btn-1" occupies the second cell in a 2×3 grid
- **THEN** `state.byId["meals"].buttons` no longer contains `id: "btn-1"`, and remaining buttons shift left-to-right top-to-bottom with no internal null gaps; trailing cells after the last button SHALL be null

#### Scenario: Grid stays same dimensions after compaction

- **WHEN** `deleteButton` is dispatched on a board with a 3×4 grid
- **THEN** `grid.order` still has 3 rows and 4 columns; `grid.rows` and `grid.columns` are unchanged

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