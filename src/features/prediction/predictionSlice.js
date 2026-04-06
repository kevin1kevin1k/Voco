import { createSlice } from '@reduxjs/toolkit';

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    // { buttonId, boardId, timestamp }[]
    clickHistory: [],
    // 推薦的按鈕 ID 列表
    recommendations: [],
  },
  reducers: {
    recordClick(state, action) {
      const { buttonId, boardId } = action.payload;
      state.clickHistory.push({
        buttonId,
        boardId,
        timestamp: Date.now(),
      });
      // 保留最近 500 筆紀錄
      if (state.clickHistory.length > 500) {
        state.clickHistory = state.clickHistory.slice(-500);
      }
    },
    setRecommendations(state, action) {
      state.recommendations = action.payload;
    },
  },
});

export const { recordClick, setRecommendations } = predictionSlice.actions;

export const selectClickHistory = (state) => state.prediction.clickHistory;
export const selectRecommendations = (state) => state.prediction.recommendations;

/**
 * 根據點擊歷史計算同一 board 中的高頻按鈕
 * 回傳該 board 中「未常用但同類」的按鈕作為推薦
 */
export function computeRecommendations(board, clickHistory) {
  if (!board || !board.buttons) return [];

  const boardClicks = clickHistory.filter((c) => c.boardId === board.id);
  const clickCounts = {};
  for (const click of boardClicks) {
    clickCounts[click.buttonId] = (clickCounts[click.buttonId] || 0) + 1;
  }

  // 找出不常被點擊的按鈕作為推薦
  const sorted = [...board.buttons].sort(
    (a, b) => (clickCounts[a.id] || 0) - (clickCounts[b.id] || 0)
  );

  // 回傳點擊次數最少的前 3 個
  return sorted.slice(0, 3).map((btn) => btn.id);
}

export default predictionSlice.reducer;
