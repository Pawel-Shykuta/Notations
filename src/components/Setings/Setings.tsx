import React, { SetStateAction, useEffect, useState } from "react";
import style from './SetingsStyle.module.css'
import { useNavigate } from "react-router-dom";
import { infoUser } from '../../services/loadServices/loadInfoUser'

interface SetingsProps {
    setRememberMeBtn?: React.Dispatch<SetStateAction<boolean>>;
}

const Setings: React.FC<SetingsProps> = ({ setRememberMeBtn }) => {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>('')

    const logaut = () => {
        if (setRememberMeBtn !== undefined) {
            setRememberMeBtn(false)
        }
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        navigate('/')
    }

    useEffect(() => {
        const takeEmail = async () => {
            const res = await infoUser()

            if (res?.fields?.email?.stringValue) {
                setEmail(res.fields.email.stringValue);
            } else {
                setEmail('Unknown');
            }
        }
        takeEmail()
    }, [])

    return (
        <div className={style.wrapper}>
            <div className={style.setingsContainer}>
                <h1>{email || 'Loading...'}</h1>
                <h2 onClick={() => navigate('/YourProfile')}>Your profile</h2>
                <h2 onClick={logaut}>Logaut</h2>
                <h2>support service</h2>
            </div>
        </div>
    )
}

export default Setings;
