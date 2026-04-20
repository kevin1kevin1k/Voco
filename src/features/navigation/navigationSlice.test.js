import test from 'node:test';
import assert from 'node:assert/strict';

import reducer, {
  goBack,
  goHome,
  navigateTo,
  selectCanGoBack,
  selectCurrentBoardId,
} from './navigationSlice.js';

test('navigateTo pushes the current board into history and updates currentBoardId', () => {
  const nextState = reducer(undefined, navigateTo('family'));

  assert.equal(nextState.currentBoardId, 'family');
  assert.deepEqual(nextState.history, ['root']);
});

test('goBack returns to the previous board when history exists and is a no-op otherwise', () => {
  const withHistory = {
    currentBoardId: 'medical',
    history: ['root', 'family'],
    rootBoardId: 'root',
  };

  const backState = reducer(withHistory, goBack());
  assert.equal(backState.currentBoardId, 'family');
  assert.deepEqual(backState.history, ['root']);

  const noHistoryState = reducer(
    {
      currentBoardId: 'root',
      history: [],
      rootBoardId: 'root',
    },
    goBack()
  );
  assert.equal(noHistoryState.currentBoardId, 'root');
  assert.deepEqual(noHistoryState.history, []);
});

test('goHome resets navigation history and selectors reflect current navigation state', () => {
  const stateAfterHome = reducer(
    {
      currentBoardId: 'places',
      history: ['root', 'family'],
      rootBoardId: 'root',
    },
    goHome()
  );

  const storeState = { navigation: stateAfterHome };
  assert.equal(stateAfterHome.currentBoardId, 'root');
  assert.deepEqual(stateAfterHome.history, []);
  assert.equal(selectCurrentBoardId(storeState), 'root');
  assert.equal(selectCanGoBack(storeState), false);
});
