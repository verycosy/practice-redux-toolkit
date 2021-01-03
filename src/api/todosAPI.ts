import axios from 'axios';
import { Todo } from '../sample/type';

export const fetchLoadTodos = async (): Promise<Todo[]> => {
  const { data } = await axios.get<Todo[]>(
    'https://jsonplaceholder.typicode.com/todos'
  );

  return data;
};
