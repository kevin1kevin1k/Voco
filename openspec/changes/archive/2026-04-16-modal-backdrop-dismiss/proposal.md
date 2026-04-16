## Why

All modals in the app require the user to explicitly click "取消" to dismiss. Clicking outside the modal card (on the dark overlay) has no effect, which feels unresponsive — especially on a touchscreen AAC device where tapping away from a UI element is a natural cancel gesture.

## What Changes

- `ModalShell` gains backdrop-click-to-dismiss: clicking the `.modal-overlay` calls `onClose`, identical to clicking "取消"
- Clicking anywhere inside `.modal-card` does NOT trigger dismiss (stopPropagation)
- All modals that use `ModalShell` inherit this behaviour automatically: `EditButtonModal`, `EditBoardNameModal`, `DeleteBoardModal`, `AddButtonModal`, `AddBoardModal`

## Non-Goals

- No Escape key support (AAC touchscreen device; keyboard UX is not a priority)
- No animation or transition on dismiss (out of scope)
- No per-modal opt-out of backdrop dismiss

## Capabilities

### New Capabilities

- `modal-backdrop-dismiss`: Clicking the modal overlay (outside the card) dismisses the modal with the same effect as "取消"

### Modified Capabilities

(none)

## Impact

- Affected specs: `modal-backdrop-dismiss` (new)
- Affected code:
  - `src/features/caregiver/ModalShell.jsx`
