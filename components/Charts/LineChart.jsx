// components/MyLineChart.tsx
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';  

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

// components/MyLineChart.tsx
// ...
ChartJS.register(CategoryScale, /* ... */)
// ...
const LineChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    const createChart = () => {
      const ctx = chartRef.current.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
              x: {
                type: 'category',
                position: 'bottom',
              },
              y: {
                min: 0,
              },
            },
            plugins:{
              legend: {
                  display: false
              },
            }
          },
      });
    };

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };

    createChart();

    return () => {
      destroyChart(); // 컴포넌트 언마운트 시 차트 파기
    };
  }, [data]);

  return <canvas ref={chartRef} className='w-100 h350' />;
};
export default LineChart; 
