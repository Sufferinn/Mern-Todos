import { Link, NavLink, useNavigate } from 'react-router-dom';
import './header.scss'
import { HiOutlineLogin } from "react-icons/hi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { FcTodoList } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/AuthSlice';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { todoApi } from '../features/todo/todoApi';

export default function Header() {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [, setLoggedUser] = useLocalStorage('user')
  const navigate = useNavigate()

  const handlerLogout = () => {
    setLoggedUser(null)
    dispatch(logout())
    // сброс todo кэша
    dispatch(todoApi.util.resetApiState())
    navigate("/login");
  }

  return (
   
      <header className="d-flex align-items-center justify-content-between justify-content-md-between py-3 mb-4 border-bottom">
        <ul className="nav col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <Link to="/" className="nav-link px-2 link-secondary">
                <FcTodoList className='mx-2'/>
              TODO
            </Link>
          </li>
        </ul>
        <div className="col-md-4 text-end d-flex justify-content-end" style={{minWidth: "fit-content"}}>
        {user ? (<button  
          onClick={handlerLogout}
        type="button" className="btn btn-outline-primary align-items-center">
                Выйти <FiLogOut/>
              </button>) : (<>
              <NavLink to="/login" type="button" className="btn btn-outline-primary me-2">
                Войти <HiOutlineLogin/>
              </NavLink>
          
         
                <NavLink to="/register" type="button" className="btn btn-outline-primary ">
                  Регистрация <AiOutlineUserAdd/>
                </NavLink>
            </>)}
            
       
        </div>
      </header>
  );
}
