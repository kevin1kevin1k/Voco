## 1. Specs and docs alignment

- [x] 1.1 Add proposal, design, and spec artifacts for the core logic testing baseline
- [x] 1.2 Update PRD and TODO to reflect the delivered unit-test baseline

## 2. Unit-test baseline implementation

- [x] 2.1 Implement requirement `The repo provides a minimal unit-test entrypoint for deterministic logic` by adding a repo-level `test:unit` entrypoint using `node:test`
- [x] 2.2 Implement requirement `Core navigation and parsing logic has direct regression coverage` by adding direct tests for OBF parsing helpers and navigation reducer transitions
- [x] 2.3 Implement requirement `Recommendation logic has direct regression coverage` by adding direct tests for prediction history recording and recommendation rules

## 3. Verification

- [x] 3.1 Run the unit-test suite and the existing speech helper test
- [x] 3.2 Run the existing add-board e2e suite and production build
- [x] 3.3 Confirm the Spectra change validates cleanly and all tasks are complete
