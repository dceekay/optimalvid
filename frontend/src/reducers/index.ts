import { combineReducers } from '@reduxjs/toolkit';

// Placeholder reducer (replace with your real reducers)
const exampleReducer = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, value: state.value + 1 };
    case 'DECREMENT':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// Combine all reducers here
const rootReducer = combineReducers({
  example: exampleReducer, // Add your actual reducers here
});

export default rootReducer;
