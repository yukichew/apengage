import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRole } from '../api/auth';

const ProtectedRoute = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userRole = await getUserRole();
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
