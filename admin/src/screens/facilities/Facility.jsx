import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteFacility,
  getFacilities,
  searchFacility,
  updateFacilityStatus,
} from '../../api/facility';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Facility = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');

  const columns = ['Name', 'Type', 'Quantity'];
  const columnKeys = ['name', 'type', 'quantity'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'activate':
        setActionType('activate');
        setSelectedFacility(row);
        setShowDialog(true);
        break;
      case 'deactivate':
        setActionType('deactivate');
        setSelectedFacility(row);
        setShowDialog(true);
        break;
      case 'edit':
        navigate(`/logistics/facilities/edit/${row.id}`);
        break;
      case 'delete':
        setActionType('delete');
        setSelectedFacility(row);
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteFacility = async () => {
    if (!selectedFacility) return;

    const res = await deleteFacility(selectedFacility.id);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedFacility(null);
    fetchFacilities();
  };

  const fetchFacilities = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchFacility(query);
    } else {
      res = await getFacilities();
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    setFacilities(res.facilities);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchFacilities(query);
  };

  const handleChangeStatus = async () => {
    if (!selectedFacility || !actionType) return;

    const res = await updateFacilityStatus(selectedFacility.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedFacility(null);
    setActionType('');
    fetchFacilities();
  };

  return (
    <Container>
      <Breadcrumb pageName='Facility Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search facility'
          className='w-64'
        />

        <CustomButton
          title='Add Facility'
          onClick={() => navigate('/logistics/facilities/add')}
          className='w-40'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No facility found</div>
      ) : (
        <Table
          data={facilities}
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
          message={`Are you sure you want to ${actionType} the facility "${selectedFacility.name}"?`}
          onConfirm={
            actionType === 'delete' ? handleDeleteFacility : handleChangeStatus
          }
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default Facility;
