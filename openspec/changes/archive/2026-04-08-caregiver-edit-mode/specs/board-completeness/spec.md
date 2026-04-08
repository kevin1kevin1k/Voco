## ADDED Requirements

### Requirement: User-created boards resolve from navigation

Boards created via the caregiver edit mode (stored in localStorage) SHALL be resolvable by the navigation system. `selectBoardById` SHALL return user-created boards just as it returns static boards.

#### Scenario: Navigate to user-created board

- **WHEN** user creates a new board named "朋友" and navigates to it
- **THEN** the app SHALL render the new empty Grid board with name "朋友"
