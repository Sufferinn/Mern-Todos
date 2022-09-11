import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Spinner from '../components/Spinner';
import { useGetTodosQuery } from '../features/todo/todoApi';
import TextInput from '../components/TextInput';
import TodoItem from '../components/TodoItem';

export default function Todos() {
  const navigate = useNavigate();
  const [loggedUser] = useLocalStorage('user');

  useEffect(() => {
    if (!(loggedUser !== null && typeof loggedUser === 'object' && loggedUser?.token)) {
      navigate('/login');
    }
  }, [loggedUser, navigate]);

  const { isLoading, data, error } = useGetTodosQuery();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }
   

  if(error) {
    return <div className="d-flex align-items-center flex-column">
    <p>Ошибка запроса </p>
    <h1>404</h1>
  </div>
  }

  return (
    <div className="list-group w-auto">
      {data.map((item) => (
        <TodoItem key={item._id} todo={item} />
      ))}
      <TextInput />
    </div>
  );
}
