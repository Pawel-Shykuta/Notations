import React, { useState } from "react";
import styles from './LoginStyle.module.css';

import { useNavigate } from "react-router-dom";
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';

import { fetchUsersFromFirestore } from '../../services/Auntification/Auntification';

export interface User {
  id: string,
  name: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [regUser, setRegUser] = useState({
    email: '',
    password: '',
  });

  const BottonChange = async () => {
    setLoading(true);  
    const isAuthenticated = await fetchUsersFromFirestore(regUser.email, regUser.password);

    if (isAuthenticated) {
      alert('Login successful');
      navigate('/LoockFile');
    } else {
      if (regUser.email === '' || regUser.password === '') {
        alert('Please fill in all fields!');
        setLoading(false);
        return;
      }
      alert('Incorrect credentials!');
    }
    setLoading(false);
  };

  const InputChange = (field: string, value: string) => {
    setRegUser((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <div className={styles.loginWrapper}>
      <h1>Login</h1>

      <label htmlFor="email">Enter your email</label>
      <Input 
        type='email'
        value={regUser.email}
        placeholder="Enter your email"
        onChangee={(value) => InputChange('email', value)}
      />

      <label htmlFor="password">Enter your password</label>
      <Input 
        type="password"
        value={regUser.password}
        placeholder="Enter your password"
        onChangee={(value) => InputChange('password', value)}
      />

      <Button onClick={BottonChange}>
        {loading ? <Loader /> : "Login"}
      </Button>

      <p className={styles.p} onClick={() => navigate('/reg')}>Don't have an account? Register</p>
    </div>
  );
};

export default Login;
