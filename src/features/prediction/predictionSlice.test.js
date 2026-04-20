import test from 'node:test';
import assert from 'node:assert/strict';

import reducer, { computeRecommendations, recordClick } from './predictionSlice.js';

test('recordClick stores buttonId, boardId, and timestamp', () => {
  const originalNow = Date.now;
  Date.now = () => 1710000000000;

  try {
    const nextState = reducer(undefined, recordClick({ buttonId: 'btn-son', boardId: 'family' }));

    assert.deepEqual(nextState.clickHistory, [
      {
        buttonId: 'btn-son',
        boardId: 'family',
        timestamp: 1710000000000,
      },
    ]);
  } finally {
    Date.now = originalNow;
  }
});

test('recordClick trims click history to the most recent 500 entries', () => {
  const originalNow = Date.now;
  Date.now = () => 1710000001234;

  try {
    const previousState = {
      clickHistory: Array.from({ length: 500 }, (_, index) => ({
        buttonId: `btn-${index}`,
        boardId: 'family',
        timestamp: index,
      })),
      recommendations: [],
    };

    const nextState = reducer(previousState, recordClick({ buttonId: 'btn-new', boardId: 'family' }));

    assert.equal(nextState.clickHistory.length, 500);
    assert.equal(nextState.clickHistory[0].buttonId, 'btn-1');
    assert.deepEqual(nextState.clickHistory.at(-1), {
      buttonId: 'btn-new',
      boardId: 'family',
      timestamp: 1710000001234,
    });
  } finally {
    Date.now = originalNow;
  }
});

test('computeRecommendations prioritizes related speakable buttons and excludes recent clicks', () => {
  const board = {
    id: 'family',
    buttons: [
      { id: 'btn-a', label: '老婆', ext_voco_related_button_ids: ['btn-c'] },
      { id: 'btn-b', label: '兒子', ext_voco_related_button_ids: [] },
      { id: 'btn-c', label: '孫子', ext_voco_related_button_ids: [] },
      { id: 'btn-d', label: '媳婦', ext_voco_related_button_ids: [] },
      { id: 'nav-home', label: '首頁', load_board: { id: 'root' } },
    ],
  };

  const clickHistory = [
    { buttonId: 'btn-d', boardId: 'family', timestamp: 1 },
    { buttonId: 'btn-a', boardId: 'family', timestamp: 2 },
    { buttonId: 'btn-b', boardId: 'family', timestamp: 3 },
    { buttonId: 'btn-c', boardId: 'medical', timestamp: 4 },
  ];

  const recommendations = computeRecommendations(board, clickHistory);

  assert.deepEqual(recommendations, ['btn-c', 'btn-d']);
});

test('computeRecommendations returns an empty list when the current board has no click history', () => {
  const board = {
    id: 'places',
    buttons: [
      { id: 'btn-hospital', label: '醫院' },
      { id: 'btn-bank', label: '銀行' },
    ],
  };

  assert.deepEqual(computeRecommendations(board, []), []);
  assert.deepEqual(
    computeRecommendations(board, [{ buttonId: 'btn-son', boardId: 'family', timestamp: 1 }]),
    []
  );
});
