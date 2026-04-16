## Requirements

### Requirement: Modal dismisses on backdrop click

`ModalShell` SHALL call `onClose` when the user clicks the `.modal-overlay` element (the dark backdrop outside the modal card). Clicking anywhere inside `.modal-card` SHALL NOT trigger `onClose` via this mechanism. The effect SHALL be identical to clicking the "取消" button.

#### Scenario: Click on overlay closes modal

- **WHEN** user clicks on the dark overlay area outside the modal card
- **THEN** `onClose` is called and the modal is dismissed, identical to clicking "取消"

#### Scenario: Click inside card does not close modal

- **WHEN** user clicks anywhere inside the modal card (title, body, inputs, buttons)
- **THEN** the modal remains open and no dismiss is triggered

<!-- @trace
source: modal-backdrop-dismiss
updated: 2026-04-16
code:
  - src/features/caregiver/ModalShell.jsx
-->