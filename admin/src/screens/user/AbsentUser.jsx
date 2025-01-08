import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { searchAbsentUser, updateUserStatus } from '../../api/user';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const AbsentUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const columns = ['Name', 'Email', 'AP Key', 'Absent'];
  const columnKeys = ['fullname', 'email', 'apkey', 'absentCount'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'unblock':
        setActionType('activate');
        setSelectedUser(row);
        setShowDialog(true);
        break;
      case 'block':
        setActionType('deactivate');
        setSelectedUser(row);
        setShowDialog(true);
        break;
      case 'view':
        setSelectedUser(row);
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedUser || !actionType) return;

    const res = await updateUserStatus(selectedUser.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedUser(null);
    setActionType('');
    fetchUsers();
  };

  const fetchUsers = async (query = '') => {
    setLoading(true);
    const params = new URLSearchParams({ role: 'admin' });
    params.append('fullname', query);
    const res = await searchAbsentUser(params);
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

      <p className='text-sm text-gray-500 mb-4'>
        Only users with absent count more than 3 are shown.
      </p>

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
          actions={['view', 'block', 'unblock']}
        />
      )}

      {showDialog && (
        <ConfirmDialog
          title={`Confirm ${
            actionType === 'activate' ? 'Unblock' : 'Blocking'
          }`}
          message={`Are you sure you want to ${
            actionType === 'activate' ? 'unblock' : 'block'
          } the user "${selectedUser.fullname}"?`}
          onConfirm={handleChangeStatus}
          onCancel={() => setShowDialog(false)}
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

export default AbsentUser;
