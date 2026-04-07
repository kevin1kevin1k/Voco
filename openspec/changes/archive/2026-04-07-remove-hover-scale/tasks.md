## 1. Remove Hover Scale

- [x] 1.1 In `src/features/board/BoardButton.css`, remove the `transform: scale(1.03)` line from `.board-button:hover` so that hover does not cause layout shift; retain the `box-shadow` line in the same rule; verify the `:active` rule with `transform: scale(0.97)` is untouched to preserve click animation is preserved
