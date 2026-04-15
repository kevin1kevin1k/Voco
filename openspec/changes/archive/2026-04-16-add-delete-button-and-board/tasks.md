## 1. boardSlice — deleteButton and deleteBoard reducers

- [x] 1.1 In `src/features/board/boardSlice.js`: add `deleteButton(state, action)` reducer where `action.payload = { boardId, buttonId }`. Remove the button with `buttonId` from `state.byId[boardId].buttons`. Replace the first occurrence of `buttonId` in each row of `state.byId[boardId].grid.order` with `null`. Export `deleteButton`. This satisfies "deleteButton reducer removes button from board".
- [x] 1.2 In `src/features/board/boardSlice.js`: add `deleteBoard(state, action)` reducer where `action.payload = boardId`. Delete `state.byId[boardId]` and filter `boardId` out of `state.allIds`. Export `deleteBoard`. This satisfies "deleteBoard reducer removes board from state".

## 2. store.js — persist deleteButton and deleteBoard to localStorage

- [x] 2.1 In `src/app/store.js`: import `deleteBoard` from `boardSlice`. Add two new `listenerMiddleware.startListening` calls — one for `deleteButton` and one for `deleteBoard` — each calling `saveBoardsToStorage(listenerApi.getState().boards)`. This satisfies "Persist user-edited boards to localStorage" (Board removed from localStorage after deletion).

## 3. EditButtonModal — delete button with inline two-step confirmation

- [x] 3.1 In `src/features/caregiver/EditButtonModal.jsx`: import `deleteButton` from `boardSlice`. Add a `const [confirmDelete, setConfirmDelete] = useState(false)` state. In the modal's action row add a "刪除" button (`className="btn-delete"`): when `confirmDelete` is false, clicking it sets `confirmDelete(true)`; when `confirmDelete` is true, the button text changes to "確認刪除？" and clicking it dispatches `deleteButton({ boardId: board.id, buttonId: button.id })` then calls `onClose()`. The "取消" button's `onClick` SHALL also call `setConfirmDelete(false)` before closing to reset state. This satisfies "Delete button via EditButtonModal" and "Delete button entry point in EditButtonModal".
- [x] 3.2 In the CSS file used by `EditButtonModal` (check `ModalShell.css` or add `EditButtonModal.css`): add `.btn-delete { background: #c0392b; color: #fff; border: none; border-radius: 8px; padding: 0.6rem 1rem; font-size: 1.1rem; cursor: pointer; transition: background 0.2s; }` and `.btn-delete:hover { background: #a93226; }`.

## 4. NavigationBar — 刪除頁面 button

- [x] 4.1 In `src/features/navigation/NavigationBar.jsx`: add `const [showDeleteBoardModal, setShowDeleteBoardModal] = useState(false)` state. Import `DeleteBoardModal`. Inside `nav-edit-controls`, when `isEditMode && !isRoot`, render `<button className="nav-btn nav-delete-board" onClick={() => setShowDeleteBoardModal(true)}>刪除頁面</button>`. Render `{showDeleteBoardModal && <DeleteBoardModal board={currentBoard} onClose={() => setShowDeleteBoardModal(false)} />}` after the nav element. This satisfies "Delete board button in NavigationBar".
- [x] 4.2 In `src/features/navigation/NavigationBar.css`: add `.nav-delete-board { background: #c0392b; font-size: 1rem; padding: 0.5rem 0.9rem; }` and `.nav-delete-board:hover { background: #a93226; }`.

## 5. DeleteBoardModal — new component

- [x] 5.1 Create `src/features/caregiver/DeleteBoardModal.jsx`. It receives `{ board, onClose }` props. Import `useDispatch`, `deleteBoard` from `boardSlice`, and `goHome` from `navigationSlice`. Render using `ModalShell` with title "刪除頁面". Body text: `確定要刪除「{board.name}」？此操作無法復原。`. On confirm: dispatch `deleteBoard(board.id)`, dispatch `goHome()`, call `onClose()`. Set `confirmDisabled={false}` (always enabled). This satisfies "DeleteBoardModal confirms and executes board deletion".
