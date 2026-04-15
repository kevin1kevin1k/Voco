## ADDED Requirements

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

### Requirement: deleteButton reducer removes button from board

`deleteButton(state, { boardId, buttonId })` SHALL remove the button with the matching `buttonId` from `state.byId[boardId].buttons`. It SHALL also replace the first occurrence of `buttonId` in every row of `state.byId[boardId].grid.order` with `null`. All other buttons and grid cells SHALL remain unchanged.

#### Scenario: Button removed from buttons array and grid

- **WHEN** `deleteButton({ boardId: "meals", buttonId: "btn-1" })` is dispatched
- **THEN** `state.byId["meals"].buttons` no longer contains the button with `id: "btn-1"`, and the cell that held `"btn-1"` in `grid.order` becomes `null`
