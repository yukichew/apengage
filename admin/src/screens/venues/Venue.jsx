import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getVenues } from '../../api/venue';
import Breadcrumb from '../../components/common/BreadCrumb';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Venue = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const columns = ['Name', 'Type', 'Capacity'];
  const columnKeys = ['name', 'type', 'capacity'];

  const handleAction = (action, row) => {
    if (action === 'edit') {
      navigate(`/logistics/venue/edit/${row.id}`);
    }
    console.log(`${action} clicked`, row);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      const res = await getVenues();
      if (!res.success) {
        return toast.error(res.error);
      }

      setVenues(res.venues);
      setCount(res.count);
      setLoading(false);
    };

    fetchVenues();
  }, []);

  return (
    <Container>
      <Breadcrumb pageName='Venue Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <p>Search bar</p>

        <CustomButton
          title='Add Venue'
          onClick={() => navigate('/logistics/venue/add')}
          className='w-32'
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          data={venues}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
        />
      )}
    </Container>
  );
};

export default Venue;
