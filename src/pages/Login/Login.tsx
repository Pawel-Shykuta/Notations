import React, { useState } from "react";
import styles from './LoginStyle.module.css';

import { useNavigate } from "react-router-dom";
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';

import {fetchUsersFromFirestore} from '../../services/Auntification/Auntification'



export interface User {
    id:string,
    name: string;
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    const [regUser,setRegUser] = useState({
            email:'',
            password:'',
        })

    const BottonChange =  async() => {
        setLoading(true);  
        const isAuthenticated = await fetchUsersFromFirestore(regUser.email ,regUser.password)

        if (isAuthenticated) {
          alert('Авторизация успешна');
          navigate('/LoockFile')
        } else {
            if(regUser.email  === '' ||regUser.password ==='' ){
                alert('не все поля заполнены!')
                setLoading(false);
                return
            }
            alert('Неверные данные!');
            
        }
      setLoading(false);
    };

    const InputChange = (field: string, value: string) => {
        setRegUser((prevState) => ({ ...prevState, [field]: value }));
    };


    return(
      <div className={styles.loginWrapper}>
          <h1>Login</h1>
          <label htmlFor="email">Введите ваш email</label>
          <Input 
              type='email'
              value={regUser.email}
              placeholder="Введите ваш email"
              onChangee={(value) => InputChange('email', value)}
          />

          <label htmlFor="password">Введите ваш пароль</label>
          <Input 
              type="password"
              value={regUser.password}
              placeholder="Введите ваш пароль"
              onChangee={(value) => InputChange('password', value)}
          />
          <Button onClick={BottonChange}>
              {loading ? <Loader /> : "Login"}
          </Button>

          <p className={styles.p} onClick={() => navigate('/reg')}>Заругистрироваться</p>
      </div>
  )

    
};

export default Login;
