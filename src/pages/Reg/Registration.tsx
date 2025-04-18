import React, { useState } from "react";
import styles from './RegistrationStyle.module.css';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { User } from '../Login/Login';
import emailjs from 'emailjs-com';

import {LoockEmailUsers} from '../../services/Auntification/Auntification';

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
  const [newEmail,setNewEmail] = useState<boolean>(false);



  const InputChange = (field: string, value: string) => {
    setLogUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const userInputPass = uuidv4().slice(0, 5);
  const userMessage = `Your temporary password: ${userInputPass}. Please do not share it with anyone — it can be used to access your account.`;

  const sendEmailToUser = () => {
    const formData = {
      name: logUser.name,
      email: logUser.email,
      message: userMessage,
    };

    emailjs.send(
      'service_ij4pfvc',    // Your Service ID
      'template_a8srxu8',   // Your Template ID
      formData,             // Form data
      'teQOqy6RyX_aRgJf2'   // Your User ID
    )
    .then(
      (result) => {
        console.log('Success:', result.text);
      },
      (error) => {
        console.log('Error:', error.text);
      }
    );
  }

  const handleRegisterClick = async () => {
    setLoading(true);
  
    if (
      logUser.name === '' || 
      logUser.email === '' || 
      logUser.password === ''
    ) {
      alert('Пожалуйста, заполните все поля');
      setLoading(false);
      return;
    }
  
    try {
      const emailExists = await LoockEmailUsers(logUser.email);
  
      if (emailExists) {
        alert('Этот email уже зарегистрирован');
      } else {
        await sendEmailToUser(); 
        navigate('/LoockEmail', { state: { userInputPass, logUser } });
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      alert('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.loginWrapper}>
      <h1>Registration</h1>
  
      <label htmlFor="name">Enter your name</label>
      <Input 
        type="name"
        value={logUser.name}
        placeholder="Enter your name"
        onChangee={(value) => InputChange('name', value)}
      />
  
      <label htmlFor="email">Enter your email</label>
      <Input 
        type="email"
        value={logUser.email}
        placeholder="Enter your email"
        onChangee={(value) => InputChange('email', value)}
      />
  
      <label htmlFor="password">Enter your password</label>
      <Input 
        type="password"
        value={logUser.password}
        placeholder="Enter your password"
        onChangee={(value) => InputChange('password', value)}
      />
      
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
  
      <Button onClick={handleRegisterClick}>
        {loading ? <Loader /> : "Register"}
      </Button>
      
      <p className={styles.p} onClick={() => navigate('/')}>Already have an account? Sign in</p>
    </div>
  );
  
};

export default Registration;
