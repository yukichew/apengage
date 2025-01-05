import React from 'react';
import { Route } from 'react-router-dom';
import PageTitle from './components/common/PageTitle';
import FacilityBooking from './screens/bookings/FacilityBooking';
import TransportBooking from './screens/bookings/TranportBooking';
import VenueBooking from './screens/bookings/VenueBooking';
import Category from './screens/categories/Category';
import CategoryForm from './screens/categories/CategoryForm';
import Dashboard from './screens/Dashboard';
import Event from './screens/events/Event';
import Facility from './screens/facilities/Facility';
import FacilityForm from './screens/facilities/FacilityForm';
import ChangePassword from './screens/profile/ChangePassword';
import Profile from './screens/profile/Profile';
import Transport from './screens/transportation/Transport';
import TransportForm from './screens/transportation/TransportForm';
import Admin from './screens/user/Admin';
import AdminForm from './screens/user/AdminForm';
import User from './screens/user/User';
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
    path: '/user/users',
    component: User,
    title: 'User Management',
  },
  {
    path: '/user/admins',
    component: Admin,
    title: 'Admin Management',
  },
  {
    path: '/user/admins/add',
    component: AdminForm,
    title: 'Add Admin',
  },
  {
    path: '/user/admins/edit/:id',
    component: AdminForm,
    title: 'Edit Admin',
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
    path: '/event/events',
    component: Event,
    title: 'Event Management',
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
  {
    path: '/booking/venue',
    component: VenueBooking,
    title: 'Venue Booking Management',
  },
  {
    path: '/logistics/facilities',
    component: Facility,
    title: 'Facility Management',
  },
  {
    path: '/logistics/facilities/add',
    component: FacilityForm,
    title: 'Add Facility',
  },
  {
    path: '/logistics/facilities/edit/:id',
    component: FacilityForm,
    title: 'Edit Facility',
  },
  {
    path: '/booking/facilities',
    component: FacilityBooking,
    title: 'Facility Booking Management',
  },
  {
    path: '/logistics/transport',
    component: Transport,
    title: 'Transportation Management',
  },
  {
    path: '/logistics/transport/add',
    component: TransportForm,
    title: 'Add Transport',
  },
  {
    path: '/logistics/transport/edit/:id',
    component: TransportForm,
    title: 'Edit Transport',
  },
  {
    path: '/booking/transport',
    component: TransportBooking,
    title: 'Transportation Booking Management',
  },
  {
    path: '/user/profile',
    component: Profile,
    title: 'Profile',
  },
  {
    path: '/user/password',
    component: ChangePassword,
    title: 'Change Password',
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
