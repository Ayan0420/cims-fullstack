import { faArrowLeft, faArrowRight, faCirclePlus, faFilter, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Form, Pagination, Row } from "react-bootstrap"
import { useAuth } from "../AuthContext"
import toast from "react-hot-toast"
import JobOrderTable from "../components/JobOrderTable"
// import { Show } from "../utils/ConditionalRendering"
import { useSearchParams } from "react-router"
import { JobStatusEnum } from "../components/AddJobOrderForm"
import OpenWindowButton from "../components/electron/OpenWindowButton"
// import { Show } from "../utils/ConditionalRendering"
// import moment from "moment"


const Jobs = () => {

  const {token} = useAuth();
  const [ searchParams ] = useSearchParams();
  const queryStatus = searchParams.get("status");
  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");

  const [jobs, setJobs] = useState<JobDocument[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sStatus, setSStatus] = useState<JobStatusEnum | string>("")
  const [year, setYear] = useState("")
  const [month, setMonth] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/jobs`

  async function handleGetJobs(pg = "1", kw = "", status = "", year = "", month="") {
    setIsLoading(true)
    try {
      const response = await axios.get(`${fetchUrl}/?page=${pg}&keyword=${kw}&status=${status}&year=${year}&month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setJobs(response.data.jobs)
      setPageCount(response.data.pages)

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

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };

  const getPaginationItems = () => {
    const items = [];
    // If total pages are 10 or less, simply list them all.
    if (pageCount <= 10) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(i);
      }
    } else {
      // When there are more than 10 pages, use different logic based on the current page.
      if (page <= 5) {
        // Near the beginning: show pages 1 to 7, then an ellipsis, then the last page.
        for (let i = 1; i <= 7; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(pageCount);
      } else if (page >= pageCount - 4) {
        // Near the end: show the first page, an ellipsis, then pages from (pageCount-6) to pageCount.
        items.push(1);
        items.push("ellipsis");
        for (let i = pageCount - 6; i <= pageCount; i++) {
          items.push(i);
        }
      } else {
        // In the middle: show the first page, an ellipsis, a window around the current page, then another ellipsis and the last page.
        items.push(1);
        items.push("ellipsis");
        for (let i = page - 2; i <= page + 2; i++) {
          items.push(i);
        }
        items.push("ellipsis");
        items.push(pageCount);
      }
    }
    return items;
  };
  const paginationItems = getPaginationItems();  

  // Hanlde Query Params
  useEffect(()=>{
    
    if(queryStatus) {
      setSStatus(queryStatus)
    }

    if(queryYear) {
      setYear(queryYear)
    }

    if(queryMonth) {
      setMonth(queryMonth)
    }

  },[])


  // Handle Search and Filters
  useEffect(() => {

      setIsLoading(true)
      setJobs([])
      // Set up a debounce timer
      const timer = setTimeout(() => {
        
          handleGetJobs(page.toString(), keyword, sStatus, year, month)
        
      }, 500)
  
      return () => clearTimeout(timer)
  
  }, [page, keyword, sStatus, year, month])

  return (
    <Container fluid>

      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white d-flex align-items-center gap-2'><FontAwesomeIcon icon={faScrewdriverWrench} className='fs-1'/> 
        Job Orders
      </h1>
      {/* <Link to="/create-job" className="btn btn-success btn-sm my-1">
        <FontAwesomeIcon icon={faCirclePlus} className=''/> Add New Job
      </Link> */}
      <OpenWindowButton variant="success my-1" text="Add New Job" route="create-job" size={'sm'} icon={{icon: faCirclePlus}}/>
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
                  className="px-1 border-1 rounded-1 border-dark bg-light text-dark fw-bold"
                  style={{width: "10rem"}}
                  required
                  onChange={(e) => setSStatus(e.target.value as JobStatusEnum)}
                  value={sStatus as string}
              >
                  <option selected value="">All</option>
                  {Object.values(JobStatusEnum).map((status) => (
                      <option key={status} value={status}>
                          {status}
                      </option>
                  ))}
                  <option value="UNRELEASED">All Unreleased</option>
                  <option value="RELEASED">All Released</option>
              </Form.Select>
            </Form.Group>
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
        </Col>
      </Row>
      
      <Pagination size="sm" className="mb-1">
        {page !== 1 && (
          <Pagination.Item onClick={handlePrevPage} linkClassName="text-dark">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Pagination.Item>
        )}

        {page === 1 && (
          <Pagination.Item onClick={handlePrevPage} linkClassName="text-secondary disabled">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Pagination.Item>
        )}

        {paginationItems.map((item, index) =>
          typeof item === "number" ? (
            <Pagination.Item
              key={index}
              active={page === item}
              onClick={() => setPage(item)}
              linkClassName="text-dark"
            >
              {item}
            </Pagination.Item>
          ) : (
            <Pagination.Ellipsis linkClassName="text-dark" key={index} disabled />
          )
        )}

        {page !== pageCount && (
          <Pagination.Item onClick={handleNextPage} linkClassName="text-dark">
            <FontAwesomeIcon icon={faArrowRight} />
          </Pagination.Item>
        )}

        {page === pageCount && (
          <Pagination.Item onClick={handleNextPage} linkClassName="text-secondary disabled">
            <FontAwesomeIcon icon={faArrowRight} />
          </Pagination.Item>
        )}
      </Pagination>
      


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