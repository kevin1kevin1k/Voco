## ADDED Requirements

### Requirement: Persist user-edited boards to localStorage

The system SHALL write the current boards state to localStorage under the key `voco_boards` after every `addBoard` or `updateBoard` Redux action. The stored value SHALL be JSON-serialized `{ byId: {...}, allIds: [...] }` containing only the boards that were added or modified by the user (not the original static boards).

#### Scenario: Board saved after update

- **WHEN** `updateBoard` is dispatched with a modified board object
- **THEN** localStorage `voco_boards` is updated within the same synchronous call to reflect the new board state

#### Scenario: Board saved after creation

- **WHEN** `addBoard` is dispatched with a new board object
- **THEN** localStorage `voco_boards` is updated to include the new board

### Requirement: Merge localStorage boards on app startup

On app startup, `loadAllBoards` SHALL first load static boards from `import.meta.glob`, then read `voco_boards` from localStorage. For each board in localStorage, if a board with the same ID exists in the static set, the localStorage version SHALL override it. Boards in localStorage with IDs not present in the static set SHALL be appended.

#### Scenario: User-edited board overrides static board

- **WHEN** localStorage contains a board with the same ID as a static board
- **THEN** the merged result uses the localStorage version for that board

#### Scenario: User-created board is appended

- **WHEN** localStorage contains a board whose ID does not exist in the static boards
- **THEN** the merged result includes that board in addition to all static boards

#### Scenario: No localStorage data

- **WHEN** localStorage `voco_boards` key is absent or contains invalid JSON
- **THEN** only static boards are loaded, with no error thrown
