## MODIFIED Requirements

### Requirement: Edit mode toggle in NavigationBar

The NavigationBar SHALL display an "編輯" button on the right side when `isEditMode` is false. When `isEditMode` is true, the button SHALL change to "完成". The "＋ 新增頁面" button SHALL NOT appear in NavigationBar in edit mode; it is displayed in GridView instead.

Dispatching `toggleEditMode` from `caregiverSlice` SHALL flip `isEditMode` between true and false.

#### Scenario: Enter edit mode

- **WHEN** user clicks "編輯" in NavigationBar
- **THEN** `isEditMode` becomes true, "編輯" button changes to "完成"; no "＋ 新增頁面" button appears in NavigationBar

#### Scenario: Exit edit mode

- **WHEN** user clicks "完成" in NavigationBar
- **THEN** `isEditMode` becomes false, "完成" reverts to "編輯"

## MODIFIED Requirements

### Requirement: Add button cell in Grid edit mode

When `isEditMode` is true, GridView SHALL render a bottom action bar containing two buttons side by side: "＋ 新增按鈕" and "＋ 新增頁面". When `isEditMode` is false, this action bar SHALL NOT be rendered.

#### Scenario: Add action bar appears in edit mode

- **WHEN** `isEditMode` is true and GridView renders
- **THEN** a bottom bar with "＋ 新增按鈕" and "＋ 新增頁面" buttons appears below the grid

#### Scenario: Add action bar absent in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no "＋ 新增按鈕" or "＋ 新增頁面" cell is rendered in GridView
