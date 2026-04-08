# caregiver-edit-mode Specification

## Purpose

照護者編輯模式的進入/離開機制與視覺狀態。讓非技術人員能透過 UI 切換進入編輯模式，在 Grid 板面上看到可編輯的視覺提示，並使用新增按鈕功能。

## Requirements

### Requirement: Edit mode toggle in NavigationBar

The NavigationBar SHALL display an "編輯" button on the right side when `isEditMode` is false. When `isEditMode` is true, the button SHALL change to "完成" and an additional "＋ 新增頁面" button SHALL appear.

Dispatching `toggleEditMode` from `caregiverSlice` SHALL flip `isEditMode` between true and false.

#### Scenario: Enter edit mode

- **WHEN** user clicks "編輯" in NavigationBar
- **THEN** `isEditMode` becomes true, "編輯" button changes to "完成", "＋ 新增頁面" button appears

#### Scenario: Exit edit mode

- **WHEN** user clicks "完成" in NavigationBar
- **THEN** `isEditMode` becomes false, "完成" reverts to "編輯", "＋ 新增頁面" button disappears


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
### Requirement: Edit mode visual indicator on Grid buttons

When `isEditMode` is true, each Grid button SHALL display a ✎ icon overlay in the top-right corner to signal editability.

#### Scenario: Edit overlay visible in edit mode

- **WHEN** `isEditMode` is true and GridView renders buttons
- **THEN** each button shows a ✎ overlay icon in the top-right corner

#### Scenario: Edit overlay hidden in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no ✎ overlay icon is shown on any button


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
### Requirement: Add button cell in Grid edit mode

When `isEditMode` is true, GridView SHALL render an extra cell after all existing buttons with the label "＋ 新增按鈕".

#### Scenario: Add button cell appears in edit mode

- **WHEN** `isEditMode` is true
- **THEN** a "＋ 新增按鈕" cell appears after the last button in the Grid

#### Scenario: Add button cell absent in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no "＋ 新增按鈕" cell is rendered

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