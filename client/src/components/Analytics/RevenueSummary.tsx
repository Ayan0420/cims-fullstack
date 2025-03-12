import React, { useState, useEffect } from "react";
import { Card, ListGroup, Spinner } from "react-bootstrap";
import { useAuth } from "../../AuthContext";

interface RevenueResponse {
  filter: {
    yearmonth: string;
  };
  total: number;
}

const RevenueSummary: React.FC = () => {
  const { token } = useAuth();
  const [revenueData, setRevenueData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Get the current month and previous two months in "YYYY-MM" format.
  const getLastThreeMonths = (): string[] => {
    const months: string[] = [];
    const currentDate = new Date();
    for (let i = 0; i < 4; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      months.push(`${year}-${month}`);
    }
    return months;
  };

  const months = getLastThreeMonths();

  // Convert a "YYYY-MM" string to a more user-friendly format like "March 2025"
  const formatYearMonth = (yearMonth: string): string => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    async function fetchRevenueData() {
      try {
        // Fetch data for each month concurrently
        const responses = await Promise.all(
          months.map(async (month): Promise<RevenueResponse> => {
            const res = await fetch(`http://localhost:4444/api/data-vis/revenue?yearmonth=${month}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) {
              throw new Error(`Error fetching data for ${month}`);
            }
            return res.json();
          })
        );
        // Reduce the responses into an object keyed by "YYYY-MM"
        const data = responses.reduce((acc: Record<string, number>, item: RevenueResponse) => {
          acc[item.filter.yearmonth] = item.total;
          return acc;
        }, {});
        setRevenueData(data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Header className="bg-danger text-white">
        <h3 className="m-0">Revenue Summary</h3>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="text-dark">{formatYearMonth(months[0])}</h4>
            <p className="mb-0">Current Month Revenue:</p>
          </div>
          <h2 className="text-success mb-0">₱{revenueData[months[0]].toLocaleString() || 0}</h2>
        </div>
        <hr />
        <h5 className="mb-3">Past 3 Months</h5>
        <ListGroup variant="flush">
          {months.slice(1).map((month) => (
            <ListGroup.Item key={month} className="d-flex justify-content-between">
              <span>{formatYearMonth(month)}</span>
              <span className="text-success">₱{revenueData[month].toLocaleString() || 0}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default RevenueSummary;
