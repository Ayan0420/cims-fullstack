import "bootswatch/dist/cerulean/bootstrap.min.css"
// import "bootswatch/dist/flatly/bootstrap.min.css"
import "./App.css"
import { Navigate, Outlet } from "react-router"
import Sidebar from "./components/Sidebar"
import { Col, Container, Row } from "react-bootstrap"
import { useAuth, useTokenCleanupOnStartup } from "./AuthContext"
import Clock from "./components/Clock"

function App() {
  const { isAuthenticated } = useAuth();
  useTokenCleanupOnStartup();

  return (
    <>
      <div className='sticky-top' style={{zIndex: 9999}}>
        <Clock />
      </div>
      <Container fluid className="p-0 bg-light">
        <Row className="g-0">
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10}>
            {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
          </Col>
        </Row>
      </Container>
    
    </>
  )
}

export default App
