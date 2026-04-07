## ADDED Requirements

### Requirement: Hover does not cause layout shift

Hovering over a Grid button SHALL NOT trigger any CSS transform that changes the button's rendered size or position. No surrounding element SHALL shift position as a result of a hover interaction.

#### Scenario: Hover on root board button

- **WHEN** the user moves the cursor over the "住家" button on the root 2×2 grid
- **THEN** no button, grid cell, or page element SHALL change position
- **THEN** a box shadow SHALL appear on the hovered button

#### Scenario: Hover on adjacent buttons

- **WHEN** the user moves the cursor from one grid button to an adjacent button
- **THEN** neither button SHALL shift position during the transition
- **THEN** the shadow SHALL transfer to the newly hovered button without layout reflow


<!-- @trace
source: remove-hover-scale
updated: 2026-04-07
code:
  - src/features/board/BoardButton.css
-->

### Requirement: Click animation is preserved

The `:active` press-down scale animation (`transform: scale(0.97)`) SHALL be retained. A brief, user-initiated scale on click is acceptable because it is momentary and provides tactile confirmation.

#### Scenario: Button click shows press feedback

- **WHEN** the user clicks and holds a Grid button
- **THEN** the button SHALL briefly scale down to 97% while the pointer is held
- **THEN** upon pointer release the button SHALL return to full size

## Requirements


<!-- @trace
source: remove-hover-scale
updated: 2026-04-07
code:
  - src/features/board/BoardButton.css
-->

### Requirement: Hover does not cause layout shift

Hovering over a Grid button SHALL NOT trigger any CSS transform that changes the button's rendered size or position. No surrounding element SHALL shift position as a result of a hover interaction.

#### Scenario: Hover on root board button

- **WHEN** the user moves the cursor over the "住家" button on the root 2×2 grid
- **THEN** no button, grid cell, or page element SHALL change position
- **THEN** a box shadow SHALL appear on the hovered button

#### Scenario: Hover on adjacent buttons

- **WHEN** the user moves the cursor from one grid button to an adjacent button
- **THEN** neither button SHALL shift position during the transition
- **THEN** the shadow SHALL transfer to the newly hovered button without layout reflow

---
### Requirement: Click animation is preserved

The `:active` press-down scale animation (`transform: scale(0.97)`) SHALL be retained. A brief, user-initiated scale on click is acceptable because it is momentary and provides tactile confirmation.

#### Scenario: Button click shows press feedback

- **WHEN** the user clicks and holds a Grid button
- **THEN** the button SHALL briefly scale down to 97% while the pointer is held
- **THEN** upon pointer release the button SHALL return to full size