import React, { useEffect, useState } from 'react';
import { BsBusFront } from 'react-icons/bs';
import { FaRegBuilding } from 'react-icons/fa6';
import { GoPeople } from 'react-icons/go';
import { GrUserAdmin } from 'react-icons/gr';
import { MdEvent, MdOutlineHeadsetMic } from 'react-icons/md';
import { toast } from 'react-toastify';
import { getDashboardData } from '../api/dashboard';
import Container from '../components/Container';
import BarChart from '../components/common/BarChart';
import DonutChart from '../components/common/DonutChart';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const DashboardCard = ({ title, value, children }) => {
    return (
      <div className='bg-white shadow-md rounded-lg p-4'>
        <div className='items-center justify-center rounded-full bg-primary-50 w-12 h-12 flex'>
          {children}
        </div>

        <div className='mt-2'>
          <h4 className='text-xl font-bold text-black'>{value}</h4>
          <span className='text-sm font-medium text-gray-700'>{title}</span>
        </div>
      </div>
    );
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const res = await getDashboardData();
    if (!res.success) {
      return toast.error(res.error);
    }
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const bookingsChartData = {
    series: [
      {
        name: 'Pending',
        data: [
          data?.venueBookings?.Pending || 0,
          data?.facilityBookings?.Pending || 0,
          data?.transportBookings?.Pending || 0,
        ],
        color: 'rgba(237, 165, 68, 0.8)',
      },
      {
        name: 'Approved',
        data: [
          data?.venueBookings?.Approved || 0,
          data?.facilityBookings?.Approved || 0,
          data?.transportBookings?.Approved || 0,
        ],
        color: 'rgba(70, 172, 73, 0.8)',
      },
      {
        name: 'Rejected',
        data: [
          data?.venueBookings?.Rejected || 0,
          data?.facilityBookings?.Rejected || 0,
          data?.transportBookings?.Rejected || 0,
        ],
        color: 'rgba(233, 21, 21, 0.84)',
      },
    ],
  };

  // Data for the user status chart
  const userStatusChartData = {
    series: [
      {
        name: 'Active',
        data: [data?.users?.Active || 0],
        color: 'rgba(70, 172, 73, 0.8)',
      },
      {
        name: 'Inactive',
        data: [data?.users?.Inactive || 0],
        color: 'rgba(233, 21, 21, 0.84)',
      },
      {
        name: 'Pending',
        data: [data?.users?.Pending || 0],
        color: 'rgba(237, 165, 68, 0.8)',
      },
    ],
  };

  // Data for the event status chart
  const eventStatusChartData = {
    series: [
      {
        name: 'Pending',
        data: [data?.events?.Pending || 0],
        color: 'rgba(237, 165, 68, 0.8)',
      },
      {
        name: 'Approved',
        data: [data?.events?.Approved || 0],
        color: 'rgba(70, 172, 73, 0.8)',
      },
      {
        name: 'Rejected',
        data: [data?.events?.Rejected || 0],
        color: 'rgba(233, 21, 21, 0.84)',
      },
      {
        name: 'Past',
        data: [data?.events?.Past || 0],
        color: 'rgba(83, 76, 76, 0.18)',
      },
    ],
  };

  return (
    <>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* overall statistics card */}
            {data && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
                <DashboardCard
                  title={'Total Registered Users'}
                  value={data.totalUsers}
                  children={<GoPeople size={20} color='#1e40af' />}
                />
                <DashboardCard
                  title={'Total Admins'}
                  value={data.totalAdmins}
                  children={<GrUserAdmin size={20} color='#1e40af' />}
                />
                <DashboardCard
                  title={'Total Events'}
                  value={data.totalEvents}
                  children={<MdEvent size={20} color='#1e40af' />}
                />
                <DashboardCard
                  title={'Total Venue Bookings'}
                  value={data.totalVenueBookings}
                  children={<FaRegBuilding size={20} color='#1e40af' />}
                />
                <DashboardCard
                  title={'Total Facilities Bookings'}
                  value={data.totalFacilityBookings}
                  children={<MdOutlineHeadsetMic size={20} color='#1e40af' />}
                />
                <DashboardCard
                  title={'Total Transport Bookings'}
                  value={data.totalTransportBookings}
                  children={<BsBusFront size={20} color='#1e40af' />}
                />
              </div>
            )}

            {/* Chart Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <DonutChart
                title='User Status'
                seriesData={userStatusChartData.series.map(
                  (item) => item.data[0]
                )}
                chartColors={userStatusChartData.series.map(
                  (item) => item.color
                )}
                labels={['Active', 'Inactive', 'Pending']}
              />
              <DonutChart
                title='Events Status'
                seriesData={eventStatusChartData.series.map(
                  (item) => item.data[0]
                )}
                chartColors={eventStatusChartData.series.map(
                  (item) => item.color
                )}
                labels={['Pending', 'Approved', 'Rejected', 'Past']}
              />
              <BarChart
                title='Logistics Bookings'
                seriesData={bookingsChartData.series}
                chartColors={[
                  'rgba(237, 165, 68, 0.8)',
                  'rgba(70, 172, 73, 0.8)',
                  'rgba(233, 21, 21, 0.84)',
                ]}
                xaxisLabels={['Venue', 'Facility', 'Transport']}
              />
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
