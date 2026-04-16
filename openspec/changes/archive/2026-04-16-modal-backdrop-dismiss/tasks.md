## 1. ModalShell — backdrop dismiss

- [x] 1.1 In `src/features/caregiver/ModalShell.jsx`: add `onClick={onClose}` to the `.modal-overlay` div, and add `onClick={(e) => e.stopPropagation()}` to the `.modal-card` div. No other changes are needed. This satisfies "Modal dismisses on backdrop click" (Click on overlay closes modal, Click inside card does not close modal).
