## 1. NavigationBar — remove add board button

- [x] 1.1 In `src/features/navigation/NavigationBar.jsx`: remove the `showAddBoardModal` useState declaration, the `{isEditMode && <button className="nav-add-board" ...>＋ 新增頁面</button>}` JSX from `nav-edit-controls`, the `AddBoardModal` import, and the `{showAddBoardModal && <AddBoardModal .../>}` render. This satisfies "Edit mode toggle in NavigationBar" (no ＋ 新增頁面 in NavBar).

## 2. GridView — add board button alongside add button

- [x] 2.1 In `src/features/board/GridView.jsx`: add `import AddBoardModal from '../caregiver/AddBoardModal'` and a `const [showAddBoardModal, setShowAddBoardModal] = useState(false)` state. Replace the existing `{isEditMode && <button className="grid-add-button" ...>＋ 新增按鈕</button>}` block with a wrapper `<div className="grid-edit-actions">` containing both the "＋ 新增按鈕" button and a new "＋ 新增頁面" button (`onClick={() => setShowAddBoardModal(true)}`). Add `{showAddBoardModal && <AddBoardModal onClose={() => setShowAddBoardModal(false)} />}` alongside existing modals. This satisfies "Add button cell in Grid edit mode" and "Add board modal opens from NavigationBar".

## 3. CSS — bottom action bar layout

- [x] 3.1 In `src/features/board/GridView.css`: add `.grid-edit-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }` so the two add buttons sit side by side. Each button inside `.grid-edit-actions` should use the existing `.grid-add-button` style (apply it to both via the wrapper selector or keep the class on each button individually).

## 4. CSS cleanup — NavigationBar

- [x] 4.1 In `src/features/navigation/NavigationBar.css`: check for and remove any `.nav-add-board` rule if present, as the button no longer exists.

## 5. Bug fix — second add button hidden due to CSS conflict

- [x] 5.1 In `src/features/board/GridView.css`: `.grid-add-button` has `width: 100%` and `flex-shrink: 0`, which causes the second button to overflow off-screen when both are inside a flex row. Add `.grid-edit-actions > .grid-add-button { flex: 1; }` to override `width: 100%` via `flex-basis: 0%` and allow both buttons to share space equally. This makes "＋ 新增頁面" visible alongside "＋ 新增按鈕".
