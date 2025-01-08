import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ title, seriesData, chartColors, labels }) => {
  const options = {
    chart: {
      fontFamily: 'Poppins, sans-serif',
      type: 'donut',
    },
    colors: chartColors || ['#3C50E0', '#80CAEE'],
    labels: labels,
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className='border border-stroke bg-white p-5 shadow-md rounded-lg'>
      <h5 className='text-xl font-semibold text-black'>{title}</h5>

      <div className='mb-2'>
        <div id='chartThree' className='mx-auto flex justify-center'>
          <ReactApexChart options={options} series={seriesData} type='donut' />
        </div>
      </div>

      {/* Custom Legend */}
      <div className='flex flex-wrap items-center justify-center gap-x-4'>
        {labels.map((label, index) => (
          <div key={label} className='flex items-center'>
            <span
              className='mr-2 block h-3 w-3 rounded-full'
              style={{ backgroundColor: chartColors[index] }}
            ></span>
            <p className='text-sm font-medium text-black'>
              {label}: {seriesData[index]} {/* Display the value here */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
