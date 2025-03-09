import React, { useEffect, useState } from 'react';
import { Container, Spinner, Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components for line charts
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface DataItem {
  _id: number;
  value: number;
}

const RevenueByYearChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'line', number[], string> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4444/api/data-vis/revenue/data')
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        // Transform API data: x-axis labels are years, y-axis values are revenue
        const labels = data.map((item) => item._id.toString());
        const values = data.map((item) => item.value).sort((a, b) => a - b);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: values,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 3,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching revenue by year data:', error);
        setLoading(false);
      });
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Revenue by Year' },
    },
  };

  return (
    <Container className="border border-1 rounded-0 p-3">
      {loading || !chartData ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
            <Line data={chartData} options={chartOptions} />
          
      )}
    </Container>
  );
};

export default RevenueByYearChart;
