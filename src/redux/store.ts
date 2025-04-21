// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { combineReducers } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define audio slice
interface AudioState {
  audioResponse: string;
  errorMessage: string;
}

const initialAudioState: AudioState = {
  audioResponse: '',
  errorMessage: '',
};

const audioSlice = createSlice({
  name: 'audio',
  initialState: initialAudioState,
  reducers: {
    setAudioResponse(state, action: PayloadAction<string>) {
      state.audioResponse = action.payload;
      state.errorMessage = ''; // Clear error on success
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
  },
});

export const { setAudioResponse, setErrorMessage } = audioSlice.actions;

// Combine reducers
const reducer = combineReducers({
  audio: audioSlice.reducer,
});

// Configure store
export const store = configureStore({
  reducer,
});

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();