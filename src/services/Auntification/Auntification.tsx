

const projectId = 'users-279b7';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

const API_KEY = 'AIzaSyBqa_VQ2cwrO_UV0A5JNKxscR1dEeOSyTA';




export const AddUserToBd = async (name: string, email: string, password: string): Promise<boolean> => {
  if (name === '' || email === '' || password === '') {
    alert('Не все поля заполнены!');
    return false;
  }

  try {
  
    const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    });

    const authData = await authRes.json();
    console.log('Ответ от Firebase Auth:', authData); 

    if (!authRes.ok) {
      console.error('Ошибка регистрации:', authData.error.message);
      throw new Error(authData.error.message);
    }

    const userId = authData.localId;
    console.log('Получен ID пользователя:', userId);


    const url = `${baseUrl}/SecondUser/${encodeURIComponent(userId)}`;
    const data = {
      fields: {
        id: { stringValue: userId },
        name: { stringValue: name },
        email: { stringValue: email },
        lists: { arrayValue: { values: [] } }
      }
    };

    console.log('Отправка данных в Firestore:', data); 


    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Ошибка при записи в Firestore:', errText);
      throw new Error(errText);
    }

    console.log('Пользователь зарегистрирован!');
    return true;

  } catch (error) {
    console.log('Ошибка при регистрации:', error);
    alert('Ошибка при регистрации');
    return false;
  }
};


export const LoockUser = async (input: string, password: string): Promise<boolean> => {
  try {
    const trimmedInput = input.trim();
    let emailToUse = '';

   
    if (validateEmail(trimmedInput)) {
      emailToUse = trimmedInput;
    } else {
      const res = await fetch(`${baseUrl}/SecondUser`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      const foundUser = data.documents?.find(
        (user: any) => user.fields?.name?.stringValue.toLowerCase() === trimmedInput.toLowerCase()
      );

      if (!foundUser) throw new Error('Пользователь с таким именем не найден');
      emailToUse = foundUser.fields.email.stringValue;
    }

   
    const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToUse, password, returnSecureToken: true })
    });

    const authData = await authRes.json();
    if (!authRes.ok) throw new Error(authData.error?.message || 'Ошибка авторизации');

    const userId = authData.localId;

    const userRes = await fetch(`${baseUrl}/SecondUser/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const userData = await userRes.json();

    sessionStorage.setItem('idUser', userId);
    sessionStorage.setItem('name', userData.fields?.name?.stringValue || '');
    sessionStorage.setItem('email', userData.fields?.email?.stringValue || '');
    sessionStorage.setItem('userToken', authData.idToken);
    return true;

  } catch (error: any) {
    alert(error.message || 'Ошибка авторизации');
    return false;
  }
};





const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const LoockEmailUsers = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(`${baseUrl}/SecondUser`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error('Error fetching users');
    }

    const data = await res.json();

    const loockEmail = data.documents?.find(
      (user: any) => user.fields.email.stringValue === email
    );

    return !!loockEmail;

  } catch (error) {
    console.log('Error fetching users:', error);
    return false;
  }
};
