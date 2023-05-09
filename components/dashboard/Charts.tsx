import React from 'react';
import { LinearScale, Chart } from 'chart.js';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2, 3, 10],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};
Chart.register(LinearScale);
const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Charts = () => (
    
  <>
    <div className='header'>
      <h1 className='title'>Sales Chart</h1>
    </div>
    <Line data={data} options={options} />
  </>
);

export default Charts;
