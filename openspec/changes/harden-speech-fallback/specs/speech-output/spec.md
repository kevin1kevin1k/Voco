## ADDED Requirements

### Requirement: Speech output selects voices using deterministic fallback order

The system SHALL attempt to select a Web Speech voice for the preferred language using the following order: exact preferred language match, Taiwan or traditional-Chinese variants, any `zh-*` voice, then no explicit voice so the browser default voice handles playback.

#### Scenario: Exact zh-TW voice exists

- **WHEN** the preferred language is `zh-TW` and the browser exposes a voice whose language tag resolves to `zh-TW`
- **THEN** the system selects that exact voice for playback

#### Scenario: No exact zh-TW voice but another Chinese voice exists

- **WHEN** the preferred language is `zh-TW`, no exact match exists, and the browser exposes another Chinese voice
- **THEN** the system selects the best available Chinese voice before falling back to browser default

#### Scenario: No Chinese voice exists

- **WHEN** the preferred language is `zh-TW` and the browser exposes no Chinese voice
- **THEN** the system speaks using the browser default voice with `utterance.lang` still set to `zh-TW`

### Requirement: Speech output tolerates asynchronous voice loading

If the browser voice list is not yet available when `speak()` is called, the system SHALL remember the latest pending utterance and retry it when the browser fires `voiceschanged`. If the voice list remains empty past the hook's fallback delay, the system SHALL speak the latest pending utterance once using the browser default voice behavior.

#### Scenario: Voices load after first interaction

- **WHEN** `speak()` is called while `speechSynthesis.getVoices()` returns an empty list and the browser later fires `voiceschanged`
- **THEN** the latest pending utterance is replayed once using the newly available voice list

#### Scenario: Multiple utterances requested before voices load

- **WHEN** multiple `speak()` calls happen before any voices are available
- **THEN** only the latest pending utterance is replayed after `voiceschanged`

#### Scenario: Voices never arrive before fallback delay expires

- **WHEN** `speak()` is called while `speechSynthesis.getVoices()` stays empty past the fallback delay
- **THEN** the system speaks only the latest pending utterance once using browser-default voice behavior

### Requirement: Speech output uses latest-intent cancel and replay behavior

The system SHALL cancel current synthesis before starting a new utterance. The system SHALL NOT attempt speech for empty or whitespace-only text.

#### Scenario: User taps two buttons quickly

- **WHEN** one utterance is already speaking and `speak()` is called again with non-empty text
- **THEN** the existing speech is cancelled and only the new utterance continues

#### Scenario: Empty text is ignored

- **WHEN** `speak()` is called with an empty or whitespace-only string
- **THEN** the system does not create or speak a new utterance
