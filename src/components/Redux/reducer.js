import {combineReducers} from '@reduxjs/toolkit';

const initialDashboardState = {
  isDeleteMode: false,
  name: '',
  todos: [],
};

const DashboardReducer = (state = initialDashboardState, action) => {
  switch (action.type) {
    case 'SET_DELETEMODE':
      return {
        ...state,
        isDeleteMode: action.inputValue,
      };
    case 'SET_NAME':
      return {
        ...state,
        name: action.inputValue,
      };
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.inputValue,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  DashboardReducer,
});

export default rootReducer;
