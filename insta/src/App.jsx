import './App.css'
import React, { useState } from 'react';
import InstagramLoginButton from './components/InstagramLogin/InstagramLogin';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <InstagramLoginButton/>
    </>

  );
}

export default App
