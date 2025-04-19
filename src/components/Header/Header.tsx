import React, { useEffect, useState } from "react";
import Button from '../Button/Button';
import Styles from './HeaderStyle.module.css';
import Setings from '../Setings/Setings'
import { useNavigate } from "react-router-dom";

import {infoUser} from '../../services/loadServices/loadInfoUser'
import { FiSettings } from "react-icons/fi";

interface HeaderProps {
  loockNewData?: boolean;
  setRememberMeBtn?: React.Dispatch<React.SetStateAction<boolean>>;
}


const Header: React.FC<HeaderProps> = ({ loockNewData,setRememberMeBtn}) => {
    const navigate = useNavigate()
    const [email,setEmail] = useState<string | null>(null)
    const [setingsOpen,setSetingsOpen] = useState<boolean>(false)

    useEffect(() => {
        const takeEmail = async () => {
            const newData = await infoUser();
    
            if (newData?.fields?.name?.stringValue) {
                setEmail(newData.fields.name.stringValue);  
            } else {
                setEmail('Unknown');
            }   
        };
        takeEmail();
    }, [loockNewData]);
    

    


    return (
        <div className={Styles.Container}>

          <div className={Styles.ConSatings}>
            <h1 className={Styles.Email}>{email || 'Loading...'}</h1>
            <h3 className={Styles.Logout} onClick={() => setSetingsOpen(!setingsOpen)}><FiSettings /></h3>
          </div>

          {setingsOpen?(
            <Setings setRememberMeBtn={setRememberMeBtn} />
          ): (<div></div>)}

          <div className={Styles.ButtonsContainer}>
            <Button onClick={() => navigate('/AddFile')}>Add list</Button>
            <Button onClick={() => navigate('/LoockFile')}>Loock lists</Button>
          </div>
         
        </div>
      );
      
}

export default Header;
