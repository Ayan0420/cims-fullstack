import React, { useEffect, useState } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { useAuth } from '../../AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataItem {
  _id: string;
  value: number;
}

const JobCountChart: React.FC = () => {

  const { token } = useAuth();

  // Generate dynamic years from 2023 to current year.
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [chartData, setChartData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  // Transform fetched data into chart data with full month names and fill missing months with 0.
  const getChartData = (data: DataItem[]): ChartData<'bar', number[], string> => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const monthValues = new Array(12).fill(0);
    data.forEach((item) => {
      const parts = item._id.split('-'); // expects "YYYY-MM"
      if (parts.length === 2) {
        const monthNum = parseInt(parts[1], 10);
        if (monthNum >= 1 && monthNum <= 12) {
          monthValues[monthNum - 1] = item.value;
        }
      }
    });
    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Job Count',
          data: monthValues,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4444/api/data-vis/count/data?year=${selectedYear}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        setChartData(getChartData(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching job count data:', error);
        setLoading(false);
      });
  }, [selectedYear]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Job Count by Month for ${selectedYear}` },
    },
  };

  return (
    <Container className="border border-1 rounded-0 p-3">
      
          {/* <h2>Job Count Chart</h2> */}
        <Form.Group controlId="jobCountYearSelect" className="mb-0 d-flex gap-2 align-items-center">
            <Form.Label className='text-sm m-0'>YEAR:</Form.Label>
            <Form.Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className='text-sm p-1 align-self-start'
                style={{ width: '60px' }}
            >   
                {years.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
                ))}
            </Form.Select>
        </Form.Group>
      
      {loading || !chartData ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </Container>
  );
};

export default JobCountChart;
