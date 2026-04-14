## MODIFIED Requirements

### Requirement: Add board modal opens from NavigationBar

Clicking "＋ 新增頁面" in GridView's bottom action bar while in edit mode SHALL open `AddBoardModal` with an empty name field. The "＋ 新增頁面" button SHALL NOT appear in NavigationBar.

#### Scenario: Modal opens empty

- **WHEN** user clicks "＋ 新增頁面" in GridView's bottom action bar while in edit mode
- **THEN** AddBoardModal opens with the board name field empty
