'use client';

import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastTest() {
  const showToast = () => {
    toast.error('This is a test error message');
  };

  return (
    <div>
      <button onClick={showToast}>Show Toast</button>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          width: '320px'
        }}
      />
    </div>
  );
}