import React, { useState } from 'react';
import InstagramLoginButton from './components/InstagramLogin/InstagramLogin'; // You'll need to create this component

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <InstagramLoginButton />
    </>
  );
}

export default App;
