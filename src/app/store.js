import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import navigationReducer from '../features/navigation/navigationSlice';
import boardReducer, { addBoard, updateBoard, deleteButton, deleteBoard } from '../features/board/boardSlice';
import speechReducer from '../features/speech/speechSlice';
import predictionReducer from '../features/prediction/predictionSlice';
import caregiverReducer from '../features/caregiver/caregiverSlice';
import { saveBoardsToStorage } from '../utils/boardStorage';

const listenerMiddleware = createListenerMiddleware();

// Persist boards to localStorage only when user explicitly adds/modifies a board
listenerMiddleware.startListening({
  actionCreator: addBoard,
  effect: (_, listenerApi) => {
    saveBoardsToStorage(listenerApi.getState().boards);
  },
});
listenerMiddleware.startListening({
  actionCreator: updateBoard,
  effect: (_, listenerApi) => {
    saveBoardsToStorage(listenerApi.getState().boards);
  },
});
listenerMiddleware.startListening({
  actionCreator: deleteButton,
  effect: (_, listenerApi) => {
    saveBoardsToStorage(listenerApi.getState().boards);
  },
});
listenerMiddleware.startListening({
  actionCreator: deleteBoard,
  effect: (_, listenerApi) => {
    saveBoardsToStorage(listenerApi.getState().boards);
  },
});

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    boards: boardReducer,
    speech: speechReducer,
    prediction: predictionReducer,
    caregiver: caregiverReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});
