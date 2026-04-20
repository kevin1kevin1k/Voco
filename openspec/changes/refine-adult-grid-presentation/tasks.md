## 1. Specs and docs alignment

- [x] 1.1 Add proposal, design, and spec artifacts for adult Grid presentation
- [x] 1.2 Update PRD and TODO to reflect adult Grid presentation as delivered

## 2. Grid presentation implementation

- [x] 2.1 Implement requirement `Grid mode uses a board-level adult visual theme` by adding a board-level theme hook in `GridView` for `family`, `medical`, `places`, and fallback boards
- [x] 2.2 Implement requirement `Grid buttons remain readable and touch-friendly on common device sizes` by restyling `BoardButton` with improved spacing, typography, and focus states
- [x] 2.3 Implement requirement `Recommendation UI matches the adult Grid system` by restyling `RecommendationBar` and edit-mode action buttons to match the Grid theme system

## 3. Verification

- [x] 3.1 Add a Grid smoke test covering themed Grid rendering and recommendation visibility
- [x] 3.2 Run the Grid smoke test, existing add-board e2e suite, and production build
- [x] 3.3 Confirm the Spectra change validates cleanly and all tasks are complete
