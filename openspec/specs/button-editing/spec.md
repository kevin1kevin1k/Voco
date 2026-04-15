# button-editing Specification

## Purpose

編輯現有按鈕的 label 與 vocalization。讓照護者在編輯模式下點擊按鈕的 ✎ 圖示後，透過 modal 修改按鈕文字與語音內容。

## Requirements

### Requirement: Edit button modal opens on button click

When `isEditMode` is true, clicking anywhere on a Grid button SHALL open `EditButtonModal` pre-filled with the button's current `label` and `vocalization` values.

#### Scenario: Modal opens with current values

- **WHEN** user clicks anywhere on a Grid button while in edit mode
- **THEN** EditButtonModal opens with `label` input showing the button's current label and `vocalization` input showing the button's current vocalization (or label if vocalization is absent)


<!-- @trace
source: edit-mode-button-opens-modal
updated: 2026-04-13
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
  - src/features/board/BoardButton.jsx
  - src/features/board/BoardButton.css
-->

---
### Requirement: Delete button entry point in EditButtonModal

`EditButtonModal` SHALL render a "刪除" button alongside the "取消" and "確認" buttons. The delete flow is governed by the `button-deletion` capability. The presence of this button is part of the button-editing modal's layout contract.

#### Scenario: Delete button is present in EditButtonModal

- **WHEN** EditButtonModal is open in edit mode
- **THEN** a "刪除" button is visible in the modal's action row alongside "取消" and "確認"


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
### Requirement: Confirm button edit saves changes

Confirming in EditButtonModal SHALL dispatch `updateBoard` with the board updated to reflect the new `label` and `vocalization` for the edited button. The modal SHALL close after dispatch.

#### Scenario: Save edited label and vocalization

- **WHEN** user changes label to "喝水", vocalization to "我想喝水", and clicks "確認"
- **THEN** the button in the board updates to `label: "喝水"` and `vocalization: "我想喝水"`, the modal closes

#### Scenario: Cancel discards changes

- **WHEN** user clicks "取消" in EditButtonModal
- **THEN** no dispatch occurs, the modal closes with original values unchanged


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
### Requirement: Empty label is rejected

EditButtonModal SHALL NOT allow confirming when the label field is empty. The "確認" button SHALL be disabled when `label.trim()` is empty.

#### Scenario: Empty label disables confirm

- **WHEN** user clears the label field in EditButtonModal
- **THEN** the "確認" button is disabled and cannot be clicked

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