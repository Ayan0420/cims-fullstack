import { faCirclePlus, faFilter, faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Card, Col, Container, Form, Image, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router"
import { useAuth } from "../AuthContext"
// import { JobStatusEnum } from "../components/AddJobOrderForm"


const Dashboard = () => {

  const { token } = useAuth()
  // const monthNow = moment().format('MM');
  const yearNow = moment().format('YYYY');

  const [month, setMonth] = useState("");
  const [year, setYear] = useState(yearNow);
  const [jobsCount, setJobsCount] = useState(0);
  const [onGoingCount, setOnGoingCount] = useState(0);
  const [backJobCount, setBackJobCount] = useState(0)
  const [pdRelCount, setPdRelCount] = useState(0);
  const [pdUnRelCount, setPdUnRelCount] = useState(0);
  const [doneUnRelCount, setDoneUnRelCount] = useState(0);
  const [dmdRelCount, setDmdRelCount] = useState(0);
  const [dmdUnRelCount, setDmdUnRelCount] = useState(0);
  const [totalUnRelCount, setTotalUnRelCount] = useState(0)
  const [totalRelCount, setTotalRelCount] = useState(0)

  const [isLoading, setIsLoading] = useState(false);

  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/data-vis/count`

  async function getStats(status = "", year = "" , month = "" ) {
    
    try {
      const response = await axios.get(fetchUrl+`?status=${status}&year=${year}&month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data)
      return response.data.count ? response.data.count : 0;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }

  function getAllStats() {
    setIsLoading(true)
    Promise.all([
      getStats("", year, month),
      getStats("ONGOING", year, month),
      getStats('BACK JOB', year, month),
      getStats('DONE/UNRELEASED', year, month),
      getStats('PAID/UNRELEASED', year, month),
      getStats('DMD/UNRELEASED', year, month),
      getStats('UNRELEASED', year, month),
      getStats('PAID/RELEASED', year, month),
      getStats('DMD/RELEASED', year, month),
      getStats('RELEASED', year, month),
    ]).then(([
      jobsCount, 
      onGoingCount, 
      unclaimed,
      doneUnRelCount,
      pdUnRelCount,
      dmdUnRelCount,
      totalUnRelCount,
      pdRelCount,
      dmdRelCount,
      totalRelCount
    ]) => {
      setJobsCount(jobsCount || 0);
      setOnGoingCount(onGoingCount || 0);
      setBackJobCount(unclaimed || 0);
      setDoneUnRelCount(doneUnRelCount || 0);
      setPdUnRelCount(pdUnRelCount || 0);
      setDmdUnRelCount(dmdUnRelCount || 0);
      setTotalUnRelCount(totalUnRelCount || 0);
      setPdRelCount(pdRelCount || 0);
      setDmdRelCount(dmdRelCount || 0);
      setTotalRelCount(totalRelCount || 0);
      setIsLoading(false)
    }).catch(console.error);
  }

  useEffect(() => {

    // setTimeout(() => {
    //   getAllStats()
    // }, 2000)

    getAllStats()


    
  }, [month, year])

  return (
    <>
    
    <Container
      fluid
      className="py-3 min-vh-100 d-flex flex-column justify-content-center align-items-center"
    >
       <Image fluid src='./comtech-logo.png' width={200}  className="mb-2" />
      <h4 className="text-dark">Welcome to <span className="text-danger fw-bolder">C</span>omtech <span className="text-danger fw-bolder">I</span>nformation <span className="text-danger fw-bolder">M</span>anagement <span className="text-danger fw-bolder">S</span>ystem</h4>
      <p className="text-center mt-2" style={{ maxWidth: '500px' }}>
        Manage your job orders, track progress, analyze data and streamline your record keeping.
      </p>
      <div className="d-flex justify-content-center gap-1 mb-4">
        <Link to="create-job" className="btn btn-success mt-3 d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCirclePlus} className='fs-4'/> Add New Job Order
        </Link>
        <Link to="jobs" className="btn btn-primary mt-3 d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={faFolderOpen} className='fs-4'/> View all Jobs
        </Link>
      </div>

      {/* Cards row – add margin-top and restrict width */}
      <Container className="align-self-start ">
        <div className="d-flex justify-content-between">
          <h5 className="text-dark">Job Order Stats: <span className="fw-bold bg-primary-subtle px-3 py-1 rounded-1 text-uppercase">{month || year ? "" : "All time"}{month ? moment(month, "MM").format('MMMM') : ""} {year ? moment(year).format('YYYY'): ""}</span></h5>
          <div className="d-flex gap-4">
            <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="year">
              <Form.Label className="mb-0 fw-bold text-nowrap"><FontAwesomeIcon icon={faFilter} /> Year:</Form.Label>
              <Form.Select
                  size="sm"
                  className="px-1 border-1 rounded-1 border-dark bg-light text-dark fw-bold"
                  style={{width: "5rem"}}
                  required
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
              >
                  <option selected value="">------</option>
                  {Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                      <option key={yr} value={yr}>
                          {yr}
                      </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="month">
              <Form.Label className="mb-0 fw-bold text-nowrap"><FontAwesomeIcon icon={faFilter} /> Month:</Form.Label>
              <Form.Select
                  size="sm"
                  className="px-1 border-1 rounded-1 border-dark bg-light text-dark fw-bold"
                  style={{width: "5rem"}}
                  required
                  onChange={(e) => setMonth(e.target.value)}
                  value={month}
              >
                  <option selected value="">------</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
              </Form.Select>
            </Form.Group>
          </div>
        </div>
        <Row className="">
          {/* <Col as={Link} to={`jobs?year=${yearNow}`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Jobs ({yearNow})</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-info fs-2 fw-bold m-0">{!isLoading ? yearlyJobsCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col> */}
          <Col as={Link} to={`jobs?year=${year}&month=${month}`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">All Jobs</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-info fs-2 fw-bold m-0">{!isLoading ? jobsCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=ONGOING`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">On Going</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-warning fs-2 fw-bold m-0">{!isLoading ? onGoingCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=BACK JOB`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Back Job</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{!isLoading ? backJobCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
        <Row>
        <Col as={Link} to={`jobs?year=${year}&month=${month}&status=DONE/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Done/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{!isLoading ? doneUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=PAID/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Paid/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{!isLoading ? pdUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=DMD/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">DMD/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{!isLoading ? dmdUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Total Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-warning fs-2 fw-bold m-0">{!isLoading ? totalUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
        <Row>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=PAID/RELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Paid/Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-success fs-2 fw-bold m-0">{!isLoading ? pdRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=DMD/RELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">DMD/Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{!isLoading ? dmdRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${year}&month=${month}&status=RELEASED`}className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Total Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{!isLoading ? totalRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
    </Container>
    </>
  )
}

export default Dashboard