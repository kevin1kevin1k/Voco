# board-creation Specification

## Purpose

新增板面（包含名稱，預設空 Grid）。讓照護者在編輯模式下透過「＋ 新增頁面」按鈕建立新的空白 Grid 板面，並自動導航至新板面。

## Requirements

### Requirement: Add board modal opens from NavigationBar

Clicking "＋ 新增頁面" in NavigationBar edit mode SHALL open `AddBoardModal` with an empty name field.

#### Scenario: Modal opens empty

- **WHEN** user clicks "＋ 新增頁面" in NavigationBar while in edit mode
- **THEN** AddBoardModal opens with the board name field empty


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
### Requirement: Confirm board creation creates and navigates to new board

Confirming in AddBoardModal SHALL create a new board object with:
- `id`: generated as `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
- `name`: the trimmed value from the name field
- `format`: `"open-board-0.1"`
- `locale`: `"zh-TW"`
- `ext_voco_display_type`: `"grid"`
- `buttons`: `[]`
- `grid`: `{ rows: 2, columns: 3, order: [[null, null, null], [null, null, null]] }`
- `images`: `[]`
- `sounds`: `[]`

`addBoard` SHALL be dispatched with the new board. `navigateTo` SHALL be dispatched with the new board's ID so the user lands on the new board. The modal SHALL close after dispatch.

#### Scenario: New board created and navigated to

- **WHEN** user enters name "朋友" and clicks "確認"
- **THEN** a new board named "朋友" is created, added to Redux and localStorage, user navigates to the new board, modal closes

#### Scenario: Cancel discards new board

- **WHEN** user clicks "取消" in AddBoardModal
- **THEN** no dispatch occurs, modal closes


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
### Requirement: Empty name is rejected in AddBoardModal

AddBoardModal SHALL NOT allow confirming when the name field is empty.

#### Scenario: Empty name disables confirm

- **WHEN** name field is empty in AddBoardModal
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