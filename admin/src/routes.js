import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './screens/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';

const routesConfig = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
];

const routes = routesConfig.map(({ path, component: Component }) => (
  <Route
    key={path}
    path={path}
    element={
      <ProtectedRoute>
        <Component />
      </ProtectedRoute>
    }
  />
));

export default routes;
