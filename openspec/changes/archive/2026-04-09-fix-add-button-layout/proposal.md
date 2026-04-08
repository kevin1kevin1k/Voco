## Why

The "＋ 新增按鈕" button in `GridView` is placed inside `grid-container` as an extra grid item. Because `grid-container` uses `gridTemplateRows: repeat(N, 1fr)` that fills the full viewport height, the button overflows into an auto-generated row outside the defined grid and is pushed to the very bottom edge of the screen — nearly invisible to caregivers.

## What Changes

- Move the "＋ 新增按鈕" button from inside `grid-container` to immediately after it, as a sibling element within `grid-view`.
- Update `.grid-add-button` CSS to render as a full-width flex row (not a grid cell) with a fixed minimum height.

## Non-Goals

- Does not change the logic for when the button is shown (edit mode only).
- Does not change the button's behavior or the `AddButtonModal` it triggers.
- Does not affect board button rendering inside the grid.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `button-creation`: The entry point for adding a button (the "+ 新增按鈕" button) must be visible and accessible regardless of grid row count or viewport height.

## Impact

- Affected code: `src/features/board/GridView.jsx`, `src/features/board/GridView.css`
