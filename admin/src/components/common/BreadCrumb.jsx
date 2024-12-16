import { FaAngleLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Breadcrumb = ({ pageName, backButton }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-gray-700'>
      {backButton ? (
        <button onClick={handleBackClick} className='flex items-center gap-2'>
          <FaAngleLeft />
          <span>Back</span>
        </button>
      ) : (
        <h2 className='text-title-md2 font-semibold'>{pageName}</h2>
      )}

      <ol className='flex items-center gap-2 text-sm'>
        <li>
          <Link to='/dashboard'>Dashboard /</Link>
        </li>
        <li className='text-gray-600'>{pageName}</li>
      </ol>
    </div>
  );
};

export default Breadcrumb;
