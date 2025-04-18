const projectId = 'users-279b7';

const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

export const ChangeUserData = async (email: string, name: string, id: string) => {
    try {
        // Получаем текущие данные пользователя
        const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await res.json();

        const oldEmail = data.fields?.email?.stringValue;
        const oldName = data.fields?.name?.stringValue;

        // Создаем новый объект, копируя все старые поля
        const updatedFields = { ...data.fields }; // Это сохраняет все данные, включая email и name

        // Обновляем только те поля, которые изменились
        if (oldEmail !== email) {
            updatedFields.email = { stringValue: email };
        }
        if (oldName !== name) {
            updatedFields.name = { stringValue: name };
        }

        // Если нет изменений, прерываем выполнение
        if (oldEmail === email && oldName === name) {
            console.log('No changes detected, no update needed.');
            return;
        }

        // Отправляем запрос на обновление данных с обновленными полями
        const updateRes = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(id)}`, {
            method: 'PATCH', // Исправленный метод
            headers: { 'Content-Type': 'application/json' }, // Исправленный заголовок
            body: JSON.stringify({
                fields: updatedFields, // Отправляем все старые поля с измененными
            })
        });

        if (!updateRes.ok) {
            throw new Error('Failed to update user data');
        }

        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error:', error);
    }
};
