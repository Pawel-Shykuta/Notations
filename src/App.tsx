import React from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Registration from './pages/Reg/Registration';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import LoockFile from './pages/inAccaunt/LoockFile/LoockFile';
import AddFile from './pages/inAccaunt/Add/AddFile'


function App() {


  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/Reg' element={<Registration />} />
          <Route path='/LoockFile' element={<LoockFile/>}/>
          <Route path='/AddFile' element={<AddFile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
