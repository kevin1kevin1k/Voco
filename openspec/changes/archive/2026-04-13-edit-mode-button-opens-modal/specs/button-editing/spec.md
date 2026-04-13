## MODIFIED Requirements

### Requirement: Edit button modal opens on ✎ click

When `isEditMode` is true, clicking anywhere on a Grid button SHALL open `EditButtonModal` pre-filled with the button's current `label` and `vocalization` values. A separate ✎ overlay element SHALL NOT be required; the entire button is the click target.

#### Scenario: Modal opens with current values on button click

- **WHEN** user clicks anywhere on a button while in edit mode
- **THEN** EditButtonModal opens with `label` input showing the button's current label and `vocalization` input showing the button's current vocalization (or label if vocalization is absent)
