import React, { useEffect, useState } from "react";
import style from './YourProfileStyle.module.css';
import { infoUser } from '../../services/loadServices/loadInfoUser';
import Header from '../../components/Header/Header';
import {ChangeUserData} from '../../services/ChangeInfoUser/ChangeInfoUser'


interface UserData {
  email: { stringValue: string } | string;
  name: { stringValue: string } | string;
  password: { stringValue: string } | string;
}

interface EditableUserData {
  email: string;
  name: string;
  id:string;
}

const YourProfile = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [ChangeteUserValue, setChangeUserValue] = useState<boolean>(false);
  const [formData, setFormData] = useState<EditableUserData>({ email: '',  name: '',id:'' });
  const[loockNewData,setLoockNewData] = useState<boolean>(true)

  useEffect(() => {
    const takeEmail = async () => {
      try {
        console.log("Requesting user data...");
        const res = await infoUser();
        console.log("Response from Firestore:", res);

        if (res?.fields) {
          const userFields = res.fields;
          console.log("User fields:", userFields);

          const email = userFields?.email?.stringValue || 'Unknown';
          const name = userFields?.name?.stringValue || 'Unknown';
          const id = userFields?.id?.stringValue || 'Unknown';

          if (email && name && id ) {
            setData(userFields);
            setFormData({
              email,
              name,
              id
            });
          } else {
            console.log("Missing fields in response");
            setData(null);
          }
        } else {
          console.log("No fields in response");
          setData(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setData(null);
      }
    };

    takeEmail();
  }, [loockNewData]);

  const inputDataValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStringValue = (value: { stringValue: string } | string | undefined): string => {
    return typeof value === 'string' ? value : value?.stringValue || 'Unknown';
  };

  



  return (
    <>
      <Header loockNewData={loockNewData} />
      <div className={style.ProfileWrapper}>
        <div className={style.FormProfile}>
          <h1 className={style.ProfileTitle}>Your Profile</h1>

          <div className={style.ProfileItem}>
            <span className={style.Label}>Email:</span>
            {ChangeteUserValue ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={inputDataValue}
                className={style.Value}
              />
            ) : (
              <span className={style.Value}>{getStringValue(data?.email)}</span>
            )}
          </div>

          <div className={style.ProfileItem}>
            <span className={style.Label}>Name:</span>
            {ChangeteUserValue ? (
              <input
                type="name"
                name="name"
                value={formData.name}
                onChange={inputDataValue}
                className={style.Value}
              />
            ) : (
              <span className={style.Value}>{getStringValue(data?.name)}</span>
            )}
          </div>

          <button
            className={style.Button}
            onClick={() => setChangeUserValue(!ChangeteUserValue)}
          >
            {ChangeteUserValue ? 'Cancel' : 'Change'}
          </button>

          {ChangeteUserValue && (
            <>
              <button
                className={style.Button}
                onClick={() => {
                  setChangeUserValue(false);
                  ChangeUserData(formData.email,formData.name,formData.id);
                  setLoockNewData(!loockNewData)
                }}
              >
                Save
              </button>

              <button className={style.dellAcc} >
                Del accaunt
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default YourProfile;
