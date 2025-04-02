import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { searchEvents, updateEventStatus } from '../../api/event';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionType, setActionType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const columns = [
    'Name',
    'Type',
    'Mode',
    'Start',
    'End',
    'Location/ Venue',
    'Organizer',
  ];

  const columnKeys = [
    'name',
    'type',
    'mode',
    'startTime',
    'endTime',
    'location',
    'organizer',
  ];

  const handleAction = (action, row) => {
    switch (action) {
      case 'approve':
        setActionType('approve');
        setSelectedEvent(row);
        setShowDialog(true);
        break;
      case 'reject':
        setActionType('reject');
        setSelectedEvent(row);
        setShowDialog(true);
        break;
      case 'view':
        setSelectedEvent(row);
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedEvent || !actionType) return;

    const res = await updateEventStatus(selectedEvent.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedEvent(null);
    setActionType('');
    fetchEvents();
  };

  const fetchEvents = async (query = '') => {
    setLoading(true);
    const res = await searchEvents(query);

    if (!res.success) {
      return toast.error(res.error);
    }

    const formattedEvents = res.events.map((event) => ({
      ...event,
      startTime: formatDateTime(event.startTime),
      endTime: formatDateTime(event.endTime),
      location: event.mode === 'oncampus' ? event.venue : event.location,
    }));

    setEvents(formattedEvents);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchEvents(query);
  };

  return (
    <Container>
      <Breadcrumb pageName='Event Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search event'
          className='w-64'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No event found</div>
      ) : (
        <Table
          data={events}
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
          message={`Are you sure you want to ${actionType} event "${selectedEvent.id}"?`}
          onConfirm={handleChangeStatus}
          onCancel={() => setShowDialog(false)}
        />
      )}

      {showModal && selectedEvent && (
        <Modal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          className='w-1/2'
        >
          <div className='flex flex-col'>
            <table className='w-full rounded-lg'>
              <tbody>
                {Object.entries(selectedEvent)
                  .filter(([key]) => key !== 'id')
                  .map(([key, value]) => (
                    <tr key={key}>
                      <td className='font-semibold capitalize'>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className='pl-3'>
                        {key === 'updatedAt' || key === 'createdAt'
                          ? formatDateTime(value)
                          : value}
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

export default Event;
