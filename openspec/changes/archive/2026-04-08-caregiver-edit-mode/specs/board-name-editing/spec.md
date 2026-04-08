## ADDED Requirements

### Requirement: Board name edit button in NavigationBar

When `isEditMode` is true, the board title in NavigationBar SHALL display a ✎ icon next to it. Clicking the ✎ icon SHALL open `EditBoardNameModal` pre-filled with the current board name.

#### Scenario: Edit icon appears in edit mode

- **WHEN** `isEditMode` is true
- **THEN** a ✎ icon appears next to the board title in NavigationBar

#### Scenario: Modal opens with current board name

- **WHEN** user clicks the ✎ icon next to the board title
- **THEN** EditBoardNameModal opens with the name field pre-filled with the current board's name

### Requirement: Confirm board name edit updates board

Confirming in EditBoardNameModal SHALL dispatch `updateBoard` with the board's `name` changed to the new trimmed value. The modal SHALL close after dispatch.

#### Scenario: Save new board name

- **WHEN** user changes name to "家庭" and clicks "確認"
- **THEN** the board's name updates to "家庭", NavigationBar title reflects the change, modal closes

#### Scenario: Cancel discards name change

- **WHEN** user clicks "取消" in EditBoardNameModal
- **THEN** no dispatch occurs, modal closes with original name unchanged

### Requirement: Empty name is rejected in EditBoardNameModal

EditBoardNameModal SHALL NOT allow confirming when the name field is empty.

#### Scenario: Empty name disables confirm

- **WHEN** name field is cleared in EditBoardNameModal
- **THEN** "確認" button is disabled
