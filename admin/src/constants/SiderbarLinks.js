import { BiBus } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuCalendarDays, LuLayoutDashboard } from 'react-icons/lu';
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
