## 1. Fix Grid Cell Stretch

- [x] 1.1 In `src/features/board/GridView.jsx`, change `<div role="gridcell" onClick={...}>` to use `style={{ display: 'contents' }}` so the `.board-button` inside participates directly in the CSS grid layout and grid buttons fill available screen space
- [x] 1.2 In `src/features/board/BoardButton.css`, add `width: 100%; height: 100%;` to `.board-button` and remove `min-height: 100px` so each button stretches to fill its cell

## 2. Fix Height Chain

- [x] 2.1 In `src/features/board/GridView.css`, ensure `.grid-view` has `flex: 1; min-height: 0;` and `.grid-container` has `height: 100%` (in addition to existing `flex: 1`) so the grid fills the board content area; reduce `.grid-view` padding from `1rem` to `0.5rem` to maximise button area; this ensures grid buttons fill available screen space end-to-end

## 3. Responsive Font Scaling

- [x] 3.1 In `src/features/board/BoardButton.css`, replace the fixed `.button-label` font size (`1.3rem`) with `clamp(1rem, 2.5vw, 1.6rem)` and replace `.button-symbol` font size (`2.5rem`) with `clamp(1.8rem, 4vw, 3rem)` so button text scales with cell size at all viewport widths
