import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { IoArrowBackOutline } from 'react-icons/io5';
import { NavLink, useLocation } from 'react-router-dom';
import { sidebarLinks } from '../../constants/SiderbarLinks';
import SidebarLinkGroup from './SidebarLinkGroup';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef();
  const sidebar = useRef();

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close sidebar when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close sidebar using escape key
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  // close sidebar when resizing to mobile view
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const renderLinks = () =>
    sidebarLinks.map((link) => {
      if (link.isDropdown) {
        return (
          <SidebarLinkGroup
            key={link.label}
            activeCondition={link.isActive(pathname)}
          >
            {(handleClick, open) => (
              <>
                <div
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium duration-300 ease-in-out hover:bg-primary-100 cursor-pointer ${
                    link.isActive(pathname) ? 'bg-primary-100' : ''
                  }`}
                  onClick={handleClick}
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                  <FaAngleDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                    size={18}
                  />
                </div>
                {open && (
                  <ul className='mt-2 pl-6'>
                    {link.items.map((subLink) => (
                      <li key={subLink.to}>
                        <NavLink
                          to={subLink.to}
                          className={({ isActive }) =>
                            `group relative flex items-center gap-2.5 rounded-md px-4 pl-5 py-1 font-medium duration-300 ease-in-out hover:text-gray-500 ${
                              isActive ? '!text-gray-500' : ''
                            }`
                          }
                        >
                          {subLink.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </SidebarLinkGroup>
        );
      }
      return (
        <li key={link.to}>
          <NavLink
            to={link.to}
            className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium duration-300 ease-in-out hover:bg-primary-100 ${
              link.isActive(pathname) ? 'bg-primary-50' : ''
            }`}
          >
            {link.icon && <link.icon size={18} />}
            {link.label}
          </NavLink>
        </li>
      );
    });

  return (
    <aside
      ref={sidebar}
      className={`absolute bg-primary-50 left-0 top-0 z-9999 flex h-screen w-64 flex-col overflow-y-hidden duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* header */}
      <div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='block lg:hidden'
        >
          <IoArrowBackOutline size={18} />
        </button>
      </div>

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        <nav className='mt-5 py-4 px-4 lg:mt-9 lg:px-6'>
          <ul className='mb-6 flex flex-col gap-1.5'>{renderLinks()}</ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
