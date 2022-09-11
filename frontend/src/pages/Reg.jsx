import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import '../assets/reg.scss'
import { registerUser } from "../features/auth/AuthSlice";
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const validate = {
  name: {
    required: 'Введите имя пользователя',
    minLength: {
      value: 3,
      message: 'Имя слишком короткое'
    }
  },
  email: {
    required: 'Введите email',
    
  },
  password: {
    required: 'Введите пароль',
    minLength: {
      value: 3,
      message: 'Пароль очень короткий'
    }
  },
  password2: {
    required: 'Введите повторно пароль',
    deps: 'password'
  }
}

export default function Reg() {
  // hook form
  const { register, handleSubmit, formState: {errors , submitCount}, getValues } = useForm({reValidateMode: 'onSubmit'});
  // hooks Redux
  const { user, error: errUser, isLoading } =  useSelector(state => state.auth)
  const dispatch = useDispatch()
  // hook Router
  const navigate = useNavigate()
  // custom hook 
  const [, setLoggedUser] =  useLocalStorage('user')
 

  // Handler form submit
  const onSubmit = data => {
    const {password2, ...user} = data
    console.log(user);
    dispatch(registerUser(user))
  }

  // antiDouble call
  const shouldAlert = useRef(0)
  // Строгий режим вызывает useEffect два раза , ищем зависимость которая изменяется только про отправке формы, в данном примере - submitCount
  // Далее просто смотрим изменился ли submitCount при втором вызове useEffect, если нет - не вызываем toast
  // Alert error validate form
  useEffect(() =>  {
    console.log('submitCount', submitCount);
    if(shouldAlert.current !== submitCount && (Object.keys(errors).length || errUser)) {
      shouldAlert.current = submitCount
      toast.error(  errors.name?.message || errors.email?.message || errors.password?.message || errors.password2?.message || errUser );
    }
  }, [submitCount, errors, errUser])

  useEffect(() => {
    if(user) {
      setLoggedUser(user)
      navigate('/')
    }
  }, [user, navigate, setLoggedUser])
  
  return (
    <div className='reg'>
      <div className="form-signin w-100 m-auto text-center ">
        <form onSubmit={handleSubmit(onSubmit)} >
          <h1 className="h3 mb-3 fw-normal">Форма Регистрации</h1>
  
          <div className="form-floating first">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="Name"
              {...register('name', validate.name)}
            />
            <label  htmlFor="floatingInput">Имя</label>
          </div>
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
          <div className="form-floating last">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password" 
              {...register('password2', {...validate.password2, validate: value => value === getValues("password") || 'Пароли не совпадают',})}
            />
            <label htmlFor="floatingPassword">Повторите пароль</label>
          </div>
  
          {/* <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="rememberMe" /> Запомнить меня
            </label>
          </div> */}
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Зарегистрироваться
          </button>
          <p className="mt-5 mb-3 text-muted">&copy; 2022 MERN TODO</p>
        </form>
       
      </div>
      
    </div>
    
  );
}
