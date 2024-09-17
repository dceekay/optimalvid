import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Ensure you have this file

// Create the Redux store
const store = configureStore({
  reducer: rootReducer,
});

export default store;
