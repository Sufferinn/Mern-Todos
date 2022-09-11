import { useEffect, useRef, useState } from 'react';
import { BsCalendarEvent } from 'react-icons/bs';
import { useAddTodoMutation } from '../features/todo/todoApi';

export default function TextInput() {
    const [inputShow, setInputShow] = useState(false);
    const [newTodo, setNewTodo] = useState('');
    const textareaRef = useRef(null);

    // POST Todo
    const [addTodo, {isError} ] =  useAddTodoMutation()
    async function handleAddTodo() {
        if(newTodo) {
            await addTodo({text: newTodo})
            setNewTodo('')
            setInputShow(false);
        }
    }
  
    function handleClickInput() {
        setInputShow(true);
    }

    useEffect(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [inputShow, textareaRef])
  
  return (
    <label
    style={{cursor: 'pointer'}}
    onClick={() => handleClickInput()}
    className="list-group-item d-flex gap-3 bg-light"
  >
    <input
      className="form-check-input form-check-input-placeholder bg-light flex-shrink-0 pe-none"
      disabled
      type="checkbox"
      value=""
      style={{ fontSize: '1.375em' }}
    />

    {inputShow ? (
        <div className='row w-100 px-2 justify-content-end'>
      <textarea
      onChange={e => setNewTodo(e.target.value)}
        ref={textareaRef}
        className="form-control "
        id="floatingTextarea"
        rows={1}
        value={newTodo}
      ></textarea>
       <div className='mt-2 justify-content-end d-flex col'><button onClick={handleAddTodo} type="button" className="btn btn-primary">Сохранить</button></div>
      </div>
    ) : (
      <span className="pt-1 form-checked-content">
        <span
          className="w-100"
        >
          Добавить задачу...
        </span>
        <small className="d-block text-muted">
          <BsCalendarEvent width="1em" height="1em" className="bi me-1" />
          Choose list...
        </small>
      </span>
    )}
  </label>
  )
}