import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getEvents, searchEvents, updateEventStatus } from '../../api/event';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loader from '../../components/common/Loader';
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

  const columns = [
    'Name',
    'Type',
    'Mode',
    'Start',
    'End',
    'Venue',
    'Organizer',
  ];

  const columnKeys = [
    'name',
    'type',
    'mode',
    'startTime',
    'endTime',
    'venue',
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
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            status: actionType === 'approve' ? 'Approved' : 'Rejected',
          }
        : event
    );

    setEvents(updatedEvents);
    setShowDialog(false);
    setSelectedEvent(null);
    setActionType('');
  };

  const fetchEvents = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchEvents(query);
    } else {
      res = await getEvents();
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    const formattedEvents = res.events.map((event) => ({
      ...event,
      startTime: formatDateTime(event.startTime),
      endTime: formatDateTime(event.endTime),
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
          actions={['view', 'delete']}
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
    </Container>
  );
};

export default Event;
