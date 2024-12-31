import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ items, title }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.dropdown-container')) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <div className='dropdown-container relative inline-block'>
      <button onClick={() => setDropdownOpen((prev) => !prev)} className='py-2'>
        {title}
      </button>

      {dropdownOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50'>
          <ul className='py-1'>
            {items.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
