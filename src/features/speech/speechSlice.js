import { createSlice } from '@reduxjs/toolkit';

const speechSlice = createSlice({
  name: 'speech',
  initialState: {
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0,
    preferredLang: 'zh-TW',
  },
  reducers: {
    setRate(state, action) {
      state.rate = action.payload;
    },
    setPitch(state, action) {
      state.pitch = action.payload;
    },
    setVolume(state, action) {
      state.volume = action.payload;
    },
  },
});

export const { setRate, setPitch, setVolume } = speechSlice.actions;
export const selectSpeechSettings = (state) => state.speech;

export default speechSlice.reducer;
