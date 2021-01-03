import { Store } from 'redux';

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface TodosInitialState {
  todos: Todo[];
  status: string | null;
}

export type AppDispatch = typeof Store.dispatch;
