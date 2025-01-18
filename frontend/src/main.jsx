import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import "./index.css";
// import { AuthenticationProvider } from './features/authentication'
import { AuthProvider } from './hooks/authentication';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />  {/* RouterProvider wrapped in AuthProvider */}
    </AuthProvider>
  </React.StrictMode>
);