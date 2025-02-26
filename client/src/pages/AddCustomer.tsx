import AddCustomerForm from '../components/AddCustomerForm'
import { CustomerDocument } from './AddJob'
import { Button, Container } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router'

const AddCustomer = () => {
    const navigate = useNavigate();
    function setNewlyCreatedCustomer(customer: CustomerDocument) {
        navigate(`/customers/${customer._id}`)
    }

  return (
    <Container>
      
        <Link to='/customers'>
            <Button size='sm' variant='secondary mt-2 mb-2'>
                <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Go back
            </Button>
        </Link>
        
        <AddCustomerForm setNewlyCreatedCustomer={setNewlyCreatedCustomer} />
    
    </Container>
  )
}

export default AddCustomer