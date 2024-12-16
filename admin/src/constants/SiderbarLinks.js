import { FaRegUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuCalendarDays, LuLayoutDashboard, LuText } from 'react-icons/lu';
import { RxDashboard } from 'react-icons/rx';

export const sidebarLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: RxDashboard,
    isActive: (pathname) => pathname === '/' || pathname.includes('dashboard'),
  },
  {
    to: '/user',
    label: 'User',
    icon: FaRegUser,
    isActive: (pathname) => pathname.includes('user'),
  },
  {
    label: 'Logistics',
    icon: LuText,
    isDropdown: true,
    items: [
      {
        to: '/logistics/venue',
        label: 'Venue',
      },
      {
        to: '/logistics/transportation',
        label: 'Transportation',
      },
      {
        to: '/logistics/facilities',
        label: 'Facilities',
      },
    ],
    isActive: (pathname) => pathname.includes('logistics'),
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
        to: '/event/proposals',
        label: 'Proposal',
      },
    ],
    isActive: (pathname) => pathname.includes('event'),
  },
  {
    to: '/calendar',
    label: 'Calendar',
    icon: LuCalendarDays,
    isActive: (pathname) => pathname.includes('calendar'),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: IoSettingsOutline,
    isActive: (pathname) => pathname.includes('settings'),
  },
];
