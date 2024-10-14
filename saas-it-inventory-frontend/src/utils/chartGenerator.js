import { Chart } from 'chart.js/auto';

export const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

export const barChartOptions = {
  ...pieChartOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    ...pieChartOptions.plugins,
    legend: {
      display: false,
    },
  },
};

export const generateChartPNG = (type, labels, datasets, width = 400, height = 200) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    try {
      new Chart(ctx, {
        type,
        data: { labels, datasets },
        options: {
          responsive: false,
          animation: false
        }
      });

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
};

export const createChartData = (data, label) => ({
  labels: Object.keys(data || {}),
  datasets: [
    {
      label,
      data: Object.values(data || {}),
      backgroundColor: CHART_COLORS,
    },
  ],
});
