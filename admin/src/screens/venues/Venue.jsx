import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteVenue,
  getVenues,
  searchVenue,
  updateVenueStatus,
} from '../../api/venue';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Venue = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');

  const columns = ['Name', 'Type', 'Capacity'];
  const columnKeys = ['name', 'type', 'capacity'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'activate':
        setActionType('activate');
        setSelectedVenue(row);
        setShowDialog(true);
        break;
      case 'deactivate':
        setActionType('deactivate');
        setSelectedVenue(row);
        setShowDialog(true);
        break;
      case 'edit':
        navigate(`/logistics/venue/edit/${row.id}`);
        break;
      case 'delete':
        setActionType('delete');
        setSelectedVenue(row);
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteVenue = async () => {
    if (!selectedVenue) return;

    const res = await deleteVenue(selectedVenue.id);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedVenue(null);
    fetchVenues();
  };

  const fetchVenues = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchVenue(query);
    } else {
      res = await getVenues();
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    setVenues(res.venues);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchVenues(query);
  };

  const handleChangeStatus = async () => {
    if (!selectedVenue || !actionType) return;

    const res = await updateVenueStatus(selectedVenue.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedVenue(null);
    setActionType('');
    fetchVenues();
  };

  return (
    <Container>
      <Breadcrumb pageName='Venue Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search venue'
          className='w-64'
        />

        <CustomButton
          title='Add Venue'
          onClick={() => navigate('/logistics/venue/add')}
          className='w-32'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No venue found</div>
      ) : (
        <Table
          data={venues}
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
          message={`Are you sure you want to ${actionType} the venue "${selectedVenue.name}"?`}
          onConfirm={
            actionType === 'delete' ? handleDeleteVenue : handleChangeStatus
          }
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default Venue;
