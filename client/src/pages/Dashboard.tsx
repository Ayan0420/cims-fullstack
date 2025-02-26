import { faCirclePlus, faFolderOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Card, Col, Container, Image, Row } from "react-bootstrap"
import { Link } from "react-router"


const Dashboard = () => {
  return (

    <Container
      fluid
      className="py-3 min-vh-100 d-flex flex-column justify-content-center align-items-center"
    >
       <Image fluid src='./comtech-logo.png' width={400}  className="mb-2" />
      <h4 className="text-dark">Welcome to <span className="text-danger fw-bolder">C</span>omtech <span className="text-danger fw-bolder">I</span>nformation <span className="text-danger fw-bolder">M</span>anagement <span className="text-danger fw-bolder">S</span>ystem</h4>
      <p className="text-center mt-2" style={{ maxWidth: '500px' }}>
        Manage your job orders, track progress, analyze data and streamline your record keeping.
      </p>
      <div className="d-flex justify-content-center gap-1">
        <Link to="create-job" className="btn btn-success mt-3 d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCirclePlus} className='fs-4'/> Add New Job Order
        </Link>
        <Link to="jobs" className="btn btn-primary mt-3 d-flex align-items-center gap-2">
        <FontAwesomeIcon icon={faFolderOpen} className='fs-4'/> View all Jobs
        </Link>
      </div>

      {/* Cards row – add margin-top and restrict width */}
      <Row className="mt-4 w-75">
        <Col as={Link} to="jobs" md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Active Orders</Card.Title>
              <Card.Text>
                You currently have <strong>12</strong> active job orders.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Clients</Card.Title>
              <Card.Text>
                Manage client details and communication history.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>
                Generate insightful reports to monitor performance.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  )
}

export default Dashboard