import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ title, seriesData, chartColors, xaxisLabels }) => {
  const options = {
    colors: chartColors || ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Poppins, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: xaxisLabels || ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Poppins',
      fontWeight: 300,
      fontSize: '12px',
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className='border border-stroke bg-white p-5 shadow-md rounded-lg'>
      <h4 className='text-xl font-semibold text-black'>{title}</h4>
      <div id='chartTwo' className='-ml-5 -mb-9'>
        <ReactApexChart
          options={options}
          series={seriesData}
          type='bar'
          height={350}
        />
      </div>
    </div>
  );
};

export default BarChart;
