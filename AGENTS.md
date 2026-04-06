## Response Format & Language
- For every implementation report response, always use Traditional Chinese.
- For `/review` slash command responses, always use Traditional Chinese (technical terms may remain in English).
- For every implementation report response (but not commit-only replies such as `建立 commit` after an already-reported batch), always include these sections in order:
  1. `實作結果摘要` (clear summary + impacted area)
  2. `修改檔案` (reviewer scan order: docs/config -> backend -> frontend -> tests/helpers; include one-line summary per file; always use ordered numbering `1. 2. 3.` instead of bullet points; every file label must be the full repository-relative path such as `frontend/e2e/auth.spec.ts`)
  3. `測試方式與結果` (fully executable commands with concrete values, plus key outputs)
  4. `人工驗證步驟` (only for behavior not fully covered by automation; include expected result per step)

## Commit & Pull Request Guidelines
Use Conventional Commits:
- `feat: add token validation`
- `fix: handle empty config path`
- `docs: add onboarding notes`

Commit truthfulness rule:
- When the user asks to `建立 commit`, do not claim success unless `git commit` has actually been executed successfully.
- Before replying that a commit was created, always verify with `git log --oneline -1` and report the real latest commit hash/message from the repository state.
- If the expected changes are still present in `git status --short`, do not claim the commit is complete.
- Root cause note: a previous false report claimed a commit hash that did not exist because the reply was sent before verifying actual repo state. This must not happen again.
