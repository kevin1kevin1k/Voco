## Why

The current speech hook only uses an exact `zh-TW` voice match at call time and assumes the browser voice list is already loaded. On devices where `speechSynthesis.getVoices()` is initially empty or where no exact `zh-TW` voice exists, the app can fall back unpredictably or appear silent during first use.

## What Changes

- Add a dedicated speech output capability that defines deterministic voice fallback behavior for `zh-TW` preference.
- Normalize voice selection into a pure helper so the fallback order is explicit and testable.
- Update the speech hook to handle late `voiceschanged` events, queue the latest pending utterance while voices are still loading, and keep cancel/replay behavior consistent.
- Update PRD and TODO so speech fallback order and reliability expectations are explicit.

## Non-Goals

- No new speech settings UI, voice picker, or persisted speech preferences.
- No visual warning banner for unavailable voices in this change.
- No backend, analytics, or remote speech service integration.

## Capabilities

### New Capabilities

- `speech-output`: Deterministic voice selection, fallback ordering, and replay behavior for Web Speech output.

### Modified Capabilities

(none)

## Impact

- Affected specs: `speech-output`
- Affected code: `docs/PRD.md`, `docs/TODO.md`, `src/features/speech/useSpeech.js`, new speech helper/test files
- Affected behavior: Grid button speech, VSD hotspot speech, and recommendation speech output
