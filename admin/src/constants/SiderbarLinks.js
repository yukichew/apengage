import { BiBus } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';

export const sidebarLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: RxDashboard,
    isActive: (pathname) => pathname === '/' || pathname.includes('dashboard'),
  },
  {
    label: 'Users',
    icon: FaRegUser,
    isDropdown: true,
    items: [
      {
        to: '/user/users',
        label: 'User',
      },
      {
        to: '/user/admins',
        label: 'Admin',
      },
      {
        to: '/user/absent',
        label: 'Absent User',
      },
    ],
    isActive: (pathname) => pathname.includes('user'),
  },
  {
    label: 'Logistics',
    icon: BiBus,
    isDropdown: true,
    items: [
      {
        to: '/logistics/venue',
        label: 'Venue',
      },
      {
        to: '/logistics/transport',
        label: 'Transport',
      },
      {
        to: '/logistics/facilities',
        label: 'Facilities',
      },
    ],
    isActive: (pathname) => pathname.includes('logistics'),
  },
  {
    label: 'Bookings',
    icon: MdOutlineFormatListBulleted,
    isDropdown: true,
    items: [
      {
        to: '/booking/venue',
        label: 'Venue',
      },
      {
        to: '/booking/facilities',
        label: 'Facilities',
      },
      {
        to: '/booking/transport',
        label: 'Transport',
      },
    ],
    isActive: (pathname) => pathname.includes('booking'),
  },
  {
    label: 'Events',
    icon: LuLayoutDashboard,
    isDropdown: true,
    items: [
      {
        to: '/event/categories',
        label: 'Categories',
      },
      {
        to: '/event/events',
        label: 'Event',
      },
      {
        to: '/event/venue-utilization',
        label: 'Venue Utilization',
      },
    ],
    isActive: (pathname) => pathname.includes('event'),
  },
];
