import { useEffect, useState } from 'react'
import axios from 'axios'
import AddJobOrderForm from '../components/AddJobOrderForm'
import AddCustomerForm from '../components/AddCustomerForm'
import { Button, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faPenToSquare, faPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import { Show } from '../utils/ConditionalRendering'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'



const AddJob = () => {
  const [isAddingCus, setIsAddingCus] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDocument | null>(null)

  const { token } = useAuth()

  const fetchUrl = `${import.meta.env.VITE_API_URL}/api/customers?keyword=`
  
  useEffect(() => {
    // Set up a debounce timer
    setIsSearching(true)
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        axios
          .get(`${fetchUrl}${encodeURIComponent(searchTerm)}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then((response) => {
            console.log(response.data)
            setSearchResults(response.data)
            setIsSearching(false)
          })
          .catch((error) => {
            console.error('Error fetching search results', error)
          })
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }, 1000)

    // Clear the timer if searchTerm changes before 2 seconds
    return () => clearTimeout(timer)
  }, [searchTerm])

  function selectCustomer(customer: CustomerDocument) { 
    setSelectedCustomer(customer)
    toast.success(`${customer.cusName} was selected successfully!`, {duration: 5000})
  }

  function setNewlyCreatedCustomer(customer: CustomerDocument) {
    setSelectedCustomer(customer)
    setIsAddingCus(false)
    toast.success(`${customer.cusName} was selected successfully!`, {duration: 5000})
  }

  // useEffect(() => {
  //   console.log(selectedCustomer)
  // }, [selectedCustomer])


  return (
    !token ? <h1 className='text-center text-danger my-5'>Login First!</h1>:
    <Container fluid className='position-relative min-vh-100'>
        <h1 className='border-bottom pb-2 pt-3 text-danger sticky-top bg-white'><FontAwesomeIcon icon={faPenToSquare} className='fs-1'/> 
          Add New Job Order
        </h1>

        <Show when={!isAddingCus && selectedCustomer === null}>
            <Container fluid className='mt-5 py-5 border w-75'>
              <h4 className='text-center mb-3'>Select a Customer</h4>
              <Row className='d-flex align-items-center justify-content-center flex-column gap-2'>
                {/* <Col className='shrink text-center'>
                  <Button variant='success' onClick={() => setIsAddingCus(!isAddingCus)}>
                    <FontAwesomeIcon icon={faPlus} /> Add New Customer
                  </Button>
                </Col> */}
                
                {/* <Col xs={1}>
                  <h5 className='text-dark text-center m-0'>or</h5>
                </Col> */}

                <Col className='align-self-center w-50'>
                  <Form>
                    <Form.Group  className="" controlId="name" style={{ position: 'relative' }}>
                      <Form.Control
                        className="p-1 px-2 border-1 rounded-2 border-dark bg-light text-uppercase"
                        autoComplete="off"
                        type="text"
                        placeholder="Search customer name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%', // Immediately below the input
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            maxHeight: '300px',
                            overflowY: 'auto'
                          }}
                        >

                          <Show when={searchTerm !== '' && isSearching}>
                            <div className='mb-0 text-center py-3'>
                              <Spinner animation="border" size="sm" /> Searching... 
                            </div>
                          </Show>

                          <Show when={searchResults.length === 0 && searchTerm !== "" && !isSearching}>
                            <div className='d-flex flex-column gap-1 align-items-center justify-content-center py-2'>
                              <p className='mb-0 py-2 text-center'>No Results. Add new instead.</p>
                              <Button variant='success' onClick={() => setIsAddingCus(!isAddingCus)}>
                                <FontAwesomeIcon icon={faPlus} /> Add New Customer
                              </Button>
                            </div>
                          </Show>

                          <Show when={searchResults.length > 0 && !isSearching}>
                            <ListGroup variant="flush">
                              {searchResults.map((customer: CustomerDocument) => (
                                <ListGroup.Item key={customer._id} onClick={() => selectCustomer(customer)} className='search-result'>
                                  {customer.cusName} | {customer.cusAddress}
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </Show>
                        
                        </div>
                    </Form.Group>
                  </Form>
                  
                </Col>
              </Row>
            </Container>
        </Show>
        

        <Show when={isAddingCus}>
          <Button size='sm' variant='secondary mt-2 mb-2' onClick={() => setIsAddingCus(!isAddingCus)}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Go back
          </Button>
          <AddCustomerForm setNewlyCreatedCustomer={setNewlyCreatedCustomer} name={searchTerm}/>
        </Show>

        <Show when={selectedCustomer !== null}>
          <Button size='sm' variant='secondary mt-2 mb-2' onClick={() => setSelectedCustomer(null)}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Go back
          </Button>
          <Container fluid>
            <Row className='border px-2 py-3 mb-3'>
              <h3 className="border-bottom pb-2 text-danger fw">
                  <FontAwesomeIcon icon={faUser} className='fs-3'/> Customer Details
              </h3>
              <h4>Information:</h4>
              <Col xs={6}><strong>Name:</strong> {selectedCustomer?.cusName}</Col>
              <Col xs={6}><strong>Phone:</strong> {
                selectedCustomer?.cusPhones.map(phone => phone).join(', ')
              }</Col>
              <Col xs={6}><strong>Address:</strong> {selectedCustomer?.cusAddress}</Col>
              <Col xs={6}><strong>Email:</strong> {
                selectedCustomer?.cusEmails.map(email => email).join(', ')
              }</Col>
              <Col>
                <strong>Number of Jobs: </strong>
                {selectedCustomer?.jobOrders.length}
              </Col>
              
            </Row>
          </Container>
          <AddJobOrderForm customerId={selectedCustomer?._id as string} />
          
        </Show>
    </Container>
  )
}

export default AddJob



// TYPES
export interface CustomerDocument {
  _id: string
  cusName: string
  cusAddress: string,
  cusPhones: string[],
  cusEmails: string[],
  jobOrders: [],
  createdAt: string,
  updatedAt: string,
  __v: number

}