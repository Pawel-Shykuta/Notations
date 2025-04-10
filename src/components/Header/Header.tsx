import React, { useEffect, useState } from "react";
import Button from '../Button/Button';
import Styles from './HeaderStyle.module.css';
import { useNavigate } from "react-router-dom";

import {infoUser} from '../../services/loadServices/loadInfoUser'

const Header = () => {
    const navigate = useNavigate()
    const [email,setEmail] = useState<string | null>(null)

    useEffect(() => {
        const takeEmail = async () => {
            const newData = await infoUser();
    
            if (newData?.fields?.email?.stringValue) {
                setEmail(newData.fields.email.stringValue);  
            } else {
                setEmail('Unknown');
            }   
        };
        takeEmail();
    }, []);
    


    return (
        <div className={Styles.Container}>
             <h3 className={Styles.Logout} onClick={() => navigate('/')}>Log out</h3>
            <div className={Styles.ButtonsContainer}>
                <Button onClick={() => navigate('/AddFile')}>Add list</Button>
                <Button onClick={() => navigate('/LoockFile')}>Loock lists</Button>
            </div>
            <h1 className={Styles.Email}>{email || 'Loading...'}</h1>
        </div>
    );
}

export default Header;
