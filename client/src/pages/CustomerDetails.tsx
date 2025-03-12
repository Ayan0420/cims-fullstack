import { faScrewdriver, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import  { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { useParams } from "react-router"
import { useAuth } from "../AuthContext"
import axios from "axios"
// import moment from "moment"
import { Show } from "../utils/ConditionalRendering"
import LoadingOverlay from "../components/LoadingOverlay"
import { CustomerDocument } from "./AddJob"
import JobTableCustomerPage from "../components/JobTableCustomerPage"
import UpdateCustomerModal from "../components/UpdateCustomerModal"

const CustomerDetails = () => {
    const { id } = useParams();
    const { token } = useAuth();
  
    
    const [customerDetails, setCustomerDetails] = useState<CustomerDocument | null>(null);
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchUrl = `${import.meta.env.VITE_API_URL}/api/customers/${id}`;
    
    async function getCustomerDetails() {

        setIsLoading(true);

        try {
            const response = await axios.get(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCustomerDetails(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching job details", error);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        
        // setTimeout(() => {
        //   getJobDetails();
        // }, 2000)
        getCustomerDetails();

    }, []);

    useEffect(() =>{
        console.log(customerDetails);
        if(customerDetails) {
          setJobs(customerDetails.jobOrders)
        }
    }, [customerDetails]);

  

  return (
    <div className="position-relative min-vh-100">
    <Show when={!customerDetails}>
      <LoadingOverlay message="Loading Job Details..."/>
    </Show>
    <Container fluid className="job-details">
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white d-flex align-items-center gap-2'><FontAwesomeIcon icon={faUser} className='fs-1'/> 
        Customer Details
      </h1>
      <div className="d-flex justify-content-end">
        {/* <Link to={searchParams.get("prev") ? `/jobs/${searchParams.get("prev")}` : '/customers'}>
          <Button size="sm" variant='secondary mt-2 mb-2' >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />  Go back
          </Button>
        </Link> */}
        <div className="d-flex gap-2">
          {customerDetails && <UpdateCustomerModal customerDetails={customerDetails} getCustomerDetails={getCustomerDetails}/>  }
          
        </div>
      </div>

      {/* Customer Information */}
      <section className="p-3">
        <Row className=''>
          <h5 className=''><FontAwesomeIcon icon={faUser} /> Customer Information:</h5>
        </Row>
        <Row>
          <Col  className="border-top border-start py-2">
            <strong>Name:</strong>  <span>{customerDetails?.cusName}</span>
          </Col>
          <Col className="border-top border-start py-2">
            <strong>Phone:</strong>  <span>{customerDetails?.cusPhones.join(', ')}</span>
          </Col>
          <Col className="border-top border-start border-end py-2">
            <strong>Email:</strong>  <span>{
              customerDetails?.cusEmails.length === 0 ? 'N/A' :
              customerDetails?.cusEmails.join(', ')
              }</span>
          </Col>
        </Row>
        <Row>
          <Col className="border py-2">
            <strong>Address:</strong>  <span>{customerDetails?.cusAddress}</span>
          </Col>
        </Row>
      </section>

      {/* Job Section */}
      <section className="p-1">
        <Row className='px-2'>
          <h5 className=''><FontAwesomeIcon icon={faScrewdriver} /> Job Orders:</h5>
        </Row>
        {customerDetails && <JobTableCustomerPage jobs={jobs} isLoading={isLoading} />}

      </section>
 

      <section>

        <p className="text-sm text-info">To delete this customer to the database , click the "UPDATE" button and scroll down at the bottom and click the Trash icon.</p>
      </section>


      
    </Container>
    </div>
  )
}

export default CustomerDetails