import { configureStore } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import boardReducer from '../features/board/boardSlice';
import speechReducer from '../features/speech/speechSlice';
import predictionReducer from '../features/prediction/predictionSlice';
import caregiverReducer from '../features/caregiver/caregiverSlice';

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    boards: boardReducer,
    speech: speechReducer,
    prediction: predictionReducer,
    caregiver: caregiverReducer,
  },
});
