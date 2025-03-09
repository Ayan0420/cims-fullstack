import { Col, Container, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"
import JobCountChart from "../components/Charts/JobCountChart"
import JobCountByStatusChart from "../components/Charts/JobCountByStatusChart"
import RevenueByYearChart from "../components/Charts/RevenueByYearChart"
import RevenueByMonthChart from "../components/Charts/RevenueByMonthChart"

const Analytics = () => {
  return (
    <Container>  
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white mb-4 '>
        <FontAwesomeIcon icon={faChartLine} className='fs-1'/> Analytics
      </h1>
      <h4 className="text-center">Jobs Charts</h4>
      <Row className="mb-5">
        <Col>
          <JobCountChart />
        </Col>
        <Col>
          <JobCountByStatusChart />
        </Col>
      </Row>

      <h4 className="text-center">Revenue Charts</h4>
      <Row className="w-75 mx-auto mb-3">
        <Col>
          <RevenueByYearChart />
        </Col>
        
      </Row>
      <Row className="w-75 mx-auto mb-3">
        <Col>
          <RevenueByMonthChart />
        </Col>
      </Row>
    </Container>
  )
}

export default Analytics



