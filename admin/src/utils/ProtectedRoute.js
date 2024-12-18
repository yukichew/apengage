import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserRole, logout } from '../api/auth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('You do not have access to this page.');
        return <Navigate to='/login' replace />;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        await logout();
        return <Navigate to='/login' replace />;
      }

      const userRole = await getUserRole();
      setRole(userRole);
      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
