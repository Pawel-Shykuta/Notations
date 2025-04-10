


const projectId = 'users-279b7';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

export const infoUser = async () => {
    try {
        const UserID = sessionStorage.getItem('idUser')?.replace(/"/g, '').trim();

        if (!UserID) {
            console.log('User ID not found');
            return null;
        }

        const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            throw new Error(`Error fetching user: ${res.statusText}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};



export const addEvent = async (data: any) => {
    try {
      const UserID = sessionStorage.getItem('idUser')?.replace(/"/g, '').trim();
      if (!UserID) {
        console.log('User ID not found');
        return null;
      }
  
      const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const oldData = await res.json();
  
      
      const { fields, ...otherFields } = oldData; 
  
      const newData = fields?.lists?.arrayValue?.values || [];
  

      newData.unshift({
        mapValue: {
          fields: {
            date: { stringValue: data.date },
            importance: { stringValue: data.importance },
            name: { stringValue: data.name },
            text: { stringValue: data.text }
          }
        }
      });
  
     
      console.log("Data submitted:", {
        fields: {
          ...fields, 
          lists: {
            arrayValue: {
              values: newData
            }
          }
        },
        ...otherFields
      });
 
      const body = {
        fields: {
          ...fields,
          lists: {
            arrayValue: {
              values: newData
            }
          }
        },
        ...otherFields
      };
  
      await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
    } catch (error) {
      console.log('Error:', error);
    }
  };
  




  export const ChangeValue = async (data: any, index?: number) => {
    try {
      const UserID = sessionStorage.getItem("idUser")?.replace(/"/g, "").trim();
      if (!UserID) {
        console.log("User ID not found");
        return null;
      }
  
      const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!res.ok) throw new Error("Failed to fetch user data");
  
      const oldData = await res.json();
      const { fields, ...otherFields } = oldData;
  
      const newData = Array.isArray(fields?.lists?.arrayValue?.values)
        ? [...fields.lists.arrayValue.values]
        : [];
  
      if (index !== undefined && index >= 0 && index < newData.length) {
        const newDataText = {
          mapValue: {
            fields: structuredClone(data.mapValue.fields),
          },
        };
  
        newData[index] = newDataText; // Заменяем только нужный элемент
      } else {
        console.warn("Invalid index:", index);
        return;
      }
  
      const body = {
        fields: {
          ...fields,
          lists: {
            arrayValue: {
              values: newData,
            },
          },
        },
        ...otherFields,
      };
  
      await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
    } catch (error) {
      console.log("Error:", error);
    }
  };
  
  
  export const dellItem = async (index: number) => {
    try {
      const UserID = sessionStorage.getItem('idUser')?.replace(/"/g, '').trim();
  
      if (!UserID) {
        console.log('User ID not found');
        return null;
      }
  
      const res = await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!res.ok) {
        throw new Error(`Error fetching user: ${res.statusText}`);
      }
  
      const data = await res.json();
      const { fields, ...otherFields } = data;
  
      const newData = Array.isArray(fields?.lists?.arrayValue?.values)
        ? [...fields.lists.arrayValue.values]
        : [];
  
      if (index !== undefined && index >= 0 && index < newData.length) {
        newData.splice(index, 1); // Правильное удаление элемента по индексу
      } else {
        console.warn("Invalid index:", index);
        return;
      }
  
      const body = {
        fields: {
          ...fields,
          lists: {
            arrayValue: {
              values: newData,
            },
          },
        },
        ...otherFields,
      };
  
      await fetch(`${baseUrl}/SecondUser/${encodeURIComponent(UserID)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error);
    }
  };
  




