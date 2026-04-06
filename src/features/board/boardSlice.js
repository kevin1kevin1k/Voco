import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadAllBoards } from '../../utils/obfParser';

export const fetchBoards = createAsyncThunk('boards/fetchAll', async () => {
  return await loadAllBoards();
});

const boardSlice = createSlice({
  name: 'boards',
  initialState: {
    byId: {},
    allIds: [],
    status: 'idle',
  },
  reducers: {
    addBoard(state, action) {
      const board = action.payload;
      state.byId[board.id] = board;
      if (!state.allIds.includes(board.id)) {
        state.allIds.push(board.id);
      }
    },
    updateBoard(state, action) {
      const board = action.payload;
      if (state.byId[board.id]) {
        state.byId[board.id] = board;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.byId = action.payload.byId;
        state.allIds = action.payload.allIds;
      });
  },
});

export const { addBoard, updateBoard } = boardSlice.actions;

export const selectBoardById = (state, boardId) => state.boards.byId[boardId];
export const selectAllBoardIds = (state) => state.boards.allIds;

export default boardSlice.reducer;
