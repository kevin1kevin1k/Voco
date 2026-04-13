## Why

編輯模式下，點擊按鈕本體仍會觸發語音輸出，使用者必須精準點擊浮動的 ✎ 圖示才能開啟編輯框，操作目標過小且行為不直覺。

## What Changes

- 編輯模式下，點擊按鈕本體（任意位置）開啟 EditButtonModal，不再觸發語音或導航
- ✎ 符號從浮動 overlay 移至按鈕內部，緊貼 label 文字右側顯示
- 移除 `btn-edit-overlay` 浮動按鈕元素

## Non-Goals (optional)

- 不修改非編輯模式下的按鈕行為（語音、導航不變）
- 不修改 VSD 熱點在編輯模式下的行為
- 不改變 EditButtonModal 的欄位或儲存邏輯

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `caregiver-edit-mode`: 編輯模式下按鈕點擊行為從「觸發語音/導航」改為「開啟編輯 modal」；✎ 提示改為內嵌於按鈕文字旁
- `button-editing`: 開啟 EditButtonModal 的觸發方式從「點擊 ✎ overlay」改為「點擊整個按鈕」

## Impact

- Affected specs: `caregiver-edit-mode`, `button-editing`
- Affected code:
  - `src/features/board/BoardButton.jsx` — 新增 `isEditMode` prop 的行為分支；`onEdit` callback；✎ 符號內嵌渲染
  - `src/features/board/GridView.jsx` — `handleButtonClick` 在編輯模式呼叫 `setEditingButton`；移除 `btn-edit-overlay` JSX
  - `src/features/board/BoardButton.css` — 移除 overlay 相關樣式；新增 ✎ 內嵌樣式
