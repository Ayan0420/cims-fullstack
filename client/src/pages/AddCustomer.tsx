import { useAuth } from '../AuthContext'
import AddCustomerForm from '../components/AddCustomerForm'
import { useOpenNewWindow } from '../components/electron/OpenWindowButton'
import { CustomerDocument } from './AddJob'
import { Container } from 'react-bootstrap'

const AddCustomer = () => {
    const {token} = useAuth()
    const openNewWindow = useOpenNewWindow();
    function setNewlyCreatedCustomer(customer: CustomerDocument) {
        openNewWindow(`customers/${customer._id}`)
        window.electronAPI.closeWindow();
    }

  return (
    !token ? <h1 className='text-center text-danger my-5'>Login First!</h1>:
    <Container fluid>        
        <AddCustomerForm setNewlyCreatedCustomer={setNewlyCreatedCustomer} />
    </Container>
  )
}

export default AddCustomer