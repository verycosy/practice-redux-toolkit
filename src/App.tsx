import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import {
  createTodoActionCreator,
  editTodoActionCreator,
  toggleTodoActionCreator,
  deleteTodoActionCreator,
  selectTodoActionCreator,
  loadTodosActionCreator,
} from './sample/redux-toolkit';
import { AppDispatch } from './sample/type';

function App() {
  const dispatch: AppDispatch = useDispatch();

  const loadTodos = async () => {
    const loadResult = await dispatch(loadTodosActionCreator());

    if (loadTodosActionCreator.fulfilled.match(loadResult)) {
      //
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return <div>Start</div>;
}

export default App;
