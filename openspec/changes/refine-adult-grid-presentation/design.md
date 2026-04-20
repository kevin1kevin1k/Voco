# Design: refine-adult-grid-presentation

## Summary

This change makes Grid mode feel intentional and adult without changing board data or interaction contracts. The implementation uses a board-level visual theme, not per-button data colors, so `family`, `medical`, and `places` gain distinct but restrained identities while remaining consistent within each board.

## Theme Model

- `GridView` exposes the current board theme through a `data-board-theme` attribute.
- CSS variables are declared at the Grid root and switched by board id:
  - `family`: warm plum accent
  - `medical`: restrained terracotta accent
  - `places`: deep green accent
  - fallback: slate accent
- The button-level `background_color` field remains in OBF data but is not used as the primary User Mode card color.

## Layout and Component Changes

- `GridView`
  - Increase page padding and spacing.
  - Add a themed surface wrapper around the grid.
  - Keep recommendation bar above the grid, visually integrated into the same theme.
- `BoardButton`
  - Use larger minimum height, stronger typography, and a card-like surface.
  - Add explicit `:focus-visible`, hover, and pressed states.
  - Keep edit hint visible but visually secondary.
- `RecommendationBar`
  - Use smaller, calmer chips derived from the same board theme.
  - Preserve existing behavior and edit-mode hiding.
- `grid-edit-actions`
  - Align add buttons with the new themed surface so edit mode does not fall back to dashed prototype visuals.

## Testing

- Add one Playwright smoke test that enters `family`, verifies the themed grid root and one button render with adult presentation hooks, clicks a button, and confirms recommendation UI remains visible after interaction.
- Continue running the existing add-board e2e suite and production build.
