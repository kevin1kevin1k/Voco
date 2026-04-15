## ADDED Requirements

### Requirement: Delete board button in NavigationBar

When `isEditMode` is true and `currentBoardId` is NOT `"root"`, the NavigationBar SHALL display a "刪除頁面" button. Clicking it SHALL open `DeleteBoardModal`. When `isEditMode` is false or `currentBoardId === "root"`, no "刪除頁面" button SHALL be rendered.

#### Scenario: Delete button visible on non-root board in edit mode

- **WHEN** `isEditMode` is true and the current board is not root
- **THEN** a "刪除頁面" button appears in NavigationBar

#### Scenario: Delete button hidden on root board

- **WHEN** `isEditMode` is true and the current board is root
- **THEN** no "刪除頁面" button appears in NavigationBar

### Requirement: DeleteBoardModal confirms and executes board deletion

`DeleteBoardModal` SHALL display the name of the board to be deleted and a warning that the action is irreversible. Clicking "確認刪除" SHALL dispatch `deleteBoard(boardId)` followed by `goHome()`. Clicking "取消" SHALL close the modal without any dispatch.

#### Scenario: Confirm deletes board and navigates home

- **WHEN** user clicks "確認刪除" in DeleteBoardModal for board "朋友"
- **THEN** `deleteBoard("朋友-id")` is dispatched, `goHome()` is dispatched, modal closes, user lands on root board

#### Scenario: Cancel closes modal without changes

- **WHEN** user clicks "取消" in DeleteBoardModal
- **THEN** no dispatch occurs, modal closes, current board is unchanged

### Requirement: deleteBoard reducer removes board from state

`deleteBoard(state, boardId)` SHALL delete `state.byId[boardId]` and remove `boardId` from `state.allIds`. It SHALL NOT modify any other board. It SHALL NOT be callable on `boardId === "root"` (callers MUST prevent this at the UI level).

#### Scenario: Board removed from Redux state

- **WHEN** `deleteBoard("friends-board-id")` is dispatched
- **THEN** `state.byId["friends-board-id"]` is undefined and `"friends-board-id"` is absent from `state.allIds`
