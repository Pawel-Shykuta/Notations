const projectId = 'users-279b7';
const API_KEY = 'AIzaSyBqa_VQ2cwrO_UV0A5JNKxscR1dEeOSyTA';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;


    export const ChangeUserData = async (email: string, name: string, id: string) => {
    try {
        const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Не удалось получить данные пользователя');

        const data = await res.json();
        const oldEmail = data.fields?.email?.stringValue;
        const oldName = data.fields?.name?.stringValue;

        if (oldEmail === email && oldName === name) {
        console.log('Нет изменений, обновление не требуется.');
        return;
        }

        const updatedFields: any = { ...data.fields };

        if (oldEmail !== email) {
        updatedFields.email = { stringValue: email };
        localStorage.setItem('email', email);
        }

        if (oldName !== name) {
        updatedFields.name = { stringValue: name };
        localStorage.setItem('email', name);
        }

        const updateRes = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: updatedFields })
        });

        if (!updateRes.ok) throw new Error('Ошибка при обновлении пользователя');

        console.log('Данные пользователя успешно обновлены');
    } catch (error) {
        console.error('Ошибка:', error);
    }
    };

    export const deleteUserCompletely = async (userId: string) => {
        const userToken = sessionStorage.getItem('userToken');
        if (!userToken) {
          console.error('Ошибка: userToken не найден');
          return false;
        }
      
        try {
          // Удаление данных из Firestore
          const dataRes = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(userId)}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
          });
      
          if (!dataRes.ok) {
            throw new Error(`Ошибка при удалении данных: ${dataRes.status}`);
          }
      
          // Удаление пользователя из Firebase Auth
          const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: userToken })
          });
      
          if (!authRes.ok) {
            const error = await authRes.json();
            throw new Error(`Ошибка при удалении из аутентификации: ${error.error.message}`);
          }
      
          console.log(`Пользователь с ID ${userId} удалён из Auth и Firestore.`);
          return true;
      
        } catch (error) {
          console.error("Ошибка при полном удалении пользователя:", error);
          return false;
        }
      };
      