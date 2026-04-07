## Problem

Hovering over any Grid button causes the window to jitter. The button grows slightly larger and pushes surrounding elements, creating an unstable visual experience that is especially disruptive for AAC users with motor impairments who may move the cursor near buttons inadvertently.

## Root Cause

`.board-button:hover` applies `transform: scale(1.03)`. Before the responsive-grid-buttons change, buttons had fixed `min-height` and extra space around them, so the scale had room to breathe. Now that buttons are `width: 100%; height: 100%` and fill their grid cells completely, the 3% scale overflows the cell boundary and pushes adjacent cells, causing visible jitter.

## Proposed Solution

Remove `transform: scale(1.03)` from `.board-button:hover` in `src/features/board/BoardButton.css`. Retain `box-shadow` as the sole hover indicator — it provides sufficient visual feedback without affecting layout.

## Non-Goals

- Does not remove the `box-shadow` on hover (shadow provides no-layout-shift feedback)
- Does not remove the `:active` `transform: scale(0.97)` — a brief press-down animation on click is expected and acceptable since it is momentary and user-initiated

## Success Criteria

- Hovering over any Grid button SHALL NOT cause any element to shift position or the viewport to reflow
- A subtle shadow SHALL appear on hover to indicate interactivity
- Clicking a button MAY still show a brief scale-down press animation

## Impact

- Affected code: `src/features/board/BoardButton.css`
