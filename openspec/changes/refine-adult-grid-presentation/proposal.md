# Proposal: refine-adult-grid-presentation

## Why

The Grid boards are functionally usable, but they still look like a prototype. Buttons currently inherit per-button pastel colors from board data, spacing is tight, and the recommendation bar uses a separate prototype-like style. This does not yet satisfy the PRD requirement for an adult, respectful AAC interface.

## What Changes

- Introduce a board-level adult visual theme for Grid mode.
- Restyle Grid buttons, recommendation chips, and edit-mode actions to use one coherent visual system.
- Preserve the existing board schema and interaction behavior while deprioritizing per-button `background_color` in User Mode.
- Add a focused Grid smoke test to protect the new themed presentation.

## Impact

- Affected capability: Grid presentation in User Mode.
- Affected files: `GridView`, `BoardButton`, `RecommendationBar`, related CSS, PRD/TODO, and a new Spectra spec.
- No Redux shape changes, no OBF schema changes, and no navigation behavior changes.
