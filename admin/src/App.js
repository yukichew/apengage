import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from './routes';
import Login from './screens/Login';
import NotFound from './screens/NotFound';
import ResetPassword from './screens/ResetPassword';

const App = () => {
  return (
    <>
      <ToastContainer position='top-center' autoClose={2000} />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
          {routes}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
