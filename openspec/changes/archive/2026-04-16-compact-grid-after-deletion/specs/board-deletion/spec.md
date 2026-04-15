## MODIFIED Requirements

### Requirement: DeleteBoardModal confirms and executes board deletion

`DeleteBoardModal` SHALL display the name of the board to be deleted and a warning that the action is irreversible. Clicking "確認刪除" SHALL: (1) scan all boards in `state.boards.byId` to find every button whose `load_board.id === board.id`, (2) dispatch `deleteButton({ boardId: parentBoardId, buttonId: navButtonId })` for each such button (which also compacts the parent board's grid), (3) dispatch `deleteBoard(boardId)`, (4) dispatch `goHome()`. Clicking "取消" SHALL close the modal without any dispatch.

#### Scenario: Confirm removes nav button, compacts parent, deletes board, navigates home

- **WHEN** user clicks "確認刪除" in DeleteBoardModal for board "朋友" whose navigation button exists in the root board
- **THEN** `deleteButton({ boardId: "root", buttonId: "<nav-btn-id>" })` is dispatched first (removing the nav button and compacting root grid), then `deleteBoard("朋友-id")` is dispatched, then `goHome()` is dispatched, and the user lands on the root board with no orphan button

#### Scenario: Cancel closes modal without changes

- **WHEN** user clicks "取消" in DeleteBoardModal
- **THEN** no dispatch occurs, modal closes, current board and all parent boards are unchanged
