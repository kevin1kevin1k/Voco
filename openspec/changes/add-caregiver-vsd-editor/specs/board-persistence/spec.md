## MODIFIED Requirements

### Requirement: Persist user-edited boards to localStorage

The system SHALL write the current boards state to localStorage under the key `voco_boards` after every `addBoard`, `updateBoard`, `deleteButton`, or `deleteBoard` Redux action. The stored value SHALL be JSON-serialized `{ byId: {...}, allIds: [...] }` reflecting the full current boards state after the action.

VSD image blobs SHALL NOT be written into `voco_boards`. When a caregiver uploads or replaces a VSD background image, the system SHALL store the binary image asset in IndexedDB and keep only asset metadata and references in the board JSON.

#### Scenario: Board saved after hotspot update

- **WHEN** `updateBoard` is dispatched with modified VSD hotspot coordinates
- **THEN** localStorage `voco_boards` is updated within the same synchronous call to reflect the new hotspot metadata

#### Scenario: Uploaded VSD image persists outside board JSON

- **WHEN** a caregiver uploads a VSD background image
- **THEN** the board stored in localStorage references the asset metadata while the image blob is stored in IndexedDB

#### Scenario: Board removed from localStorage after deletion

- **WHEN** `deleteBoard` is dispatched with a board ID
- **THEN** localStorage `voco_boards` is updated to exclude the deleted board from both `byId` and `allIds`

### Requirement: Merge localStorage boards on app startup

On app startup, `loadAllBoards` SHALL first load static boards from `import.meta.glob`, then read `voco_boards` from localStorage. For each board in localStorage, if a board with the same ID exists in the static set, the merged result SHALL keep the static board's `id`, `format`, `locale`, and `ext_voco_display_type`.

For built-in boards, static `images` and `ext_voco_background` SHALL remain authoritative unless the stored board sets `ext_voco_user_owned_vsd` to `true`. Boards in localStorage with IDs not present in the static set SHALL be appended.

#### Scenario: Built-in board keeps static VSD asset until customized

- **WHEN** localStorage contains a stored copy of a built-in VSD board without `ext_voco_user_owned_vsd` set to `true`
- **THEN** the merged result uses the static board `images` and `ext_voco_background`

#### Scenario: Customized built-in board uses stored VSD asset

- **WHEN** localStorage contains a stored copy of a built-in VSD board with `ext_voco_user_owned_vsd` set to `true`
- **THEN** the merged result uses the stored board `images` and `ext_voco_background`

#### Scenario: User-created board is appended

- **WHEN** localStorage contains a board whose ID does not exist in the static boards
- **THEN** the merged result includes that board in addition to all static boards
