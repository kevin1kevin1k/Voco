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

function isSpeakableButton(button) {
  return Boolean(button) && !button.load_board;
}

/**
 * 根據點擊歷史與語意關聯計算同一 board 中的推薦按鈕
 */
export function computeRecommendations(board, clickHistory) {
  if (!board || !board.buttons) return [];

  const candidates = board.buttons.filter(isSpeakableButton);
  if (candidates.length === 0) return [];

  const boardClicks = clickHistory.filter((c) => c.boardId === board.id);
  if (boardClicks.length === 0) return [];

  const clickCounts = {};
  for (const click of boardClicks) {
    clickCounts[click.buttonId] = (clickCounts[click.buttonId] || 0) + 1;
  }

  const recentSeeds = boardClicks.slice(-3).reverse().map((click) => click.buttonId);
  const recentClicks = new Set(boardClicks.slice(-2).map((click) => click.buttonId));

  const scoreById = new Map();
  for (const candidate of candidates) {
    if (recentClicks.has(candidate.id)) continue;

    let score = 0;
    for (const [seedIndex, seedId] of recentSeeds.entries()) {
      if (seedId === candidate.id) continue;
      const seed = candidates.find((button) => button.id === seedId);
      if (!seed) continue;

      const relatedIds = seed.ext_voco_related_button_ids || [];
      if (relatedIds.includes(candidate.id)) {
        score += 6 - seedIndex * 1.5;
      }
    }

    const usage = clickCounts[candidate.id] || 0;
    score += Math.max(0, 3 - usage);
    if (usage > 0) {
      score -= usage * 0.35;
    }

    scoreById.set(candidate.id, score);
  }

  const hasSemanticSignal = [...scoreById.values()].some((score) => score >= 4);
  const sorted = [...candidates]
    .filter((button) => !recentClicks.has(button.id))
    .sort((a, b) => {
      const aScore = scoreById.get(a.id) || 0;
      const bScore = scoreById.get(b.id) || 0;

      if (hasSemanticSignal && bScore !== aScore) {
        return bScore - aScore;
      }

      const aUsage = clickCounts[a.id] || 0;
      const bUsage = clickCounts[b.id] || 0;
      if (aUsage !== bUsage) {
        return aUsage - bUsage;
      }

      if (!hasSemanticSignal && bScore !== aScore) {
        return bScore - aScore;
      }

      return a.label.localeCompare(b.label, 'zh-Hant');
    });

  return sorted.slice(0, 3).map((btn) => btn.id);
}

export default predictionSlice.reducer;
