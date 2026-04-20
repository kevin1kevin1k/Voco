# Proposal: add-core-logic-test-baseline

## Why

The project already has meaningful User Mode and caregiver functionality, but regressions in core logic are still mostly caught only by manual testing or browser-level flows. Navigation, recommendation rules, and OBF parsing are deterministic and central to the app, yet they do not have direct unit-level coverage.

## What Changes

- Add a minimal `node:test` unit-test entrypoint to the repo.
- Add baseline unit coverage for `obfParser`, `navigationSlice`, and `predictionSlice`.
- Update PRD and TODO so the testing baseline reflects the new state of the codebase.

## Impact

- Affected capability: quality and verification baseline.
- No UI behavior changes.
- No Redux state shape changes.
- No OBF schema changes.
