# button-creation Specification

## Purpose

在現有板面新增按鈕。讓照護者在編輯模式下透過「＋ 新增按鈕」格，填寫新按鈕資料後將其加入板面。

## Requirements

### Requirement: Add button modal opens from Grid add cell

Clicking the "＋ 新增按鈕" cell in edit mode SHALL open `AddButtonModal` with empty `label` and `vocalization` fields.

#### Scenario: Modal opens empty

- **WHEN** user clicks "＋ 新增按鈕" cell while in edit mode
- **THEN** AddButtonModal opens with label and vocalization fields both empty


<!-- @trace
source: caregiver-edit-mode
updated: 2026-04-08
code:
  - src/features/board/GridView.css
  - src/utils/boardStorage.js
  - src/features/navigation/NavigationBar.css
  - src/features/caregiver/AddBoardModal.jsx
  - src/features/caregiver/ModalShell.css
  - src/features/board/GridView.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/app/store.js
  - src/features/caregiver/AddButtonModal.jsx
  - src/features/caregiver/EditBoardNameModal.jsx
  - src/features/caregiver/ModalShell.jsx
  - src/features/navigation/NavigationBar.jsx
  - src/utils/obfParser.js
-->

---
### Requirement: Confirm button creation adds button to board

Confirming in AddButtonModal SHALL create a new button object with:
- `id`: generated as `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
- `label`: the trimmed value from the label field
- `vocalization`: the trimmed value from the vocalization field (defaults to label if empty)
- `background_color`: `"rgb(240, 240, 240)"`

The new button SHALL be appended to `board.buttons` and its ID SHALL be appended to the last row of `board.grid.order` if space remains, otherwise a new row SHALL be added. `updateBoard` SHALL be dispatched with the modified board. The modal SHALL close after dispatch.

#### Scenario: New button appears in Grid

- **WHEN** user enters label "咖啡", leaves vocalization empty, and clicks "確認"
- **THEN** a new button with `label: "咖啡"`, `vocalization: "咖啡"` is added to the board, appears in the Grid, and modal closes

#### Scenario: Cancel discards new button

- **WHEN** user clicks "取消" in AddButtonModal
- **THEN** no dispatch occurs, no button is added, modal closes


<!-- @trace
source: caregiver-edit-mode
updated: 2026-04-08
code:
  - src/features/board/GridView.css
  - src/utils/boardStorage.js
  - src/features/navigation/NavigationBar.css
  - src/features/caregiver/AddBoardModal.jsx
  - src/features/caregiver/ModalShell.css
  - src/features/board/GridView.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/app/store.js
  - src/features/caregiver/AddButtonModal.jsx
  - src/features/caregiver/EditBoardNameModal.jsx
  - src/features/caregiver/ModalShell.jsx
  - src/features/navigation/NavigationBar.jsx
  - src/utils/obfParser.js
-->

---
### Requirement: Empty label is rejected in AddButtonModal

AddButtonModal SHALL NOT allow confirming when the label field is empty.

#### Scenario: Empty label disables confirm

- **WHEN** label field is empty in AddButtonModal
- **THEN** "確認" button is disabled

<!-- @trace
source: caregiver-edit-mode
updated: 2026-04-08
code:
  - src/features/board/GridView.css
  - src/utils/boardStorage.js
  - src/features/navigation/NavigationBar.css
  - src/features/caregiver/AddBoardModal.jsx
  - src/features/caregiver/ModalShell.css
  - src/features/board/GridView.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/app/store.js
  - src/features/caregiver/AddButtonModal.jsx
  - src/features/caregiver/EditBoardNameModal.jsx
  - src/features/caregiver/ModalShell.jsx
  - src/features/navigation/NavigationBar.jsx
  - src/utils/obfParser.js
-->