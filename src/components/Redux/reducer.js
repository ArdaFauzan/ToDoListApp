import {combineReducers} from '@reduxjs/toolkit';

const initialDashboardState = {
  isDeleteMode: false,
  name: '',
  todos: [],
  checkedIds: [],
  imageUri: '',
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
    case 'ADD_CHECKED_ID':
      // Pastikan tidak menambahkan ID yang sudah ada
      if (!state.checkedIds.includes(action.inputValue)) {
        return {
          ...state,
          checkedIds: [...state.checkedIds, action.inputValue],
        };
      }
      return state;
    case 'REMOVE_CHECKED_ID':
      // Filter ID yang akan dihapus
      return {
        ...state,
        checkedIds: state.checkedIds.filter(id => id !== action.inputValue),
      };
    case 'CLEAR_CHECKED_IDS':
      // Kosongkan array checkedIds
      return {
        ...state,
        checkedIds: [],
      };
    case 'SET_IMAGE_URI':
      return {
        ...state,
        imageUri: action.inputValue,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  DashboardReducer,
});

export default rootReducer;
