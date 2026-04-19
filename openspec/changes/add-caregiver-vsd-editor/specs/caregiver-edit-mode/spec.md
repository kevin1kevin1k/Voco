## ADDED Requirements

### Requirement: Edit mode exposes VSD editing controls

When `isEditMode` is true and the active board is a VSD board, the board view SHALL display VSD-specific editing controls for managing the background image and starting hotspot creation.

#### Scenario: VSD toolbar visible in edit mode

- **WHEN** the caregiver enables edit mode on a VSD board
- **THEN** the VSD view shows controls for uploading or replacing the background image and for entering hotspot creation mode

#### Scenario: VSD toolbar hidden in user mode

- **WHEN** edit mode is disabled on a VSD board
- **THEN** the VSD-specific editing controls are not rendered
