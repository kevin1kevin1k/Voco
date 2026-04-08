## ADDED Requirements

### Requirement: Edit mode toggle in NavigationBar

The NavigationBar SHALL display an "編輯" button on the right side when `isEditMode` is false. When `isEditMode` is true, the button SHALL change to "完成" and an additional "＋ 新增頁面" button SHALL appear.

Dispatching `toggleEditMode` from `caregiverSlice` SHALL flip `isEditMode` between true and false.

#### Scenario: Enter edit mode

- **WHEN** user clicks "編輯" in NavigationBar
- **THEN** `isEditMode` becomes true, "編輯" button changes to "完成", "＋ 新增頁面" button appears

#### Scenario: Exit edit mode

- **WHEN** user clicks "完成" in NavigationBar
- **THEN** `isEditMode` becomes false, "完成" reverts to "編輯", "＋ 新增頁面" button disappears

### Requirement: Edit mode visual indicator on Grid buttons

When `isEditMode` is true, each Grid button SHALL display a ✎ icon overlay in the top-right corner to signal editability.

#### Scenario: Edit overlay visible in edit mode

- **WHEN** `isEditMode` is true and GridView renders buttons
- **THEN** each button shows a ✎ overlay icon in the top-right corner

#### Scenario: Edit overlay hidden in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no ✎ overlay icon is shown on any button

### Requirement: Add button cell in Grid edit mode

When `isEditMode` is true, GridView SHALL render an extra cell after all existing buttons with the label "＋ 新增按鈕".

#### Scenario: Add button cell appears in edit mode

- **WHEN** `isEditMode` is true
- **THEN** a "＋ 新增按鈕" cell appears after the last button in the Grid

#### Scenario: Add button cell absent in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no "＋ 新增按鈕" cell is rendered
