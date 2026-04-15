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
    deleteButton(state, action) {
      const { boardId, buttonId } = action.payload;
      const board = state.byId[boardId];
      if (!board) return;
      board.buttons = board.buttons.filter((btn) => btn.id !== buttonId);
      if (board.grid?.order) {
        const cols = board.grid.columns || board.grid.order[0]?.length || 1;
        const rows = board.grid.rows || board.grid.order.length || 1;
        const flat = board.grid.order.flat().filter((cell) => cell !== null && cell !== buttonId);
        const newOrder = [];
        for (let r = 0; r < rows; r++) {
          const row = [];
          for (let c = 0; c < cols; c++) {
            row.push(flat[r * cols + c] ?? null);
          }
          newOrder.push(row);
        }
        board.grid.order = newOrder;
      }
    },
    deleteBoard(state, action) {
      const boardId = action.payload;
      delete state.byId[boardId];
      state.allIds = state.allIds.filter((id) => id !== boardId);
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

export const { addBoard, updateBoard, deleteButton, deleteBoard } = boardSlice.actions;

export const selectBoardById = (state, boardId) => state.boards.byId[boardId];
export const selectAllBoardIds = (state) => state.boards.allIds;

export default boardSlice.reducer;
