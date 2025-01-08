import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { searchVenueUtilization } from '../../api/event';
import Breadcrumb from '../../components/common/BreadCrumb';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';
import { formatDateTime } from '../../utils/formatDate';

const OnCampusEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const columns = [
    'Name',
    'Type',
    'Organizer',
    'Venue',
    'Wasted Space',
    'Participants',
  ];

  const columnKeys = [
    'name',
    'type',
    'organizer',
    'venue',
    'wastedCapacity',
    'participant',
  ];

  const handleAction = (action, row) => {
    switch (action) {
      case 'view':
        setSelectedEvent(row);
        setShowModal(true);
        break;
      default:
        break;
    }
  };

  const fetchEvents = async (query = '') => {
    setLoading(true);
    const res = await searchVenueUtilization(query);

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
      <Breadcrumb pageName='Venue Utilization Management' />

      <p className='text-sm text-gray-500 mb-4'>
        Only on-campus events that have number of participants that is less than
        half of the venue capacity are displayed.
      </p>

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
          actions={['view']}
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

export default OnCampusEvent;
