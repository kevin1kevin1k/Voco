# Voco 驗證流程

## 自動化驗證

在提交與 review 前，依序執行：

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run build
npm run verify:pwa
npm run verify:lighthouse
```

## 指令說明

1. `npm run lint`
   - 驗證 ESLint 規則，避免未使用變數、React hooks 錯誤與基本語法問題。
2. `npm run test:unit`
   - 驗證 OBF parsing、navigation reducer、prediction logic 與 speech helper。
3. `npm run test:e2e`
   - 驗證照護者新增頁面、Grid 顯示、User Mode 主分類切換、Grid 發聲、VSD 熱點發聲與返回/首頁流程。
4. `npm run build`
   - 建立 production build，並由 `vite-plugin-pwa` 產生 service worker。
5. `npm run verify:pwa`
   - 需先執行 `npm run build`。
   - 檢查 `public/manifest.json` 必要欄位、192/512 icons、住家場景資產、`dist/sw.js` 與 `dist/workbox-*.js`。
6. `npm run verify:lighthouse`
   - 自動執行 build、啟動 Vite preview、使用 Playwright Chromium 跑 Lighthouse。
   - Lighthouse 12 已移除獨立 PWA category，因此此指令驗證 `accessibility` 與 `best-practices`，PWA installability artifact 由 `verify:pwa` 負責。
   - 預設門檻：`accessibility >= 90`、`best-practices >= 80`。

## 手動驗證

1. 離線重新載入
   - 執行 `npm run build` 與 `npm run preview`。
   - 在瀏覽器開啟 preview URL，先完整載入首頁與住家板面。
   - 透過 DevTools Application 或 Network 模擬 offline 後重新整理。
   - 預期結果：App shell 可重新載入，首頁與內建板面資產仍可顯示。

2. 主畫面安裝提示
   - 使用支援 PWA install prompt 的 Chromium 瀏覽器開啟 production preview。
   - 檢查瀏覽器網址列或 install UI。
   - 預期結果：App 顯示可安裝，安裝後以 standalone 視窗啟動，名稱為 `Voco`。

3. 鍵盤與焦點
   - 使用 `Tab` 依序移動主導航、Grid 按鈕與 VSD 熱點。
   - 使用 `Enter` 或 `Space` 觸發可點擊項目。
   - 預期結果：焦點樣式清楚可見，主要按鈕與熱點可透過鍵盤操作。

4. 語音輸出
   - 在真實裝置或瀏覽器點擊 `家人 > 兒子` 與 `住家 > 電視`。
   - 預期結果：瀏覽器朗讀 `兒子` 與 `我想看電視`；若沒有 `zh-TW` voice，仍不應靜默失敗。
