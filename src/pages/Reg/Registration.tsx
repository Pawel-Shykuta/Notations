import React, { useState } from "react";
import styles from './RegistrationStyle.module.css';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';

import { useNavigate } from "react-router-dom";

import { User } from '../Login/Login';
import { addUserWithEmailAsId } from '../../services/Auntification/Auntification';

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [logUser, setLogUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    password: '',
  });

  const BottonChange = async () => {
    setLoading(true);
    setErrorMessage("");

    const result = await addUserWithEmailAsId (logUser.name, logUser.email, logUser.password);
    setLoading(false);

    if (result) {
      navigate('/');
    } else {
      setErrorMessage("Ошибка при регистрации. Попробуйте еще раз.");
    }
  };

  const InputChange = (field: string, value: string) => {
    setLogUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className={styles.loginWrapper}>
      <h1>Registration</h1>

      <label htmlFor="name">Введите ваш name</label>
      <Input 
        type='name'
        value={logUser.name}
        placeholder="Введите ваш name"
        onChangee={(value) => InputChange('name', value)}
      />

      <label htmlFor="email">Введите ваш email</label>
      <Input 
        type='email'
        value={logUser.email}
        placeholder="Введите ваш email"
        onChangee={(value) => InputChange('email', value)}
      />

      <label htmlFor="password">Введите ваш пароль</label>
      <Input 
        type="password"
        value={logUser.password}
        placeholder="Введите ваш пароль"
        onChangee={(value) => InputChange('password', value)}
      />
      
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <Button onClick={BottonChange}>
        {loading ? <Loader /> : "Registration"}
      </Button>
      
      <p className={styles.p} onClick={() => navigate('/')}> Зарегистрироваться </p>
    </div>
  );
};

export default Registration;
