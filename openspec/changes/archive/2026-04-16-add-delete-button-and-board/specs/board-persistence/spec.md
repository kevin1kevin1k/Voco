## MODIFIED Requirements

### Requirement: Persist user-edited boards to localStorage

The system SHALL write the current boards state to localStorage under the key `voco_boards` after every `addBoard`, `updateBoard`, or `deleteBoard` Redux action. The stored value SHALL be JSON-serialized `{ byId: {...}, allIds: [...] }` reflecting the full current boards state after the action.

#### Scenario: Board saved after update

- **WHEN** `updateBoard` is dispatched with a modified board object
- **THEN** localStorage `voco_boards` is updated within the same synchronous call to reflect the new board state

#### Scenario: Board saved after creation

- **WHEN** `addBoard` is dispatched with a new board object
- **THEN** localStorage `voco_boards` is updated to include the new board

#### Scenario: Board removed from localStorage after deletion

- **WHEN** `deleteBoard` is dispatched with a board ID
- **THEN** localStorage `voco_boards` is updated to exclude the deleted board from both `byId` and `allIds`
