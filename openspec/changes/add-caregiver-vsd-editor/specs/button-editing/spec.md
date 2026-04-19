## MODIFIED Requirements

### Requirement: Edit button modal opens on button click

When `isEditMode` is true, clicking anywhere on a Grid button or VSD hotspot SHALL open `EditButtonModal` pre-filled with the button's current `label` and `vocalization` values. If the button includes `ext_voco_hotspot`, the modal SHALL also display editable coordinate inputs for `x`, `y`, `width`, and `height`.

#### Scenario: Grid button opens modal with text fields

- **WHEN** the caregiver clicks a Grid button while in edit mode
- **THEN** EditButtonModal opens with the button's current `label` and `vocalization`

#### Scenario: VSD hotspot opens modal with coordinate fields

- **WHEN** the caregiver clicks a VSD hotspot while in edit mode
- **THEN** EditButtonModal opens with the hotspot's current `label`, `vocalization`, and coordinate fields for `x`, `y`, `width`, and `height`

### Requirement: Confirm button edit saves changes

Confirming in EditButtonModal SHALL dispatch `updateBoard` with the board updated to reflect the new `label` and `vocalization` for the edited button. If the edited button includes `ext_voco_hotspot`, the board update SHALL also persist any confirmed coordinate changes from the modal. The modal SHALL close after dispatch.

#### Scenario: Save edited Grid button

- **WHEN** the caregiver changes label to "喝水", vocalization to "我想喝水", and clicks "確認" for a Grid button
- **THEN** the button in the board updates to `label: "喝水"` and `vocalization: "我想喝水"`, and the modal closes

#### Scenario: Save edited VSD hotspot coordinates

- **WHEN** the caregiver changes the `x`, `y`, `width`, or `height` values for a VSD hotspot and clicks "確認"
- **THEN** the hotspot coordinates on the backing button are updated to the confirmed values and the modal closes
