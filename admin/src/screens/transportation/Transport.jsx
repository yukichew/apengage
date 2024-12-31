import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteTransport,
  getTransportation,
  searchTransport,
  updateTransportStatus,
} from '../../api/transport';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Transport = () => {
  const navigate = useNavigate();
  const [transportation, setTransportation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');

  const columns = ['Plate', 'Type', 'Capacity'];
  const columnKeys = ['name', 'type', 'capacity'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'activate':
        setActionType('activate');
        setSelectedTransport(row);
        setShowDialog(true);
        break;
      case 'deactivate':
        setActionType('deactivate');
        setSelectedTransport(row);
        setShowDialog(true);
        break;
      case 'edit':
        navigate(`/logistics/transport/edit/${row.id}`);
        break;
      case 'delete':
        setActionType('delete');
        setSelectedTransport(row);
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    if (!selectedTransport) return;

    const res = await deleteTransport(selectedTransport.id);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedTransport(null);
    fetchTransportation();
  };

  const fetchTransportation = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchTransport(query);
    } else {
      res = await getTransportation();
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    setTransportation(res.transportation);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransportation();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchTransportation(query);
  };

  const handleChangeStatus = async () => {
    if (!selectedTransport || !actionType) return;

    const res = await updateTransportStatus(selectedTransport.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedTransport(null);
    setActionType('');
    fetchTransportation();
  };

  return (
    <Container>
      <Breadcrumb pageName='Transportation Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search transport'
          className='w-64'
        />

        <CustomButton
          title='Add Transport'
          onClick={() => navigate('/logistics/transport/add')}
          className='w-48'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No transport found</div>
      ) : (
        <Table
          data={transportation}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
          actions={['edit', 'delete', 'activate', 'deactivate']}
        />
      )}

      {showDialog && (
        <ConfirmDialog
          title={`Confirm ${
            actionType === 'delete'
              ? 'Deletion'
              : actionType === 'activate'
              ? 'Activation'
              : 'Deactivation'
          }`}
          message={`Are you sure you want to ${actionType} the transport "${selectedTransport.name}"?`}
          onConfirm={
            actionType === 'delete' ? handleDelete : handleChangeStatus
          }
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default Transport;
