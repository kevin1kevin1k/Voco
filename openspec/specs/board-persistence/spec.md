# board-persistence Specification

## Purpose

板面資料的 localStorage 讀寫與啟動時合併邏輯。確保照護者編輯的板面在重新整理或重啟後仍然保留，並正確與靜態 JSON 板面合併。

## Requirements

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


<!-- @trace
source: add-delete-button-and-board
updated: 2026-04-16
code:
  - src/features/navigation/NavigationBar.css
  - src/features/navigation/NavigationBar.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/features/caregiver/EditButtonModal.css
  - src/app/store.js
  - src/features/board/boardSlice.js
  - src/features/caregiver/DeleteBoardModal.jsx
-->

---
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

<!-- @trace
source: caregiver-edit-mode
updated: 2026-04-08
code:
  - src/features/board/GridView.css
  - src/utils/boardStorage.js
  - src/features/navigation/NavigationBar.css
  - src/features/caregiver/AddBoardModal.jsx
  - src/features/caregiver/ModalShell.css
  - src/features/board/GridView.jsx
  - src/features/caregiver/EditButtonModal.jsx
  - src/app/store.js
  - src/features/caregiver/AddButtonModal.jsx
  - src/features/caregiver/EditBoardNameModal.jsx
  - src/features/caregiver/ModalShell.jsx
  - src/features/navigation/NavigationBar.jsx
  - src/utils/obfParser.js
-->