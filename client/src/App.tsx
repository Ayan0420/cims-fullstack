import "bootswatch/dist/cerulean/bootstrap.min.css"
// import "bootswatch/dist/flatly/bootstrap.min.css"
import "./App.css"
import { Navigate, Outlet } from "react-router"
import Sidebar from "./components/Sidebar"
import { Col, Container, Row } from "react-bootstrap"
import { useAuth, useTokenCleanupOnStartup } from "./AuthContext"
import Clock from "./components/Clock"
import { Show } from "./utils/ConditionalRendering"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


function App() {
  const { isAuthenticated } = useAuth();
  useTokenCleanupOnStartup();

  const [isOnline, setIsOnline] = useState(() => {
    // Retrieve the last known state from localStorage
    if(!localStorage.getItem("isOnline")) return true;
    return localStorage.getItem("isOnline") === "true";
  });
  
  useEffect(() => {
    window.electronAPI.onConnectivityStatus((status) => {
      console.log("Connectivity status changed:", status);
  
      const onlineStatus = status === "online";
      setIsOnline(onlineStatus);
      localStorage.setItem("isOnline", onlineStatus.toString()); // Store in localStorage
  
      toast(
        "Connectivity status changed: " + ` ${onlineStatus ? "🟢" : "🔴"} ` + status.toUpperCase(),
        { duration: 5000 }
      );
    });

    window.electronAPI.onCheckSyncStatus((status: {syncStatus: number, message: string})=> {
      if(status.syncStatus === 0) toast.loading(status.message, { duration: Infinity });
      if(status.syncStatus === 1) {
        toast.dismiss(); // Remove loading toast
        toast.success(status.message, { duration: 10000 });
      }
    });
  }, []);

  return (
    <>
    <Show when={!isOnline}>
      <div className="fixed-bottom text-center fw-bold" style={{zIndex: 9998, color: "red", backgroundColor: "black"}}>
        OFFLINE MODE
      </div>
    </Show>
    <div className='sticky-top' style={{zIndex: 9999}}>
      <Clock />
    </div>
    <Container fluid className="p-0">
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
