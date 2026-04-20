# Design: add-core-logic-test-baseline

## Summary

This change adds the smallest sustainable unit-test baseline without introducing a new frontend test framework. The repo already uses plain JavaScript and has one `node:test` file for speech fallback, so the same mechanism will be extended to other deterministic logic modules.

## Test Runner Approach

- Add `npm run test:unit` that executes the Node built-in test runner.
- Keep Playwright for interaction flows and `node:test` for deterministic logic.
- Avoid Vitest/Jest in this change to keep scope focused on coverage instead of tooling migration.

## Coverage Targets

- `src/utils/obfParser.js`
  - `getBoardDisplayType`
  - `parseButtons`
  - `parseHotspot`
  - `getGridOrder`
- `src/features/navigation/navigationSlice.js`
  - reducer transitions for `navigateTo`, `goBack`, `goHome`
  - selector behavior for `selectCurrentBoardId` and `selectCanGoBack`
- `src/features/prediction/predictionSlice.js`
  - `recordClick` timestamp payload and 500-entry trimming
  - `computeRecommendations` for same-board filtering, recent-click exclusion, semantic prioritization, and empty-history fallback

## Documentation Updates

- Mark the TODO baseline-testing item complete once the entrypoint and required coverage exist.
- Update PRD current-state text to reflect that baseline unit coverage exists, while keeping interaction/PWA verification as an open gap.
