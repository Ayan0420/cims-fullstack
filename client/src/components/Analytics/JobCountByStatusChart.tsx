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
import { JobStatusEnum } from '../AddJobOrderForm';
import { useAuth } from '../../AuthContext';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataItem {
  _id: string;
  value: number;
}

const JobCountByStatusChart: React.FC = () => {

  const { token } = useAuth();
  // Generate dynamic years from 2023 to current year.
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedStatus, setSelectedStatus] = useState<string>(JobStatusEnum.onGoing);
  const [chartData, setChartData] = useState<ChartData<'bar', number[], string> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Transform fetched data into chart data with abbreviated month names and fill missing months with 0.
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
          label: selectedStatus ? `Job Count (${selectedStatus})` : 'Job Count',
          data: monthValues,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    setLoading(true);
    let url = `${import.meta.env.VITE_API_URL}/api/data-vis/count/data?year=${selectedYear}`;
    if (selectedStatus) {
      url += `&status=${encodeURIComponent(selectedStatus)}`;
    }
    fetch(url, {
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
        console.error('Error fetching job count by status data:', error);
        setLoading(false);
      });
  }, [selectedYear, selectedStatus]);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Job Count by Month for ${selectedYear} (Status: ${selectedStatus || 'All'})`,
      },
    },
  };

  return (
    <Container className="border border-1 rounded-0 p-3">
      <div className="d-flex gap-4 align-items-end mb-0">
        <Form.Group controlId="jobCountYearSelect" className='d-flex gap-1 align-items-center'>
          <Form.Label className='text-sm align-self-center m-0'>YEAR:</Form.Label>
          <Form.Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-sm p-1 align-self-start"
            style={{ width: '60px' }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="jobCountStatusSelect" className='d-flex gap-1 align-items-center'>
          <Form.Label className='text-sm align-self-center m-0'>STATUS:</Form.Label>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-sm p-1 align-self-start"
            style={{ width: '140px' }}
          >
            {/* <option value="">All</option> */}
            {Object.values(JobStatusEnum).map((status) => (
                // status === "ONGOING" ?
                // <option selected key={status} value={status}>
                //     {status}
                // </option>
                // :
                <option key={status} value={status}>
                    {status}
                </option>
            ))}
            <option value="UNRELEASED">All Unreleased</option>
            <option value="RELEASED">All Released</option>
          </Form.Select>
        </Form.Group>
      </div>
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

export default JobCountByStatusChart;
