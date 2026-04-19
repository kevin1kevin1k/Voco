## ADDED Requirements

### Requirement: Add board modal captures board display type

AddBoardModal SHALL let the caregiver choose whether the new board is a Grid board or a VSD board before confirming creation.

#### Scenario: Display type defaults to Grid

- **WHEN** AddBoardModal opens
- **THEN** the display type control is visible and defaults to Grid

#### Scenario: Caregiver selects VSD

- **WHEN** the caregiver changes the display type control from Grid to VSD
- **THEN** the pending board creation state reflects that the new board will be created as a VSD board

## MODIFIED Requirements

### Requirement: Confirm board creation creates and navigates to new board

Confirming in AddBoardModal SHALL create a new board object with:
- `id`: generated as `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
- `name`: the trimmed value from the name field
- `format`: `"open-board-0.1"`
- `locale`: `"zh-TW"`
- `ext_voco_display_type`: the selected display type
- `buttons`: `[]`
- `images`: `[]`
- `sounds`: `[]`

If the selected display type is `"grid"`, the board SHALL also include `grid: { rows: 2, columns: 3, order: [[null, null, null], [null, null, null]] }`.

If the selected display type is `"vsd"`, the board SHALL instead include `ext_voco_background: null` and SHALL NOT create a `grid` field.

`addBoard` SHALL be dispatched with the new board. `navigateTo` SHALL be dispatched with the new board's ID so the user lands on the new board. The modal SHALL close after dispatch.

#### Scenario: New Grid board created and navigated to

- **WHEN** the caregiver enters name "朋友", keeps display type as Grid, and clicks "確認"
- **THEN** a new Grid board named "朋友" is created, added to Redux and localStorage, the user navigates to the new board, and the modal closes

#### Scenario: New VSD board created and navigated to

- **WHEN** the caregiver enters name "臥室", selects display type VSD, and clicks "確認"
- **THEN** a new VSD board named "臥室" is created with no background image, added to Redux and localStorage, the user navigates to the new board, and the modal closes
