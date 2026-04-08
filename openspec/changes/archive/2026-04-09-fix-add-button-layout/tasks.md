## 1. Fix GridView Layout — Add button modal opens from Grid add cell

- [x] 1.1 Fix "Add button modal opens from Grid add cell": in `src/features/board/GridView.jsx`, move the `{isEditMode && <button className="grid-add-button" ...>}` element from inside `grid-container` to immediately after the closing `</div>` of `grid-container`, keeping it inside `grid-view`
- [x] 1.2 In `src/features/board/GridView.css`, update `.grid-add-button` to add `flex-shrink: 0` so the button is not compressed by the flex layout, and set a minimum height (e.g., `min-height: 48px`)

## 2. Verify Add button is visible on empty board

- [x] 2.1 Confirm that on a newly created empty board in edit mode, the "＋ 新增按鈕" button is visible in the lower portion of the board area (not clipped or pushed outside the viewport)
