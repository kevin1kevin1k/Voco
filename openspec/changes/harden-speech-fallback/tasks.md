## 1. Specs and docs alignment

- [x] 1.1 Add and validate the `speech-output` proposal, design, and spec artifacts for deterministic fallback order
- [x] 1.2 Update PRD and TODO to describe the speech output fallback order and reliability expectations

## 2. Voice selection and hook behavior

- [x] 2.1 Implement Extract deterministic voice selection into a pure helper with exact zh-TW, Chinese, and browser-default fallback ordering
- [x] 2.2 Implement Let the hook replay only the latest utterance after voiceschanged using the latest speech request
- [x] 2.3 Implement Keep cancel-before-speak as the global interaction rule for Speech output uses latest-intent cancel and replay behavior

## 3. Verification

- [x] 3.1 Add automated tests for Speech output selects voices using deterministic fallback order
- [x] 3.2 Add automated tests for Speech output tolerates asynchronous voice loading at the pure helper level where applicable
- [x] 3.3 Run build and targeted speech tests, then confirm the change validates cleanly in Spectra
