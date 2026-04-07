## Why

Grid buttons currently render at content size rather than filling their grid cells, leaving large empty areas on the screen. For AAC users with motor impairments, maximum tap target size is critical — buttons must fill all available space and adapt to any screen size.

## What Changes

- `<div role="gridcell">` wrapper in `GridView.jsx` is changed to `display: contents` so `.board-button` participates directly in the CSS grid layout
- `.board-button` gains `width: 100%` and `height: 100%` so it stretches to fill each grid cell
- `.grid-view` and `.grid-container` height chain is verified and locked: `grid-view` uses `height: 100%` on its grid container to ensure rows fill the board area
- `.grid-view` padding is reduced from `1rem` to `0.5rem` to maximise usable button area
- Font size for `.button-label` and `.button-symbol` scales with `clamp()` so text remains readable at any cell size

## Non-Goals

- Does not change the number of rows/columns — layout remains data-driven from OBF `grid` field
- Does not change VSD hotspot sizing — only Grid mode is affected
- Does not add breakpoint-based media queries — responsive sizing is achieved via CSS `fr` units and `clamp()`, not fixed breakpoints

## Capabilities

### New Capabilities

- `responsive-grid-layout`: Grid buttons fill all available screen space and scale responsively with device dimensions

### Modified Capabilities

(none)

## Impact

- Affected code:
  - `src/features/board/GridView.jsx` (gridcell wrapper change)
  - `src/features/board/GridView.css` (height chain, padding)
  - `src/features/board/BoardButton.css` (width/height 100%, font clamp)
