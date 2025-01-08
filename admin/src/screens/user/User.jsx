import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { searchUser } from '../../api/user';
import Breadcrumb from '../../components/common/BreadCrumb';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const columns = ['Name', 'Email', 'AP Key'];
  const columnKeys = ['fullname', 'email', 'apkey'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'view':
        setSelectedUser(row);
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  const fetchUsers = async (query = '') => {
    setLoading(true);
    const params = new URLSearchParams({ role: 'user' });
    params.append('fullname', query);
    const res = await searchUser(params);
    if (!res.success) {
      return toast.error(res.error);
    }
    setUsers(res.users);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    fetchUsers(query);
  };

  return (
    <Container>
      <Breadcrumb pageName='User Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search user'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No user found</div>
      ) : (
        <Table
          data={users}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
          actions={['view']}
        />
      )}

      {showModal && selectedUser && (
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          className='w-1/2'
        >
          <div className='flex flex-col'>
            {selectedUser.profile && (
              <img
                src={selectedUser.profile}
                alt='Profile'
                className='w-20 h-20 rounded-full mb-4 object-cover'
              />
            )}
            <table className='w-full rounded-lg'>
              <tbody>
                {Object.entries(selectedUser)
                  .filter(([key]) => key !== 'profile' && key !== 'id')
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className='font-semibold capitalize'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td>
                        {key === 'updatedAt' || key === 'createdAt'
                          ? formatDateTime(value)
                          : value || 'N/A'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default User;
