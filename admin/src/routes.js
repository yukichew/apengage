import React from 'react';
import { Route } from 'react-router-dom';
import PageTitle from './components/common/PageTitle';
import Category from './screens/categories/Category';
import CategoryForm from './screens/categories/CategoryForm';
import Dashboard from './screens/Dashboard';
import Venue from './screens/venues/Venue';
import VenueForm from './screens/venues/VenueForm';
import ProtectedRoute from './utils/ProtectedRoute';

const routesConfig = [
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Admin Dashboard',
  },
  {
    path: '/event/categories',
    component: Category,
    title: 'Event Categories Management',
  },
  {
    path: '/event/categories/add',
    component: CategoryForm,
    title: 'Add Event Category',
  },
  {
    path: '/event/categories/edit/:id',
    component: CategoryForm,
    title: 'Edit Event Category',
  },
  {
    path: '/logistics/venue',
    component: Venue,
    title: 'Venue Management',
  },
  {
    path: '/logistics/venue/add',
    component: VenueForm,
    title: 'Add Venue',
  },
  {
    path: '/logistics/venue/edit/:id',
    component: VenueForm,
    title: 'Edit Venue',
  },
];

const routes = routesConfig.map(({ path, component: Component, title }) => (
  <Route
    key={path}
    path={path}
    element={
      <ProtectedRoute>
        <PageTitle title={title} />
        <Component />
      </ProtectedRoute>
    }
  />
));

export default routes;
