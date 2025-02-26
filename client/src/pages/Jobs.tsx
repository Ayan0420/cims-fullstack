import { faCirclePlus, faFilter, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Form, Row } from "react-bootstrap"
import { useAuth } from "../AuthContext"
import toast from "react-hot-toast"
import JobOrderTable from "../components/JobOrderTable"
// import { Show } from "../utils/ConditionalRendering"
import { Link } from "react-router"
import { JobStatusEnum } from "../components/AddJobOrderForm"


const Jobs = () => {

  const {token} = useAuth();

  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [keyword, setKeyword] = useState("");
  const [sStatus, setSStatus] = useState<JobStatusEnum | string>("")
  // const [jobDate, setJobDate] = useState("")
  // const [page, setPage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/jobs`

  async function handleGetJobs(pg = "1", kw = "") {
    setIsLoading(true)
    try {
      const response = await axios.get(`${fetchUrl}/?page=${pg}&keyword=${kw}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setJobs(response.data)

      setIsLoading(false)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.data);
            if(!error.response?.data.message) {
                toast.error("Request failed", {duration: 5000})
                setIsLoading(false)
            } else {
                toast.error(error.response?.data.message, {duration: 5000})
                setIsLoading(false)
            }
        
        } else {
            console.error("Unexpected Error:", error);
            toast.error("Unexpected Error!", {duration: 5000})
            setIsLoading(false)
          
        }
    }  
  }

  useEffect(()=>{
    
    handleGetJobs();
  },[])

  // Handle search
  useEffect(() => {
    if (keyword.trim() !== '') {
      setIsLoading(true)
      setJobs([])
      // Set up a debounce timer
      const timer = setTimeout(() => {
        
          handleGetJobs("",keyword)
        
      }, 1000)
  
      return () => clearTimeout(timer)
    } else  {
      setIsLoading(true)
      handleGetJobs();
    }
  }, [keyword])


  // Handle status filter
  useEffect(() => {
    if ((sStatus as string ).trim()!== '') {
      setIsLoading(true)
      setJobs([])

      handleGetJobs("", sStatus as string )

    } else  {
      setIsLoading(true)
      handleGetJobs();
    }
  }, [sStatus])

  // Handle date filter
  // useEffect(() => {
  //   if (jobDate.trim() !== '') {
  //     setIsLoading(true)
  //     setJobs([])

  //     handleGetJobs("", jobDate)

  //   } else  {
  //     setIsLoading(true)
  //     handleGetJobs();
  //   }
  // }, [jobDate])

  // useEffect(()=>{
  //   console.log(jobs)
  // }, [jobs])


  return (
    <Container fluid>
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white d-flex align-items-center gap-2'><FontAwesomeIcon icon={faScrewdriverWrench} className='fs-1'/> 
        Job Orders
      </h1>
      <Link to="/create-job" className="btn btn-success btn-sm my-1">
        <FontAwesomeIcon icon={faCirclePlus} className=''/> Add New Job
      </Link>
    
      <Row>
        <Col xs={5}>
          <Form.Group  className="mb-2" controlId="name" style={{ position: 'relative' }}>
            <Form.Control
              className="p-1 px-2 border-1 rounded-2 border-dark bg-light"
              autoComplete="off"
              type="text"
              placeholder="Search J.O. Number, Tracking Code, Unit Model, or Work Performed"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={7}>
          <div className="d-flex align-items-center justify-content-end gap-3">
            <Form.Group className="mb-3 d-flex align-items-center gap-2 align-self-center" controlId="sStatus">
              <Form.Label className="mb-0 fw-bold"><FontAwesomeIcon icon={faFilter} /> Status:</Form.Label>
              <Form.Select
                  size="sm"
                  className="px-1 border-1 rounded-0 border-dark bg-light"
                  style={{width: "10rem"}}
                  required
                  onChange={(e) => setSStatus(e.target.value as JobStatusEnum)}
                  value={sStatus as string}
              >
                  <option selected value=""></option>
                  {Object.values(JobStatusEnum).map((status) => (
                      <option key={status} value={status}>
                          {status}
                      </option>
                  ))}
              </Form.Select>
            </Form.Group>
            {/* <Form.Group className="mb-3 d-flex align-items-center gap-2" controlId="sStatus">
              <Form.Label className="mb-0 fw-bold text-nowrap"><FontAwesomeIcon icon={faFilter} /> Specific Date:</Form.Label>
              <Form.Control
                  type="date"
                  size="sm"
                  className="px-1 border-1 rounded-0 border-dark bg-light"
                  required
                  onChange={(e) => setJobDate(e.target.value as JobStatusEnum)}
                  value={jobDate}
              >
              </Form.Control>
            </Form.Group> */}
          </div>
        </Col>
      </Row>
      
      
      <JobOrderTable jobs={jobs} isLoading={isLoading} handleGetJobs={handleGetJobs} />

    </Container>
  )
}

export default Jobs



// Types
export interface Customer {
  _id: string;
  cusName: string;
  cusAddress: string;
  cusPhones: string[];
  cusEmails: string[];
}

export interface JobDocument {
  _id: string;
  customerId: Customer;
  jobDate: string;
  unitModel: string;
  unitSpecs: string;
  unitAccessories: string;
  workPerformed: string;
  sCharge: number;
  sPayMeth: string[];
  sDownPayment: number;
  sBalance: number;
  sStatus: string[];
  sUnitDropOff: boolean;
  sRelDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  jobOrderNum: number;
  trackingCode: string;
  __v: number;
}