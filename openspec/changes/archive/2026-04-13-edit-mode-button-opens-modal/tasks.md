## 1. BoardButton — edit mode behavior and inline indicator

- [x] 1.1 Add `onEdit` prop to `BoardButton` component signature (`src/features/board/BoardButton.jsx`). When `isEditMode` is true and the button is clicked, call `onEdit()` instead of `speak()` or `onNavigate()`. When `isEditMode` is false, preserve existing behavior (speak or navigate). This satisfies "Edit mode button click opens EditButtonModal" and "Edit button modal opens on button click".
- [x] 1.2 Render a ✎ character immediately to the right of the `<span className="button-label">` when `isEditMode` is true (`src/features/board/BoardButton.jsx`). Wrap it in a `<span className="button-edit-hint">` element. This satisfies "Edit mode visual indicator on Grid buttons".

## 2. GridView — wire onEdit, remove overlay

- [x] 2.1 In `GridView.jsx`, update `handleButtonClick` so that when `isEditMode` is true it calls `setEditingButton(button)`. Previously it did nothing in edit mode. Pass `onEdit={() => setEditingButton(button)}` as a prop to each `<BoardButton>` (`src/features/board/GridView.jsx`). This satisfies "Edit button modal opens on ✎ click" (the entire button becomes the trigger).
- [x] 2.2 Remove the `{isEditMode && <button className="btn-edit-overlay" ...>✎</button>}` JSX block from `GridView.jsx`. The ✎ overlay is replaced by the inline indicator in BoardButton (`src/features/board/GridView.jsx`).

## 3. CSS — remove overlay styles, add inline hint styles

- [x] 3.1 Remove `.btn-edit-overlay` rule(s) from `src/features/board/BoardButton.css` (or `GridView.css` if the style lives there). Add `.button-edit-hint` style: `font-size: 0.7em; opacity: 0.6; margin-left: 2px; pointer-events: none;` so the ✎ is visually subtle and does not capture its own click events.
