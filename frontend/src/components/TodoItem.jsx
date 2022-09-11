import { useState } from 'react';
import { BsCalendarEvent } from 'react-icons/bs';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import '../assets/todoItem.scss';
import {
  useEditTodoMutation,
  useRemoveTodoMutation,
} from '../features/todo/todoApi';

function formatDate(dateString) {
  let date = new Date(dateString);
  let formatter = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  return formatter.format(date);
}

export default function TodoItem({ todo }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDone, setIsDone] = useState(todo.status);
  const [textTodo, setTextTodo] = useState(todo.text);

  const [editTodo, { isError }] = useEditTodoMutation();
  const [removeTodo, { isError: isErr }] = useRemoveTodoMutation();
  async function handleChangeChecked(e) {
    setIsDone(e.currentTarget.checked);
    await editTodo({ ...todo, status: e.currentTarget.checked });
  }
  async function handleEditTodo() {
    if (textTodo !== todo.text) {
      await editTodo({ ...todo, text: textTodo });
    }
    setIsEdit(false);
  }
  async function handleRemoveTodo() {
    await removeTodo({ _id: todo._id });
  }

  return (
    <div className="list-group-item d-flex gap-3">
      <input
        className="form-check-input flex-shrink-0"
        type="checkbox"
        value=""
        checked={isDone}
        onChange={handleChangeChecked}
        style={{ fontSize: '1.375em' }}
      />
      <span className="pt-1 form-checked-content">
        {isEdit ? (
          <div className="row w-100 px-2 justify-content-end">
            <textarea
              onChange={(e) => setTextTodo(e.target.value)}
              className="form-control "
              id="floatingTextarea"
              rows={1}
              value={textTodo}
            ></textarea>
            <div className="mt-2 justify-content-end d-flex col">
              <button
                onClick={handleEditTodo}
                type="button"
                className="btn btn-primary"
              >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          <strong>{todo.text}</strong>
        )}

        <small className="d-block text-muted">
          <BsCalendarEvent width="1em" height="1em" className="bi me-1" />
          {formatDate(new Date(todo.createdAt))}
        </small>
      </span>

      {isDone ? (
        <FaRegTrashAlt className="editBtn" onClick={handleRemoveTodo} />
      ) : (
        <FaRegEdit className="editBtn" onClick={() => setIsEdit(true)} />
      )}
    </div>
  );
}
