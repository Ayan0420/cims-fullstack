import { Col, Container, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import JobCountChart from "../components/Analytics/JobCountChart"
import JobCountByStatusChart from "../components/Analytics/JobCountByStatusChart"
import RevenueByYearChart from "../components/Analytics/RevenueByYearChart"
import RevenueByMonthChart from "../components/Analytics/RevenueByMonthChart"
import { useAuth } from "../AuthContext"
import RevenueSummary from "../components/Analytics/RevenueSummary"
import ReportGenerator from "../components/Analytics/ReportGenerator"

const Analytics = () => {
  const {user} = useAuth()
  console.log("user", user)
  return (
    !user?.role.includes("admin") ?
      <Container>
        <h1 className="text-danger text-center mt-5 fs-1"><FontAwesomeIcon icon={faXmarkCircle} /> Unauthorized Access</h1>
      </Container>
    :
    <Container>  
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white mb-4 '>
        <FontAwesomeIcon icon={faChartLine} className='fs-1'/> Analytics
      </h1>
      <RevenueSummary />
      <h2 className="text-center text-danger mb-3">Jobs Charts</h2>
      <Row className="mb-5">
        <Col>
          <JobCountChart />
        </Col>
        <Col>
          <JobCountByStatusChart />
        </Col>
      </Row>

      <h2 className="text-center text-danger mb-3">Revenue Charts</h2>
      <Row className="w-75 mx-auto mb-3">
        <Col>
          <RevenueByMonthChart />
        </Col>
      </Row>
      <Row className="w-75 mx-auto mb-3">
        <Col>
          <RevenueByYearChart />
        </Col>
      </Row>

      <ReportGenerator />
    </Container>
  )
}

export default Analytics



