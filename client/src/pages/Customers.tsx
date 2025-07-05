import { faCirclePlus, faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { useEffect, useState } from "react"
import { Col, Container, Form, Row } from "react-bootstrap"
import { useAuth } from "../AuthContext"
import toast from "react-hot-toast"
// import { Show } from "../utils/ConditionalRendering"
// import { Link } from "react-router"
import { CustomerDocument } from "./AddJob"
import CustomerTable from "../components/CustomerTable"
import OpenWindowButton from "../components/electron/OpenWindowButton"


const Customers = () => {

  const {token} = useAuth();

  const [customers, setCustomers] = useState<CustomerDocument[]>([]);
  const [keyword, setKeyword] = useState("");
  // const [page, setPage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/customers`

  async function handleGetCustomer(pg = "1", kw = "") {
    setIsLoading(true)
    try {
      const response = await axios.get(`${fetchUrl}/?page=${pg}&keyword=${kw}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCustomers(response.data)

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
    
    handleGetCustomer();
  },[])

  // Handle search
  useEffect(() => {
    if (keyword.trim() !== '') {
      setIsLoading(true)
      setCustomers([])
      // Set up a debounce timer
      const timer = setTimeout(() => {
        
          handleGetCustomer("",keyword)
        
      }, 1000)
  
      return () => clearTimeout(timer)
    } else  {
      setIsLoading(true)
      handleGetCustomer();
    }
  }, [keyword])


  // useEffect(()=>{
  //   console.log(jobs)
  // }, [jobs])


  return (
    <Container fluid>
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-light d-flex align-items-center gap-2'><FontAwesomeIcon icon={faUsers} className='fs-1'/> 
        Customers
      </h1>
      {/* <Link to="/create-customer" className="btn btn-success btn-sm my-1">
        <FontAwesomeIcon icon={faCirclePlus} className=''/> Add New Customer
      </Link> */}
      <OpenWindowButton route="create-customer" variant="success my-1" text="Add New Customer" size="sm" icon={{icon: faCirclePlus}} />
    
      <Row>
        <Col xs={5}>
          <Form.Group  className="mb-2" controlId="name" style={{ position: 'relative' }}>
            <Form.Control
              className="p-1 px-2 border-1 rounded-2 border-dark bg-light"
              autoComplete="off"
              type="text"
              placeholder="Search Name or Address"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={7}>
          
        </Col>
      </Row>
      
      <CustomerTable customers={customers} isLoading={isLoading} handleGetCustomer={handleGetCustomer} />

    </Container>
  )
}

export default Customers



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