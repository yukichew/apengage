import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getVenueBookings,
  searchVenueBookings,
  updateBookingStatus,
} from '../../api/venue';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const VenueBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');

  const columns = ['By', 'Venue', 'Start Time', 'End Time', 'Purpose'];
  const columnKeys = ['createdBy', 'venue', 'startTime', 'endTime', 'purpose'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'approve':
        setActionType('approve');
        setSelectedBooking(row);
        setShowDialog(true);
        break;
      case 'reject':
        setActionType('reject');
        setSelectedBooking(row);
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedBooking || !actionType) return;

    const res = await updateBookingStatus(selectedBooking.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id
        ? {
            ...booking,
            status: actionType === 'approve' ? 'Approved' : 'Rejected',
          }
        : booking
    );

    setBookings(updatedBookings);
    setShowDialog(false);
    setSelectedBooking(null);
    setActionType('');
  };

  const fetchbookings = async (query = '') => {
    setLoading(true);
    let res;

    const params = new URLSearchParams({ role: 'admin' });
    if (query) params.append('fullname', query);

    if (query) {
      res = await searchVenueBookings(params);
    } else {
      res = await getVenueBookings('admin');
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    const formattedBookings = res.bookings.map((booking) => ({
      ...booking,
      startTime: formatDateTime(booking.startTime),
      endTime: formatDateTime(booking.endTime),
    }));

    setBookings(formattedBookings);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchbookings();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    fetchbookings(query);
  };

  return (
    <Container>
      <Breadcrumb pageName='Venue Booking Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search venue booking'
          className='w-64'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No booking found</div>
      ) : (
        <Table
          data={bookings}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
          actions={['view', 'approve', 'reject']}
        />
      )}

      {showDialog && (
        <ConfirmDialog
          title={`Confirm ${
            actionType.charAt(0).toUpperCase() + actionType.slice(1)
          }`}
          message={`Are you sure you want to ${actionType} venue booking "${selectedBooking.id}"?`}
          onConfirm={handleChangeStatus}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default VenueBooking;
