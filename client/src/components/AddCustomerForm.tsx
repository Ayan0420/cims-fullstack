import { useState } from "react"
import { Container,  Form, Button, Row, Col } from "react-bootstrap"
import { Show } from "../utils/ConditionalRendering"
import { useAuth } from "../AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faPlus, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import toast from "react-hot-toast"
import LoadingOverlay from "./LoadingOverlay"
import { CustomerDocument } from "../pages/AddJob"

interface AddCustomerFormProps {
    setNewlyCreatedCustomer: (customer: CustomerDocument) => void
    name?: string
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({setNewlyCreatedCustomer, name}) => {
    const {token} = useAuth();
    const [cusName, setCusName] = useState<string>(name ? name : "");
    const [cusAddress, setCusAddress] = useState<string>("");
    const [cusPhones, setCusPhones] = useState<string[]>([]);
    const [cusEmails, setCusEmails] = useState<string[]>([]);

    const [selectedEmail, setSelectedEmail] = useState("");
    const [selectedPhone, setSelectedPhone] = useState("");

    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleSaveCustomer() {

        
        if(cusPhones.length === 0) {
            toast.error("Please add at least one phone number", {duration: 5000})
            return;
        }
        setIsLoading(true)
        
        const fetchUrl = `${import.meta.env.VITE_API_URL}/api/customers`

        const customer = {
            cusName: cusName.trim().toUpperCase(),
            cusAddress: cusAddress.trim().toUpperCase(),
            cusPhones,
            cusEmails
        }

        try {
            const response = await axios.post(
                fetchUrl,
                customer,
                { 
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    } 
                }
            );

            console.log(response.data)
            

            setIsLoading(false)
            
            toast.success("Customer saved successfully!", {duration: 5000})

            setNewlyCreatedCustomer(response.data)
      

            

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

    function addEmail() {
        if(selectedEmail.trim() !== "") {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(selectedEmail)) {
                toast.error("Invalid email format", { duration: 3000 });
                return;
            }

            setCusEmails([...cusEmails, selectedEmail])
            setSelectedEmail("")
        } else {
            toast.error("Input email!", { duration: 3000 });
        }
    }

    function addPhone() {
        if(selectedPhone.trim() !== "") {
            const phoneRegex = /^(09\d{9}|088-\d{3}-\d{4})$/; // This might change depending on the region
            if (!phoneRegex.test(selectedPhone)) {
                toast.error('Invalid phone number format. Make sure it has 11 digits and starts with 09', { duration: 5000 });
                return;
            }

            setCusPhones([...cusPhones, selectedPhone])
            setSelectedPhone("")
        } else {
            toast.error("Input phone number!", { duration: 3000 });
        }
    }

  return (
    <>
    <Show when={isLoading}>
        <LoadingOverlay message="Saving..."/>
    </Show>
    
    <Container fluid className='py-3 border'>

        <h3 className="border-bottom pb-2">
            <FontAwesomeIcon icon={faUser} className='fs-3'/> Add New Customer
        </h3>
        <Form onSubmit={(e) => {
            e.preventDefault();
            handleSaveCustomer();
        }}>
            <Form.Group  className="mb-2" controlId="name">
                <Form.Label className="mb-0 fw-bold">Name:</Form.Label>
                <Form.Control className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light" autoComplete={"off"} type="text" placeholder="Enter name" required
                onChange={(e) => setCusName(e.target.value)} value={cusName}
                />
            </Form.Group>
            
            <Row className="g-3">
                
                <Col xs={12} md={6} className="mb-2">
                    <Row className="g-1">
                        <Col xs={9}>
                            <Form.Group className="mb-0" controlId="phone">
                                <Form.Label className="mb-0 fw-bold">
                                    Phone:
                                </Form.Label>
                                <Form.Control className="px-1 py-0 border-1 rounded-0 border-dark bg-light fst-italic" autoComplete={"off"} type="text" placeholder="09XXXXXXXXX or 088-XXX-XXXX"
                                    onChange={(e) => setSelectedPhone(e.target.value)} value={selectedPhone}
                                    onKeyDown={(e) => {
                                            if(e.key === "Enter") {
                                                e.preventDefault();
                                                addPhone();
                                            }
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={3} className="d-flex align-items-end">
                            <Button onClick={addPhone} variant="dark text-sm" size="sm"><FontAwesomeIcon icon={faPlus} /> Add Phone</Button>
                        </Col>
                        <div className="d-flex overflow-auto gap-1 py-1">
                      
                            {cusPhones.map((phone, i) => (
                            
                                <div className="rounded-pill bg-warning-subtle text-black px-2 py-1 d-flex align-items-center gap-2">
                                    <span>{phone}</span>
                                    <FontAwesomeIcon icon={faXmark} className="ekis"
                                        // Remove email from list
                                        onClick={() => setCusPhones(cusPhones.filter((_, index) => index !== i))}
                                    />
                                </div>
                           
                            ))}
                            
                        </div>
                    </Row>
                    
                </Col>

                <Col xs={12} md={6} className="mb-2">
                    <Row className="g-1">
                        <Col xs={9}>
                            <Form.Group className="mb-0" controlId="email">
                                <Form.Label className="mb-0 fw-bold">
                                    Email (Optional):
                                </Form.Label>
                                <Form.Control className="px-1 py-0 border-1 rounded-0 border-dark bg-light fst-italic" autoComplete={"off"} type="text" placeholder="customer@example.com"
                                    onChange={(e) => setSelectedEmail(e.target.value)} value={selectedEmail}
                                    onKeyDown={(e) => {
                                            if(e.key === "Enter") {
                                                e.preventDefault();
                                                addEmail();
                                            }
                                        }
                                    }
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={3} className="d-flex align-items-end">
                            <Button onClick={addEmail} variant="dark text-sm" size="sm"><FontAwesomeIcon icon={faPlus} /> Add Email</Button>
                        </Col>
                        <div className="d-flex overflow-auto gap-1 py-1">
                      
                            {cusEmails.map((email, i) => (
                            
                                <div className="rounded-pill bg-primary-subtle  text-black px-2 py-1 d-flex align-items-center gap-2">
                                    <span>{email}</span>
                                    <FontAwesomeIcon icon={faXmark} className="ekis"
                                        // Remove email from list
                                        onClick={() => setCusEmails(cusEmails.filter((_, index) => index !== i))}
                                    />
                                </div>
                           
                            ))}
                            
                        </div>
                    </Row>
                    
                </Col>

            </Row>

            <Form.Group className="mb-3" controlId="address">
                <Form.Label className="mb-0 fw-bold">Address:</Form.Label>
                <Form.Control className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light" autoComplete={"off"}  placeholder="Enter address" required
                onChange={(e) => setCusAddress(e.target.value)} value={cusAddress}
                />
            </Form.Group>

            <Button variant="success px-3 d-flex align-items-center gap-2" type="submit">
                <FontAwesomeIcon icon={faFloppyDisk} /> Save Customer
            </Button>
        </Form>
        
    </Container>
    </>
  )
}

export default AddCustomerForm