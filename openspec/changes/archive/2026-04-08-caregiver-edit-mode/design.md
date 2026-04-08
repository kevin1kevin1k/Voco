## Context

Voco 的板面資料目前全部來自 `src/data/boards/*.obf.json` 靜態檔案，透過 `import.meta.glob` 在 build 時打包進來。`caregiverSlice` 已有 `isEditMode` flag，`boardSlice` 已有 `addBoard` / `updateBoard` reducer，但兩者尚未連接到任何 UI 或持久化機制。

照護者（長者的家人或看護）需要能在瀏覽器中直接新增、編輯板面和按鈕，且修改在重整後不消失。

## Goals / Non-Goals

**Goals:**
- 實作 localStorage 持久化，讓用戶編輯的板面資料在重整後保留
- 提供進入/離開編輯模式的 UI 入口（NavBar 右側）
- 實作編輯按鈕 label / vocalization 的 modal
- 實作新增按鈕到現有板面的 modal
- 實作新增新板面（名稱 + 空 Grid）的 modal
- 實作編輯現有板面名稱的 modal

**Non-Goals:**
- 不實作刪除按鈕或刪除板面（首版只做新增與編輯）
- 不實作按鈕圖片上傳（首版只做文字欄位）
- 不實作 VSD 熱點編輯（首版只做 Grid）
- 不實作多人協作或雲端同步
- 不實作照護者登入/鑑權

## Decisions

### localStorage 合併策略

**決定**：app 啟動時，先載入靜態 JSON boards，再讀取 localStorage 中的 `voco_boards` 鍵，以 localStorage 的板面覆蓋同 ID 的靜態板面，並追加靜態檔中沒有的新板面 ID。

**理由**：靜態板面是「內建預設」，localStorage 板面是「用戶客製化」。同 ID 時用戶版本優先，確保編輯生效。靜態板面不會被刪除，保留了 rollback 能力（清除 localStorage 可恢復原廠設定）。

**替代方案考慮**：只存 localStorage、不保留靜態板面 → 被否決，因為清空 localStorage 會讓 app 完全空白。

### localStorage 資料格式

**決定**：儲存整個板面物件的 map，key 為 `voco_boards`，value 為 `{ byId: {[boardId]: boardObject}, allIds: string[] }`，與 Redux `boardSlice` 的 state shape 一致。

**理由**：shape 一致讓合併邏輯簡單直接，不需要 transform。

### 持久化時機

**決定**：在每次 `addBoard` / `updateBoard` Redux action dispatch 後，透過 Redux store listener（`store.subscribe`）同步寫入 localStorage。

**理由**：不需要引入額外 middleware 或 Redux Persist 套件，`store.subscribe` 足夠應付此規模。寫入是同步的，localStorage 操作在此資料量下不會造成效能問題。

**替代方案考慮**：redux-persist → 被否決，引入額外依賴且功能超出需求。

### Modal 設計

**決定**：使用 4 個獨立 modal 元件（EditButtonModal、AddButtonModal、AddBoardModal、EditBoardNameModal），各自管理自己的表單狀態，透過 props 接收初始值與 onConfirm / onClose callback。

**理由**：各 modal 的欄位不同，分離元件讓每個保持簡單。共用一個通用 modal 框架（overlay + 確認/取消按鈕）但各自實作表單內容。

### 新按鈕的 ID 生成

**決定**：使用 `btn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` 生成唯一 ID。

**理由**：不需要 UUID 套件，此格式在單裝置單用戶場景下衝突機率可忽略。

### 新板面的 Grid 預設

**決定**：新建板面預設為 2×3 Grid（6 個空格），`ext_voco_display_type: 'grid'`，`grid.order` 為 `[[null, null, null], [null, null, null]]`。

**理由**：與現有 medical / places 板面結構一致，照護者熟悉這個預設尺寸。

### 編輯模式入口位置

**決定**：NavBar 右側新增「編輯」按鈕，進入編輯模式後變為「完成」按鈕，同時出現「＋ 新增頁面」按鈕。

**理由**：在 discuss 中與用戶確認選擇方案 A（NavBar 右側），不遮擋主要內容。

## Risks / Trade-offs

- [Risk] localStorage 容量限制（5MB）→ Mitigation：板面純文字 JSON，即使 100 個板面也遠低於上限，無需處理。
- [Risk] 靜態板面與 localStorage 板面在 Grid order 上可能不一致（靜態板面有既定 order，localStorage 新增的按鈕需追加到 order）→ Mitigation：`updateBoard` 時直接替換整個板面物件，order 由 UI 負責維護正確性。
- [Risk] 重整後 `import.meta.glob` 重新載入靜態板面，可能覆蓋 localStorage 的修改 → Mitigation：合併順序是「靜態先、localStorage 後」，localStorage 版本永遠優先，不會被覆蓋。
- [Risk] 4 個 modal 元件代碼重複 → Mitigation：抽取共用 `ModalShell` 元件提供 overlay + 標題 + 確認/取消按鈕，各 modal 只實作表單內容。
