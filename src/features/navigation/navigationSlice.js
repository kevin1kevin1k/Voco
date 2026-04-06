import { createSlice } from '@reduxjs/toolkit';

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentBoardId: 'root',
    history: [],
    rootBoardId: 'root',
  },
  reducers: {
    navigateTo(state, action) {
      state.history.push(state.currentBoardId);
      state.currentBoardId = action.payload;
    },
    goBack(state) {
      if (state.history.length > 0) {
        state.currentBoardId = state.history.pop();
      }
    },
    goHome(state) {
      state.currentBoardId = state.rootBoardId;
      state.history = [];
    },
  },
});

export const { navigateTo, goBack, goHome } = navigationSlice.actions;

export const selectCurrentBoardId = (state) => state.navigation.currentBoardId;
export const selectCanGoBack = (state) => state.navigation.history.length > 0;

export default navigationSlice.reducer;
