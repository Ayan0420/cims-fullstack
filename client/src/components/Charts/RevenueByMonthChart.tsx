import React, { useEffect, useState } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap';
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
  _id: string;
  value: number;
}

const RevenueByMonthChart: React.FC = () => {
  // Generate dynamic years from 2023 to current year.
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-indexed (1=Jan, 12=Dec)
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (startYear + i).toString()
  );

  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [chartData, setChartData] = useState<ChartData<'line', (number | null)[], string> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Transform fetched data into chart data with abbreviated month names and fill missing months with 0.
  const getChartData = (data: DataItem[]): ChartData<'line', (number | null)[], string> => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const isCurrentYear = parseInt(selectedYear, 10) === currentYear;
    const monthValues: (number | null)[] = [];

    for (let m = 1; m <= 12; m++) {
      const item = data.find((d) => {
        const parts = d._id.split('-');
        if (parts.length === 2) {
          const monthNum = parseInt(parts[1], 10);
          return monthNum === m;
        }
        return false;
      });
      if (item) {
        monthValues.push(item.value);
      } else {
        // If this is the current year and the month is in the future, leave as null.
        // Otherwise, use 0 (if you prefer to show a zero for missing past months).
        if (isCurrentYear && m > currentMonth) {
          monthValues.push(null);
        } else {
          monthValues.push(0);
        }
      }
    }

    return {
      labels: monthNames,
      datasets: [
        {
          label: 'Revenue',
          data: monthValues,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
        //   tension: 0.4,
          borderWidth: 3,
        },
      ],
    };
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4444/api/data-vis/revenue/data?year=${selectedYear}`)
      .then((response) => response.json())
      .then((data: DataItem[]) => {
        setChartData(getChartData(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching revenue by month data:', error);
        setLoading(false);
      });
  }, [selectedYear]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Revenue by Month for ${selectedYear}` },
    },
  };

  return (
    <Container className="border border-1 rounded-0 p-3">
      <Form.Group controlId="revenueByMonthYearSelect" className="d-flex gap-2 align-items-end mb-2">
        <Form.Label className="m-0 text-sm">Year:</Form.Label>
        <Form.Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="text-sm p-1"
          style={{ width: '80px' }}
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
        
        <Line data={chartData} options={chartOptions} />
          
      )}
    </Container>
  );
};

export default RevenueByMonthChart;
