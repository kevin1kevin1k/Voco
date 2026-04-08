## ADDED Requirements

### Requirement: Edit button modal opens on ✎ click

When `isEditMode` is true, clicking the ✎ overlay on a Grid button SHALL open `EditButtonModal` pre-filled with the button's current `label` and `vocalization` values.

#### Scenario: Modal opens with current values

- **WHEN** user clicks the ✎ overlay on a button while in edit mode
- **THEN** EditButtonModal opens with `label` input showing the button's current label and `vocalization` input showing the button's current vocalization (or label if vocalization is absent)

### Requirement: Confirm button edit saves changes

Confirming in EditButtonModal SHALL dispatch `updateBoard` with the board updated to reflect the new `label` and `vocalization` for the edited button. The modal SHALL close after dispatch.

#### Scenario: Save edited label and vocalization

- **WHEN** user changes label to "喝水", vocalization to "我想喝水", and clicks "確認"
- **THEN** the button in the board updates to `label: "喝水"` and `vocalization: "我想喝水"`, the modal closes

#### Scenario: Cancel discards changes

- **WHEN** user clicks "取消" in EditButtonModal
- **THEN** no dispatch occurs, the modal closes with original values unchanged

### Requirement: Empty label is rejected

EditButtonModal SHALL NOT allow confirming when the label field is empty. The "確認" button SHALL be disabled when `label.trim()` is empty.

#### Scenario: Empty label disables confirm

- **WHEN** user clears the label field in EditButtonModal
- **THEN** the "確認" button is disabled and cannot be clicked
