## MODIFIED Requirements

### Requirement: Add button modal opens from Grid add cell

The "＋ 新增按鈕" button in edit mode SHALL be rendered outside the `grid-container` element, as a sibling flex child within `grid-view`, so that it remains visible regardless of the number of grid rows or the viewport height. Clicking it SHALL open `AddButtonModal` with empty `label` and `vocalization` fields.

#### Scenario: Modal opens empty

- **WHEN** user clicks "＋ 新增按鈕" while in edit mode
- **THEN** AddButtonModal opens with label and vocalization fields both empty

#### Scenario: Add button is visible on empty board

- **WHEN** a board has zero buttons and user is in edit mode
- **THEN** the "＋ 新增按鈕" button SHALL be visible near the bottom of the board area, not pushed outside the viewport
