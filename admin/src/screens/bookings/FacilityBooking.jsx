import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getFacilityBookings,
  searchFacilityBookings,
  updateBookingStatus,
} from '../../api/facility';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const FacilityBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const columns = [
    'By',
    'Facility',
    'Quantity',
    'Venue',
    'Start Time',
    'End Time',
  ];
  const columnKeys = [
    'createdBy',
    'facility',
    'quantity',
    'venueBooking',
    'startTime',
    'endTime',
  ];

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
      case 'view':
        setSelectedBooking(row);
        setShowModal(true);
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
    setShowDialog(false);
    setSelectedBooking(null);
    setActionType('');
    fetchBookings();
  };

  const fetchBookings = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchFacilityBookings(query);
    } else {
      res = await getFacilityBookings();
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
    fetchBookings();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
    fetchBookings(query);
  };

  return (
    <Container>
      <Breadcrumb pageName='Facility Booking Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search facility booking by facility name'
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
          message={`Are you sure you want to ${actionType} facility booking "${selectedBooking.id}"?`}
          onConfirm={handleChangeStatus}
          onCancel={() => setShowDialog(false)}
        />
      )}

      {showModal && selectedBooking && (
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          className='w-1/2'
        >
          <div className='flex flex-col'>
            <table className='w-full rounded-lg'>
              <tbody>
                {Object.entries(selectedBooking)
                  .filter(([key]) => key !== 'id')
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

export default FacilityBooking;
