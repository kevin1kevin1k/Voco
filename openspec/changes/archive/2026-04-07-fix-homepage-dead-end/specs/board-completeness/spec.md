## ADDED Requirements

### Requirement: All root navigation entries resolve to a valid board

Every button in the root board that carries a `load_board.id` SHALL reference an OBF board file that exists in `src/data/boards/`. No navigation entry SHALL silently stall in a loading state due to a missing board.

#### Scenario: Navigate to medical board

- **WHEN** user taps the "醫療" button on the root board
- **THEN** the app SHALL render the `medical` Grid board with 6 buttons (藥物, 看診, 打針, 痛, 不舒服, 廁所)

#### Scenario: Navigate to places board

- **WHEN** user taps the "地點" button on the root board
- **THEN** the app SHALL render the `places` Grid board with 6 buttons (醫院, 超市, 公園, 餐廳, 銀行, 回家)

#### Scenario: Medical board buttons trigger speech

- **WHEN** user taps any button on the `medical` board
- **THEN** the app SHALL speak the button's `vocalization` text via Web Speech API

#### Scenario: Places board buttons trigger speech

- **WHEN** user taps any button on the `places` board
- **THEN** the app SHALL speak the button's `vocalization` text via Web Speech API

### Requirement: Missing board shows an informative fallback message

When `BoardRenderer` receives a `currentBoardId` that does not correspond to any loaded board, it SHALL display "此板面正在建立中" instead of a generic loading indicator.

#### Scenario: Unknown board ID after navigation

- **WHEN** `currentBoardId` is set to an ID that does not exist in the boards store
- **THEN** `BoardRenderer` SHALL display the text "此板面正在建立中"
- **THEN** the UI SHALL NOT display "載入中..." as if data were still fetching
