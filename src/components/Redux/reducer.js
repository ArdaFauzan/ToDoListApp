import {combineReducers} from '@reduxjs/toolkit';

const initialDashboardState = {
  isDeleteMode: false,
  todos: [],
  checkedIds: [],
  imageUri: '',
  loggedOut: false,
};

const DashboardReducer = (state = initialDashboardState, action) => {
  switch (action.type) {
    case 'SET_DELETEMODE':
      return {
        ...state,
        isDeleteMode: action.inputValue,
      };
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.inputValue,
      };
    case 'ADD_CHECKED_ID':
      if (!state.checkedIds.includes(action.inputValue)) {
        return {
          ...state,
          checkedIds: [...state.checkedIds, action.inputValue],
        };
      }
      return state;
    case 'REMOVE_CHECKED_ID':
      return {
        ...state,
        checkedIds: state.checkedIds.filter(id => id !== action.inputValue),
      };
    case 'CLEAR_CHECKED_IDS':
      return {
        ...state,
        checkedIds: [],
      };
    case 'SET_IMAGE_URI':
      return {
        ...state,
        imageUri: action.inputValue,
      };
    case 'SET_LOGGED_OUT':
      return {
        ...state,
        loggedOut: action.inputValue,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  DashboardReducer,
});

export default rootReducer;
