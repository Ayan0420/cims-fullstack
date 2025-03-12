import { useState } from "react";
import { Form, Button, ToggleButton, ToggleButtonGroup, Row, Col, Card } from "react-bootstrap";

const ReportGenerator = () => {
  const [reportType, setReportType] = useState<"annual" | "monthly">("annual");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<string>("01");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = "http://localhost:4444/report-generator";
    const url =
      reportType === "annual"
        ? `${baseUrl}/year/${year}`
        : `${baseUrl}/month/${year}/${month}`;
  
    window.open(url, "_blank");
  };
  

  return (
    <Card className="card my-5" >
        <Card.Header className="text-light bg-danger">
        <h3 >Generate Report</h3>
        </Card.Header>

        <Card.Body>
            <ToggleButtonGroup type="radio" name="reportType" value={reportType} onChange={(val) => setReportType(val)}>
                <ToggleButton id="annual-btn" variant="outline-dark" value="annual">Annual Report</ToggleButton>
                <ToggleButton id="monthly-btn" variant="outline-dark" value="monthly">Monthly Report</ToggleButton>
            </ToggleButtonGroup>

            <Form onSubmit={handleSubmit} className="mt-3">
                <Row className="mb-3">
                <Col>
                    <Form.Label className="fw-bolder">Year:</Form.Label>
                    <Form.Control
                    type="number"
                    value={year}
                    min="2000"
                    max="2099"
                    className="fw-bolder"
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    required
                    />
                </Col>
                {reportType === "monthly" && (
                    <Col>
                    <Form.Label className="fw-bolder"   >Month:</Form.Label>
                    <Form.Select value={month} onChange={(e) => setMonth(e.target.value)} className="fw-bolder" required>
                        {Array.from({ length: 12 }, (_, i) => {
                        const monthNum = (i + 1).toString().padStart(2, "0");
                        return <option key={monthNum} value={monthNum}>{monthNum}</option>;
                        })}
                    </Form.Select>
                    </Col>
                )}
                </Row>

                <Button type="submit" variant="primary">Generate Report</Button>
            </Form>
        </Card.Body>
    </Card>
  );
};

export default ReportGenerator;
