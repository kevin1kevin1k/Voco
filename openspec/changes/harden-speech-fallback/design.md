## Context

Speech output currently flows through a single `useSpeech` hook used by grid buttons, VSD hotspots, and recommendation buttons. The hook cancels current playback and immediately speaks a new utterance, but voice selection is limited to `lang === preferredLang`, and there is no handling for browsers that populate voices asynchronously through `voiceschanged`.

This change needs to improve reliability without expanding product scope. The app already stores `preferredLang`, `rate`, `pitch`, and `volume` in Redux, but there is no UI to manage them and no existing speech-specific spec. The safest change is an internal hardening pass that preserves the current consumer API.

## Goals / Non-Goals

**Goals:**

- Make voice selection deterministic for `zh-TW` preference with a documented fallback order.
- Avoid losing the first user utterance when voices load after initial interaction.
- Keep `speak()` and `stop()` as the only public hook API so existing callers remain unchanged.
- Add minimal automated coverage around voice selection logic.

**Non-Goals:**

- No user-facing voice selection or speech settings screen.
- No persistent speech queue beyond the latest pending utterance.
- No UI banner or toast when the browser falls back to a non-Chinese voice.

## Decisions

### Extract deterministic voice selection into a pure helper

Voice matching SHALL move into a separate helper that accepts `(voices, preferredLang)` and returns the best matching voice or `null`. The helper will normalize language tags and apply a fixed order: exact preferred language, Taiwan/traditional-Chinese variants, any `zh-*` voice, then `null` so the browser default can be used. This keeps selection testable without mocking the full browser speech API.

Alternative considered: keep the logic inline inside the hook. Rejected because it would make edge-case testing awkward and hide the fallback order inside event-driven hook code.

### Let the hook replay only the latest utterance after voiceschanged

When `getVoices()` returns an empty list, the hook SHALL store only the latest pending speech request and subscribe to `voiceschanged`. Once voices become available, the hook SHALL replay that one latest request using the same `rate`, `pitch`, `volume`, and `preferredLang` semantics. If voices remain empty past a short fallback delay, the hook SHALL speak the latest pending utterance once with no explicit voice so the browser default can handle playback. This avoids silent failure while keeping behavior simple for rapid button presses.

Alternative considered: queue all pending utterances. Rejected because AAC interaction benefits more from “latest intent wins” than from replaying stale button presses.

### Keep cancel-before-speak as the global interaction rule

Every new `speak(text)` call SHALL cancel current synthesis before speaking the next utterance. Empty or whitespace-only text SHALL be ignored. If no matching voice is found, the utterance SHALL still be spoken with `utterance.lang = preferredLang` and no explicit `voice`, allowing the browser default to handle fallback.

Alternative considered: only cancel when another utterance is already speaking. Rejected because inconsistent overlap behavior is harder to reason about and does not match the current user expectation.

## Risks / Trade-offs

- [Browser voice metadata is inconsistent] → Normalize language matching conservatively and stop at “any Chinese voice” before using browser default.
- [Pending replay may still happen slightly later than the tap] → Keep only the latest pending utterance and trigger immediately on `voiceschanged` to reduce surprise.
- [Node-level tests cannot validate actual browser synthesis] → Limit automated tests to the pure selection helper and keep build/manual coverage for hook integration.
