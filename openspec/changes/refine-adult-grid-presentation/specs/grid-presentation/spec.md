# Capability: grid-presentation

## ADDED Requirements

### Requirement: Grid mode uses a board-level adult visual theme

Grid boards MUST render with a consistent board-level theme instead of using each button's data color as the primary card surface.

#### Scenario: family board renders with a unified theme

- **GIVEN** the user opens the `family` board in User Mode
- **WHEN** the Grid is rendered
- **THEN** the Grid root exposes a stable board theme marker
- **AND** the buttons in that board share one coherent surface style
- **AND** the per-button `background_color` data is not the dominant card background in User Mode

### Requirement: Grid buttons remain readable and touch-friendly on common device sizes

Grid buttons MUST preserve readable text, clear focus treatment, and comfortable touch targets on desktop, tablet, and mobile widths.

#### Scenario: user tabs through a Grid board

- **GIVEN** a Grid board is visible
- **WHEN** the user tabs to a button
- **THEN** the focused button shows a visible `focus-visible` treatment
- **AND** the label remains legible

### Requirement: Recommendation UI matches the adult Grid system

The recommendation bar MUST use the same restrained visual language as the main Grid instead of a separate prototype-like style.

#### Scenario: recommendations appear after interaction

- **GIVEN** the user opens a Grid board with recommendation support
- **WHEN** the user clicks a button that produces recommendations
- **THEN** the recommendation region remains visible
- **AND** the recommendation chips use the active board theme
