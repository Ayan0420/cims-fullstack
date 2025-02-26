import { faArrowAltCircleLeft, faComment, faEye, faFileInvoiceDollar, faPrint, faScrewdriver, faScrewdriverWrench, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link, useParams, useSearchParams } from "react-router"
import { useAuth } from "../AuthContext"
import { JobDocument } from "./Jobs"
import axios from "axios"
import moment from "moment"
import UpdateOrderModal from "../components/UpdateOrderModal"
import { Show } from "../utils/ConditionalRendering"
import LoadingOverlay from "../components/LoadingOverlay"

const JobDetails = () => {
    const { id } = useParams();
    const [ searchParams ] = useSearchParams();

    const { token } = useAuth();
    
    const [jobDetails, setJobDetails] = useState<JobDocument | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    const fetchUrl = `${import.meta.env.VITE_API_URL}/api/jobs/${id}`;
    
    async function getJobDetails() {

        setIsLoading(true);

        try {
            const response = await axios.get(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setJobDetails(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching job details", error);
            setIsLoading(false);
        }
    }

    function handlePrintJobOrder(){
       
      (window as any).open(`${import.meta.env.VITE_API_URL}/report-generator/${id}`, '_blank').focus();
        
          
    }

    useEffect(() => {
        
      // setIsLoading(true);
      //   setTimeout(() => {
      //     getJobDetails();
      //   }, 2000)
        getJobDetails();

    }, []);

    useEffect(() =>{
        console.log(jobDetails);
    }, [jobDetails]);

    
    function numberToComma (num: number | undefined) {
        if(!num) return "";
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  return (
    <div className="position-relative min-vh-100">
    <Show when={isLoading}>
      <LoadingOverlay message="Loading Job Details..."/>
    </Show>
    <Container fluid className="job-details">
      <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white d-flex align-items-center gap-2'><FontAwesomeIcon icon={faScrewdriverWrench} className='fs-1'/> 
        Job Order {jobDetails?.jobOrderNum}
      </h1>
      <div className="d-flex justify-content-between">
        <Link to={searchParams.get('prev') ? searchParams.get('prev') as string: '/jobs'}>
          <Button size="sm" variant='secondary mt-2 mb-2' >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />  Go back
          </Button>
        </Link>
        <div className="d-flex gap-2">
          {jobDetails && <UpdateOrderModal jobDetails={jobDetails} getJobDetails={getJobDetails}/>  }
          <Button size="sm" variant="info align-self-center" onClick={handlePrintJobOrder}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </Button>
        </div>
      </div>
      <Row className="px-2">
        <Col className="d-flex justify-content-between">
            <div className="d-flex gap-4">
              <div className="d-flex align-items-center gap-2">
                <strong>Job Order Number:</strong>  <span className="">{jobDetails?.jobOrderNum}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <strong>Tracking Code:</strong>  <span className="bg-dark text-light px-2 rounded-1">{jobDetails?.trackingCode}</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 fs-5">
              <strong>Order Date:</strong>  <span className="">{jobDetails?.jobDate ? moment(jobDetails?.jobDate).format('MMMM DD, YYYY') : ''}</span>
            </div>
        </Col>

      </Row>

      {/* Customer Information */}
      <section className="p-3">
        <Row className=''>
          <h5 className=''><FontAwesomeIcon icon={faUser} /> Customer Information: <Link to={`/customers/${jobDetails?.customerId._id}?prev=${jobDetails?._id}`}><Button size="sm" variant="outline-info"><FontAwesomeIcon icon={faEye} /> View Customer</Button></Link></h5>
        </Row>
        <Row>
          
          <Col  className="border-top border-start py-2">
            <strong>Name:</strong>  <span>{jobDetails?.customerId.cusName}</span>
          </Col>
          <Col className="border-top border-start py-2">
            <strong>Phone:</strong>  <span>{jobDetails?.customerId.cusPhones.join(', ')}</span>
          </Col>
          <Col className="border-top border-start border-end py-2">
            <strong>Email:</strong>  <span>{
              jobDetails?.customerId.cusEmails.length === 0 ? 'N/A' :
              jobDetails?.customerId.cusEmails.join(', ')
              }</span>
          </Col>
        </Row>
        <Row>
          <Col className="border py-2">
            <strong>Address:</strong>  <span>{jobDetails?.customerId.cusAddress}</span>
          </Col>
        </Row>
      </section>
      

      {/* Unit Specification */}
      {/* <section className="border rounded-1 p-3 mt-3">
        <Row className=''>
          <h5 className=''>Unit Specifications</h5>
        </Row>
        <Row>
          <Col xs={3}>
            <strong>Model:</strong>  <span>{JobDetails?.unitModel}</span>
          </Col>
          <Col xs={3}>
            <strong>Accessories:</strong>  <span>{JobDetails?.unitAccessories}</span>
          </Col>
          <Col xs={6}>
            <strong>Specs/Other Info:</strong>  <span>{JobDetails?.unitSpecs}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <strong>Unit Drop Off?:</strong>  <span>{JobDetails?.sUnitDropOff ? 'Yes' : 'No'}</span>
          </Col>
        </Row>
      </section> */}

      {/* Job Details */}
      <section className="px-3 py-1">
        <Row className=''>
          <h5 className=''><FontAwesomeIcon icon={faScrewdriver} /> Job Order Details:</h5>
        </Row>
        <Row className="">
          <Col xs={6} className="border-top border-start py-2">
            <strong>Work Performed:</strong>  <span className="text-uppercase">{jobDetails?.workPerformed}</span>
          </Col>
          <Col xs={2} className="border-top border-start py-2">
            <strong>Job Status:</strong>  <span>{jobDetails?.sStatus}</span>
          </Col>
          <Col xs={4} className="border-top border-start border-end py-2">
            <strong>Date Released/Returned:</strong>  <span>{jobDetails?.sRelDate ? jobDetails?.sRelDate : 'N/A'}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={3} className="border-top border-start py-2">
            <strong>Model:</strong>  <span>{jobDetails?.unitModel}</span>
          </Col>
          <Col xs={3} className="border-top border-start py-2">
            <strong>Accessories:</strong>  <span>{jobDetails?.unitAccessories}</span>
          </Col>
          <Col xs={6} className="border-top border-start border-end py-2">
            <strong>Specs/Other Info:</strong>  <span>{jobDetails?.unitSpecs}</span>
          </Col>
        </Row>
        <Row>
          <Col className="border py-2">
            <strong>Unit Drop Off?:</strong>  <span>{jobDetails?.sUnitDropOff ? 'Yes' : 'No'}</span>
          </Col>
        </Row>

        <Row className="py-2 mt-3 ">
          <h5 className="mb-1"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Payment Details:</h5>
          <Col xs={4} className="border-top border-start border-bottom py-2">
          
            <strong>Payment Method:</strong>  <span>{jobDetails?.sPayMeth}</span>
          </Col>
          <Col className="border-top border-start border-bottom py-2">
            <strong>Service Charge:</strong>  <span className="fs-5">₱{
              jobDetails?.sCharge ?
              numberToComma(jobDetails?.sCharge) :
              0
            }</span>
          </Col>
          <Col className="border-top border-start border-bottom py-2">
            <strong>Amount Paid:</strong>  <span className="fs-5">₱{
              jobDetails?.sDownPayment ?
              numberToComma(jobDetails?.sDownPayment) :
              0
            }</span>
          </Col>
          <Col className="border py-2">
            <strong>Payment Balance:</strong>  <span className={
              `fs-5 fw-bold ${jobDetails?.sBalance ? 'text-danger' : 'text-success'}`
            }>{
              jobDetails?.sBalance ?
              "₱" + numberToComma(jobDetails?.sBalance) :
              "Paid"
            }</span>
          </Col>
        </Row>
      </section>

      {/* Notes */}
      <section className="p-3 ">
        <Row className=''>
          <h5 className=''><FontAwesomeIcon icon={faComment} /> Technician's Notes:</h5>
        </Row>
        <Row>
          <Col className="border py-2">
            <span className="d-block">{jobDetails?.notes?.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}</span>
          </Col>
        </Row>
      </section>

      <section>

        <p className="text-sm text-info">To delete this job order, click the "UPDATE" button and scroll down at the bottom and click the Trash icon.</p>
      </section>


      
    </Container>
    </div>
  )
}

export default JobDetails