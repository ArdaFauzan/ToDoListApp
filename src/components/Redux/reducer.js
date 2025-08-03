import {combineReducers} from '@reduxjs/toolkit';

const initialDashboardState = {
  isDeleteMode: false,
  todos: [],
  checkedIds: [],
  imageUri: '',
  loggedOut: false,
  user_id: '',
  token: '',
  isLoading: false,
};

const DashboardReducer = (state = initialDashboardState, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.inputValue,
      };
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
    case 'ADD_TODO':
      const newTodo = {
        id: action.inputValue.id || Date.now(),
        title: action.inputValue.title || '',
        date: action.inputValue.date || '',
        time: action.inputValue.time || '',
        completed: action.inputValue.completed || 0,
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    case 'UPDATE_TODO':
      const {id, updatedTodo} = action.payload;
      const updatedTodos = state.todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            title:
              updatedTodo.title !== undefined ? updatedTodo.title : todo.title,
            date: updatedTodo.date !== undefined ? updatedTodo.date : todo.date,
            time: updatedTodo.time !== undefined ? updatedTodo.time : todo.time,
            completed:
              updatedTodo.completed !== undefined
                ? updatedTodo.completed
                : todo.completed,
          };
        }
        return todo;
      });

      return {
        ...state,
        todos: updatedTodos,
      };
    case 'DELETE_TODO':
      const remainingTodos = state.todos.filter(
        todo => todo.id !== action.inputValue,
      );

      return {
        ...state,
        todos: remainingTodos,
      };
    case 'DELETE_CHECKED_TODOS':
      return {
        ...state,
        todos: state.todos.filter(todo => !state.checkedIds.includes(todo.id)),
        checkedIds: [],
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
    case 'SET_USER_ID':
      return {
        ...state,
        user_id: action.inputValue,
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.inputValue,
      };
    case 'RESET_STATE':
      return initialDashboardState;
    case 'MARK_TODO_COMPLETED':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.inputValue ? {...todo, completed: 1} : todo,
        ),
      };
    case 'MARK_TODO_INCOMPLETE':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.inputValue ? {...todo, completed: 0} : todo,
        ),
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  DashboardReducer,
});

export default rootReducer;
