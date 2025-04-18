import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import style from './LoockEmail.module.css';
import { addUserWithEmailAsId } from '../../services/Auntification/Auntification';
import { useNavigate } from "react-router-dom";
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';

const LoockEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInputPass, logUser } = location.state;

  const [userInputEmailPass, setUserInputEmailPass] = useState<string>('');
  const [newUserInputPass, setNewUserInputPass] = useState<string>('');  

  const [shoveNew, setShoveNew] = useState<boolean>(false);
  const [loockPass, setLoockPass] = useState<number>(30);

  
  const sendEmailToUser = () => {
    const generatedPass = uuidv4().slice(0, 5);  
    setNewUserInputPass(generatedPass);  
    setLoockPass(30); 
    const userMessage = `Your new temporary password: ${generatedPass}. Please do not share it with anyone — it can be used to access your account.`;
    

    const formData = {
      name: logUser.name,
      email: logUser.email,
      message: userMessage,
    };

    emailjs.send(
      'service_ij4pfvc',    
      'template_a8srxu8',   
      formData,             
      'teQOqy6RyX_aRgJf2'   
    )
    .then(
      (result) => {
        console.log('Success:', result.text); 
        setShoveNew(false); 
      },
      (error) => {
        console.log('Error:', error.text);
      }
    );
  }

 
  const verifyPassword = () => {
    if(!userInputEmailPass.trim()){
      return
    }
    if (userInputEmailPass === userInputPass || userInputEmailPass === newUserInputPass) {
      alert('Password is correct');
      addUserWithEmailAsId( logUser.name,logUser.email,logUser.password)
      navigate('/');
    }else {
      alert('Incorrect password');
      setUserInputEmailPass('');
    }
  };


  useEffect(() => {
    if (loockPass > 0 && !shoveNew) {
      const interval = setInterval(() => {
        setLoockPass((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShoveNew(true); 
            return 30; 
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);  
    }
  }, [loockPass, shoveNew]);

  return (
    <div className={style.ContainerFormForLoockEmail}>
      <div className={style.FormForLoockEmail}>
        <h1 className={style.Title}>Enter the password sent to your email</h1>
        <input
          className={style.InputField}
          type="text"
          placeholder="Enter password"
          maxLength={5}
          onChange={(e) => setUserInputEmailPass(e.target.value)}
          value={userInputEmailPass}
        />
        <button className={style.SubmitButton} onClick={verifyPassword}>Verify</button>
        {!shoveNew ? (
          <h3>Пароль появится через {loockPass} секунд</h3>
        ) : (
          <h3 className={style.sendNewPass} onClick={sendEmailToUser}>Отправить пароль повторно</h3>
        )}
      </div>
    </div>
  );
};

export default LoockEmail;
