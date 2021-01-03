import {
  configureStore,
  createSlice,
  PayloadAction,
  getDefaultMiddleware,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { Todo, TodosInitialState } from './type';
import * as api from '../api';

const todosInitialState: TodosInitialState = {
  todos: [],
  status: null,
};

export const loadTodosActionCreator = createAsyncThunk<Todo[], void, {}>(
  'todos/load',
  async (arg, { getState, requestId, rejectWithValue }) => {
    try {
      const todos = await api.fetchLoadTodos();
      return todos;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (
        state,
        {
          payload,
        }: PayloadAction<{ id: number; title: string; isCompleted: boolean }>
      ) => {
        state.todos.push(payload);
      },
      // NOTE: Reducer는 반드시 Pure하게.
      prepare: ({ title }: { title: string }) => ({
        payload: {
          id: Date.now(),
          title,
          isCompleted: false,
        },
      }),
    },
    edit: (state, action: PayloadAction<{ id: number; title: string }>) => {
      const { payload } = action;
      const todoToEdit = state.todos.find((todo) => todo.id === payload.id);

      if (todoToEdit) {
        todoToEdit.title = payload.title;
      }
    },
    toggle: (
      state,
      { payload }: PayloadAction<{ id: number; isCompleted: boolean }>
    ) => {
      const todoToToggle = state.todos.find((todo) => todo.id === payload.id);

      if (todoToToggle) {
        todoToToggle.isCompleted = !todoToToggle.isCompleted;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: number }>) => {
      const index = state.todos.findIndex((todo) => todo.id === payload.id);

      if (index !== -1) {
        state.todos.splice(index, 1);
      }
    },
  },
  extraReducers: {
    [loadTodosActionCreator.pending.type]: (state, action) => {
      state.status = 'loading';
    },
    [loadTodosActionCreator.fulfilled.type]: (state, action) => {
      state.todos = action.payload;
      state.status = 'success';
    },
    [loadTodosActionCreator.rejected.type]: (state, action) => {
      state.status = 'failed';
    },
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null, // NOTE: Not object, Primitive. Not using immer.
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
}; // NOTE: Auto combine

// export default configureStore({
//   reducer,
// });

const middleware = [...getDefaultMiddleware(), logger];
export default configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});
