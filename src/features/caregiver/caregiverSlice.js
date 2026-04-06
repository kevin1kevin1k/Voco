import { createSlice } from '@reduxjs/toolkit';

const caregiverSlice = createSlice({
  name: 'caregiver',
  initialState: {
    isEditMode: false,
    usageLogs: [],
  },
  reducers: {
    toggleEditMode(state) {
      state.isEditMode = !state.isEditMode;
    },
    addUsageLog(state, action) {
      state.usageLogs.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    clearUsageLogs(state) {
      state.usageLogs = [];
    },
  },
});

export const { toggleEditMode, addUsageLog, clearUsageLogs } = caregiverSlice.actions;

export const selectIsEditMode = (state) => state.caregiver.isEditMode;
export const selectUsageLogs = (state) => state.caregiver.usageLogs;

export default caregiverSlice.reducer;
