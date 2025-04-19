import React,{useState} from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Registration from './pages/Reg/Registration';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import LoockFile from './pages/inAccaunt/LoockFile/LoockFile';
import AddFile from './pages/inAccaunt/Add/AddFile'
import LoockEmail from './pages/loockEmail/LoockEmail';
import YourProfile from './pages/YourProfile/YourProfile'
  
export interface booleanProps {
  rememberMeBtn?: boolean;
  setRememberMeBtn: React.Dispatch<React.SetStateAction<boolean>>;
}



function App() {
  const [rememberMeBtn,setRememberMeBtn] = useState<boolean>(false)


  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Login rememberMeBtn ={rememberMeBtn} setRememberMeBtn={setRememberMeBtn} />} />
          <Route path='/Reg' element={<Registration />} />
          <Route path='/LoockFile' element={<LoockFile/>}/>
          <Route path='/AddFile' element={<AddFile />} />
          <Route path='/LoockEmail' element={<LoockEmail/>} />
          <Route path="/YourProfile" element={<YourProfile setRememberMeBtn={setRememberMeBtn}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
