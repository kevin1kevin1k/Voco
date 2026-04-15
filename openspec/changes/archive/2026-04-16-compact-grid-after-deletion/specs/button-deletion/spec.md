## MODIFIED Requirements

### Requirement: deleteButton reducer removes button from board

`deleteButton(state, { boardId, buttonId })` SHALL remove the button with the matching `buttonId` from `state.byId[boardId].buttons`. It SHALL replace every occurrence of `buttonId` in `state.byId[boardId].grid.order` with `null`. After removal, it SHALL compact `grid.order`: flatten the 2D array left-to-right top-to-bottom, filter out all `null` values, then refill the same `rows × columns` grid in row-major order, padding trailing cells with `null`. The `grid.rows` and `grid.columns` values SHALL NOT be changed. All other buttons and grid cells SHALL remain unchanged.

#### Scenario: Button removed and grid compacted

- **WHEN** `deleteButton({ boardId: "meals", buttonId: "btn-1" })` is dispatched and "btn-1" occupies the second cell in a 2×3 grid
- **THEN** `state.byId["meals"].buttons` no longer contains `id: "btn-1"`, and remaining buttons shift left-to-right top-to-bottom with no internal null gaps; trailing cells after the last button SHALL be null

#### Scenario: Grid stays same dimensions after compaction

- **WHEN** `deleteButton` is dispatched on a board with a 3×4 grid
- **THEN** `grid.order` still has 3 rows and 4 columns; `grid.rows` and `grid.columns` are unchanged
