import { faCirclePlus, faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Card, Col, Container, Image, Row, Spinner } from "react-bootstrap"
import { Link } from "react-router"
import { useAuth } from "../AuthContext"
import Clock from "../components/Clock"
// import { JobStatusEnum } from "../components/AddJobOrderForm"


const Dashboard = () => {

  const { token } = useAuth()
  const monthNow = moment().format('MM');
  const yearNow = moment().format('YYYY');

  const [yearlyJobsCount, setYearlyJobsCount] = useState(0)
  const [monthlyJobsCount, setMonthlyJobsCount] = useState(0);
  const [onGoingCount, setOnGoingCount] = useState(0);
  const [backJobCount, setBackJobCount] = useState(0)
  const [pdRelCount, setPdRelCount] = useState(0);
  const [pdUnRelCount, setPdUnRelCount] = useState(0);
  const [doneUnRelCount, setDoneUnRelCount] = useState(0);
  const [dmdRelCount, setDmdRelCount] = useState(0);
  const [dmdUnRelCount, setDmdUnRelCount] = useState(0);
  const [totalUnRelCount, setTotalUnRelCount] = useState(0)
  const [totalRelCount, setTotalRelCount] = useState(0)




  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/data-vis/count`

  async function getStats(filter: string, keyword: string) {
    
    try {
      const response = await axios.get(fetchUrl+`?${filter}=${keyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data)
      return response.data.count;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return null;
    }
  }

  function getAllStats() {
    Promise.all([
      getStats('year', yearNow),
      getStats('yearmonth', yearNow + '-' + monthNow),
      getStats('status', "ONGOING"),
      getStats('status', 'BACK JOB'),
      getStats('status', 'DONE/UNRELEASED'),
      getStats('status', 'PAID/UNRELEASED'),
      getStats('status', 'DMD/UNRELEASED'),
      getStats('status', 'UNRELEASED'),
      getStats('status', 'PAID/RELEASED'),
      getStats('status', 'DMD/RELEASED'),
      getStats('status', 'RELEASED'),
    ]).then(([
      yearlyJobsCount, 
      monthlyJobsCount, 
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
      setYearlyJobsCount(yearlyJobsCount || 0);
      setMonthlyJobsCount(monthlyJobsCount || 0);
      setOnGoingCount(onGoingCount || 0);
      setBackJobCount(unclaimed || 0);
      setDoneUnRelCount(doneUnRelCount || 0);
      setPdUnRelCount(pdUnRelCount || 0);
      setDmdUnRelCount(dmdUnRelCount || 0);
      setTotalUnRelCount(totalUnRelCount || 0);
      setPdRelCount(pdRelCount || 0);
      setDmdRelCount(dmdRelCount || 0);
      setTotalRelCount(totalRelCount || 0);
    }).catch(console.error);
  }

  useEffect(() => {

    // setTimeout(() => {
    //   getAllStats()
    // }, 2000)

    getAllStats()


    
  }, [])

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
        <h5 className="text-dark">Job Order Stats:</h5>
        <Row className="">
          <Col as={Link} to={`jobs?year=${yearNow}`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Jobs ({yearNow})</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-info fs-2 fw-bold m-0">{yearlyJobsCount ? yearlyJobsCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?year=${yearNow}&month=${monthNow}`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Jobs ({moment(monthNow, "MM").format('MMMM')})</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-info fs-2 fw-bold m-0">{monthlyJobsCount ? monthlyJobsCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=ONGOING`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">On Going</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-warning fs-2 fw-bold m-0">{onGoingCount ? onGoingCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=BACK JOB`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Back Job</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{backJobCount ? backJobCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
        <Row>
        <Col as={Link} to={`jobs?status=DONE/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Done/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{doneUnRelCount ? doneUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=PAID/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Paid/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{pdUnRelCount ? pdUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=DMD/UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">DMD/Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{dmdUnRelCount ? dmdUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=UNRELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Total Unreleased</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-warning fs-2 fw-bold m-0">{totalUnRelCount ? totalUnRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
        <Row>
          <Col as={Link} to={`jobs?status=PAID/RELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Paid/Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-success fs-2 fw-bold m-0">{pdRelCount ? pdRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=DMD/RELEASED`} className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">DMD/Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-danger fs-2 fw-bold m-0">{dmdRelCount ? dmdRelCount : <Spinner />}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          <Col as={Link} to={`jobs?status=RELEASED`}className="mb-3">
            <Card className="h-100 stat-card">
              <Card.Header className="text-center fw-bold">Total Released</Card.Header>
              <Card.Body>
                <Card.Title className="text-center text-primary fs-2 fw-bold m-0">{totalRelCount ? totalRelCount : <Spinner />}</Card.Title>
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