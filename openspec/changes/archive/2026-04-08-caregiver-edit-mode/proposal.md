## Why

照護者目前無法在 app 內新增或編輯板面與按鈕，只能直接修改 JSON 原始碼，門檻過高。需要一個照護者可操作的編輯介面，讓非技術人員也能管理溝通詞彙。

## What Changes

- NavBar 新增「編輯」/「完成」切換按鈕，進入/離開照護者編輯模式
- 編輯模式下每個 Grid 按鈕顯示 ✎ 圖示，點擊後開啟 modal 編輯 label 與 vocalization
- 編輯模式下 Grid 最後多一格「＋ 新增按鈕」，點擊後開啟 modal 填寫新按鈕資料
- 編輯模式下 NavBar 新增「＋ 新增頁面」，點擊後開啟 modal 填寫新板面名稱
- NavBar 板面標題旁顯示 ✎ 圖示，可編輯目前板面名稱
- 所有編輯結果儲存至 localStorage，app 啟動時合併靜態 JSON 與 localStorage 資料
- localStorage 中的板面覆蓋同 ID 的靜態板面，新板面則追加

## Capabilities

### New Capabilities

- `caregiver-edit-mode`: 照護者編輯模式的進入/離開機制與視覺狀態
- `board-persistence`: 板面資料的 localStorage 讀寫與啟動時合併邏輯
- `button-editing`: 編輯現有按鈕的 label 與 vocalization
- `button-creation`: 在現有板面新增按鈕
- `board-creation`: 新增板面（包含名稱，預設空 Grid）
- `board-name-editing`: 編輯現有板面名稱

### Modified Capabilities

- `board-completeness`: 板面載入流程需合併 localStorage 資料

## Impact

- Affected specs: `caregiver-edit-mode`, `board-persistence`, `button-editing`, `button-creation`, `board-creation`, `board-name-editing`, delta on `board-completeness`
- Affected code:
  - `src/features/caregiver/caregiverSlice.js`
  - `src/features/navigation/NavigationBar.jsx`
  - `src/features/navigation/NavigationBar.css`
  - `src/features/board/GridView.jsx`
  - `src/features/board/GridView.css`
  - `src/features/board/BoardButton.jsx`
  - `src/features/board/BoardButton.css`
  - `src/features/board/boardSlice.js`
  - `src/utils/obfParser.js`
  - `src/app/store.js` (localStorage middleware or listener)
  - New: `src/features/caregiver/EditButtonModal.jsx`
  - New: `src/features/caregiver/AddButtonModal.jsx`
  - New: `src/features/caregiver/AddBoardModal.jsx`
  - New: `src/features/caregiver/EditBoardNameModal.jsx`
  - New: `src/utils/boardStorage.js`
