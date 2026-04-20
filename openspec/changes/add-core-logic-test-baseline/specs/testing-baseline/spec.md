# Capability: testing-baseline

## ADDED Requirements

### Requirement: The repo provides a minimal unit-test entrypoint for deterministic logic

The project MUST provide a repo-level unit-test command for deterministic JavaScript logic without introducing a new browser-focused test runtime.

#### Scenario: run baseline unit tests

- **GIVEN** a developer is in the project root
- **WHEN** they run the unit-test command
- **THEN** the Node built-in test runner executes the repo's logic tests

### Requirement: Core navigation and parsing logic has direct regression coverage

The project MUST directly test deterministic logic in navigation state transitions and OBF parsing helpers.

#### Scenario: navigation reducer transitions are covered

- **GIVEN** the navigation reducer starts from its initial state
- **WHEN** actions such as `navigateTo`, `goBack`, and `goHome` are dispatched
- **THEN** the resulting `currentBoardId` and `history` match the expected transitions

#### Scenario: OBF parsing helpers are covered

- **GIVEN** a board with buttons, images, grid data, and hotspots
- **WHEN** the parsing helpers are called
- **THEN** the returned display type, parsed buttons, hotspot data, and grid order match the expected normalized output

### Requirement: Recommendation logic has direct regression coverage

The project MUST directly test the recommendation rules that drive Grid-mode suggestions.

#### Scenario: recommendations prefer related items and exclude recent clicks

- **GIVEN** a board with speakable buttons and semantic related-button metadata
- **AND** a click history for that board
- **WHEN** recommendations are computed
- **THEN** recently clicked items are excluded
- **AND** related items are prioritized ahead of less relevant candidates

#### Scenario: recommendation logic handles empty history

- **GIVEN** a board with speakable buttons
- **WHEN** recommendations are computed with no click history
- **THEN** the result is an empty list
