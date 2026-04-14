## Why

編輯模式下「＋ 新增按鈕」在 GridView 底部、「＋ 新增頁面」在 NavigationBar 頂部，兩個新增動作分散在畫面兩端，視覺動線不一致，照護者需要在上下兩個區域之間切換注意力。

## What Changes

- 將「＋ 新增頁面」按鈕從 `NavigationBar` 移除
- 在 `GridView` 底部將「＋ 新增頁面」與「＋ 新增按鈕」並排顯示（同一列）
- `AddBoardModal` 的觸發狀態（`showAddBoardModal`）從 `NavigationBar` 移至 `GridView`

## Non-Goals (optional)

- 不改變「＋ 新增頁面」或「＋ 新增按鈕」的功能邏輯（modal 內容不變）
- 不移動「完成/編輯」切換按鈕（留在 NavigationBar）
- 不影響 VSD 板面（GridView 以外的板面類型）

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `caregiver-edit-mode`: NavigationBar 的編輯模式控制區不再包含「＋ 新增頁面」按鈕；GridView 底部新增「＋ 新增頁面」並排於「＋ 新增按鈕」
- `board-creation`: 「＋ 新增頁面」的觸發點從 NavigationBar 改為 GridView 底部

## Impact

- Affected specs: `caregiver-edit-mode`, `board-creation`
- Affected code:
  - `src/features/navigation/NavigationBar.jsx` — 移除 `＋ 新增頁面` 按鈕、`showAddBoardModal` state、`AddBoardModal` import 與渲染
  - `src/features/navigation/NavigationBar.css` — 移除 `.nav-add-board` 樣式（若存在）
  - `src/features/board/GridView.jsx` — 新增 `showAddBoardModal` state、`AddBoardModal` import、底部並排按鈕列
  - `src/features/board/GridView.css` — 新增底部並排按鈕容器樣式
