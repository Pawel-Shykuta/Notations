
import { v4 as uuidv4 } from 'uuid';

const projectId = 'users-279b7';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

// ADD USER
export const addUserWithEmailAsId = async (name: string, email: string, password: string): Promise<boolean> => {
  if (name === '' || email === '' || password === '') {
    alert('не все поля заполнены!');
    return false;
  }

  try {
    const userId = uuidv4(); 
    const url = `${baseUrl}/SecondUser/${encodeURIComponent(userId)}`;
    
    const lists: string[] = []; // Указываем тип для массива lists

    const data = {
      fields: {
        id: { stringValue: userId },
        name: { stringValue: name },
        email: { stringValue: email },
        password: { stringValue: password },
        lists: { arrayValue: { values: lists.map(list => ({ stringValue: list })) } }, // Использование массива
      }
    };
    

    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    alert('Пользователь добавлен успешно!');
    console.log('Пользователь добавлен успешно!');
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};



export const fetchUsersFromFirestore = async (email: string, password: string): Promise<boolean> => {
  try {
    const url = `${baseUrl}/SecondUser`;
    const res = await fetch(url, {
      method: "GET",
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const data = await res.json();

    interface UserFields {
      id:{stringValue:string},
      name: { stringValue: string };
      email: { stringValue: string };
      password: { stringValue: string };
    }

    interface FirestoreDocument {
      name: string;
      fields: UserFields;
    }

    const userLists = data.documents?.map(({ name, fields }: FirestoreDocument) => ({
      id: fields.id?.stringValue || '', 
      name: fields.name?.stringValue || '',
      email: fields.email?.stringValue || '',
      password: fields.password?.stringValue || '',
    })) || [];

    const foundUser = userLists.find((user:any) => 
      (user.email === email && user.password === password) || 
      (user.name === email && user.password === password)
    );
    console.log(foundUser)
    if(foundUser){  
      sessionStorage.setItem('idUser',JSON.stringify(foundUser.id))
      return true
    }else{
      return false
    }

  } catch (error) {
    console.log('Error fetching users:', error);
    return false;
  }
};
