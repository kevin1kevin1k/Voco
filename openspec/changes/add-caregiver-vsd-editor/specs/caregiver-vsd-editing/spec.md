## ADDED Requirements

### Requirement: Caregiver can upload and replace VSD background images

When a caregiver is editing a VSD board, the system SHALL provide an upload action that accepts image files, stores the selected image in browser-local storage, and updates the board background to the uploaded asset immediately.

#### Scenario: Upload image for empty VSD board

- **WHEN** a caregiver opens a VSD board in edit mode with no configured background image and selects a valid image file
- **THEN** the system stores the image locally, updates the board to reference the new background image, marks the board as user-owned for VSD assets, and renders the uploaded image in the VSD canvas

#### Scenario: Replace existing VSD background image

- **WHEN** a caregiver uploads a new valid image file for a VSD board that already has a background image
- **THEN** the system replaces the board background reference with the new asset and the VSD canvas renders the new image after the update

### Requirement: Caregiver can create and update rectangular VSD hotspots

When a caregiver is editing a VSD board, the system SHALL allow the caregiver to draw a rectangular hotspot, move an existing hotspot, resize an existing hotspot, and persist those coordinates back into the board button's `ext_voco_hotspot` fields as percentages.

#### Scenario: Draw new hotspot and save metadata

- **WHEN** a caregiver enters hotspot draw mode, drags a rectangle on the VSD canvas, fills in the hotspot label and vocalization, and confirms the edit modal
- **THEN** the system creates a new board button with rectangular `ext_voco_hotspot` coordinates, saves it to the board, and renders the hotspot in the updated position

#### Scenario: Move existing hotspot

- **WHEN** a caregiver drags an existing hotspot to a new position and releases the pointer
- **THEN** the system updates the hotspot `x` and `y` percentages on the backing button and keeps the hotspot within the bounds of the VSD canvas

#### Scenario: Resize existing hotspot

- **WHEN** a caregiver drags a resize handle on an existing hotspot and releases the pointer
- **THEN** the system updates the hotspot `width` and `height` percentages on the backing button and keeps the hotspot above the minimum supported size

### Requirement: VSD edit mode separates editing from speaking

While a VSD board is in caregiver edit mode, hotspot interactions SHALL edit content rather than trigger speech playback. When edit mode is off, the same hotspots SHALL resume normal speech behavior.

#### Scenario: Hotspot click edits during caregiver mode

- **WHEN** edit mode is enabled on a VSD board and the caregiver clicks an existing hotspot
- **THEN** the system opens the hotspot editing flow and SHALL NOT synthesize speech

#### Scenario: Hotspot click speaks during user mode

- **WHEN** edit mode is disabled on a VSD board and the user clicks an existing hotspot
- **THEN** the system uses the hotspot vocalization or label for speech output and SHALL NOT open the caregiver editing flow
