import { IoMdMenu } from 'react-icons/io';
import { dropdownUserItems } from '../constants/DropdownItems';
import Dropdown from './common/Dropdown';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className='sticky top-0 z-999 flex w-full bg-white shadow-md'>
      <div className='flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11'>
        <div className='flex items-center gap-2 sm:gap-4 lg:hidden'>
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className='z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <IoMdMenu />
          </button>
        </div>

        <div className='flex items-center gap-3 ml-auto'>
          <Dropdown title={'admin'} items={dropdownUserItems} />
        </div>
      </div>
    </header>
  );
};

export default Header;
