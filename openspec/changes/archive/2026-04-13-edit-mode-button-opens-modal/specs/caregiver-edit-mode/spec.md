## MODIFIED Requirements

### Requirement: Edit mode visual indicator on Grid buttons

When `isEditMode` is true, each Grid button SHALL display a ✎ character inline, immediately to the right of the button label text, to signal editability. The ✎ SHALL NOT be rendered as a separate floating overlay element.

#### Scenario: Edit indicator visible in edit mode

- **WHEN** `isEditMode` is true and GridView renders buttons
- **THEN** each button shows a ✎ character immediately to the right of the label text, inside the button

#### Scenario: Edit indicator hidden in normal mode

- **WHEN** `isEditMode` is false
- **THEN** no ✎ character is shown on any button

## ADDED Requirements

### Requirement: Edit mode button click opens EditButtonModal

When `isEditMode` is true, clicking anywhere on a Grid button SHALL open `EditButtonModal` for that button. The click SHALL NOT trigger speech synthesis or board navigation.

#### Scenario: Clicking button in edit mode opens modal

- **WHEN** `isEditMode` is true and user clicks anywhere on a Grid button
- **THEN** EditButtonModal opens pre-filled with that button's current `label` and `vocalization`; no speech is produced; no navigation occurs

#### Scenario: Clicking button in normal mode does not open modal

- **WHEN** `isEditMode` is false and user clicks a Grid button
- **THEN** normal behavior applies (speech synthesis or board navigation); EditButtonModal does NOT open
