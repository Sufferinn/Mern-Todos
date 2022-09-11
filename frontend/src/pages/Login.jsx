import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import '../assets/reg.scss'
import { login } from "../features/auth/AuthSlice";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const validate = {
  email: {
    required: 'Введите email',
  },
  password: {
    required: 'Введите пароль',
  }
}

export default function Login() {
  // hook form
  const { register, handleSubmit, formState: {errors , submitCount} } = useForm({reValidateMode: 'onSubmit'});
  // hook Router
  const navigate = useNavigate()
  // hooks Redux
  const { user, error: errResponse, isLoading } =  useSelector(state => state.auth)
  const dispatch = useDispatch()
  // custom hook 
  const [, setLoggedUser] =  useLocalStorage('user')
  
  // Handler form submit
  const onSubmit = data => {
    dispatch(login(data))
  }

  // antiDouble call
  const shouldAlert = useRef(0)
  // Строгий режим вызывает useEffect два раза , ищем зависимость которая изменяется только про отправке формы, в данном примере - submitCount
  // Далее просто смотрим изменился ли submitCount при втором вызове useEffect, если нет - не вызываем toast
  // Alert error validate form
  useEffect(() =>  {
    if(shouldAlert.current !== submitCount && (Object.keys(errors).length || errResponse)) {
      shouldAlert.current = submitCount
      toast.error( errors.email?.message || errors.password?.message || errResponse );
    }
  }, [submitCount, errors, errResponse])
 
  // Success login
  useEffect( () => {
    if(user) {
      setLoggedUser(user)
      toast.success('Добро пожаловать ' + user.name, {theme: "colored"})
      navigate('/')
    }
  }, [user, navigate, setLoggedUser])

  return (
    <div className='reg'>
    <div className="form-signin w-100 m-auto text-center ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="h3 mb-3 fw-normal">Форма Входа</h1>
        <div className="form-floating mid">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            {...register('email', validate.email)}
          />
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating mid">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            {...register('password', validate.password)}
          />
          <label htmlFor="floatingPassword">Пароль</label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Войти
        </button>
        <p className="mt-5 mb-3 text-muted">&copy; 2022 MERN TODO</p>
      </form>
     
    </div>
    
  </div>
  )
}