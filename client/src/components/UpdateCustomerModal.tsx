import {
    faFloppyDisk,
    faPenToSquare,
    faPlus,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Show } from "../utils/ConditionalRendering";
import LoadingOverlay from "./LoadingOverlay";
import { CustomerDocument } from "../pages/AddJob";
// import { useOpenNewWindow } from "./electron/OpenWindowButton";

interface UpdateCustomerModalProps {
    customerDetails: CustomerDocument | null;
    getCustomerDetails: () => void;
}

const UpdateCustomerModal: React.FC<UpdateCustomerModalProps> = ({ customerDetails, getCustomerDetails }) => {
    const { token } = useAuth();
    // const openNewWindow = useOpenNewWindow();

    const [show, setShow] = useState(false);
    
    const [cusName, setCusName] = useState<string>("");
    const [cusAddress, setCusAddress] = useState<string>("");
    const [cusPhones, setCusPhones] = useState<string[]>([]);
    const [cusEmails, setCusEmails] = useState<string[]>([]);

    const [selectedEmail, setSelectedEmail] = useState("");
    const [selectedPhone, setSelectedPhone] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const handleClose = () => {
        getCustomerDetails();
        setShow(false);
        setCusName(customerDetails?.cusName || "");
        setCusAddress(customerDetails?.cusAddress || "");
        setCusPhones(customerDetails?.cusPhones || []);
        setCusEmails(customerDetails?.cusEmails || []);
    };
    const handleShow = () => setShow(true);

    async function handleSave() {

        if(cusPhones.length === 0) {
            toast.error("Please add at least one phone number", {duration: 5000})
            return;
        }

        setIsLoading(true);

        const fetchUrl = `${import.meta.env.VITE_API_URL}/api/customers/${customerDetails?._id}`;

        const jobOrder: UpdateCustomer = {
            cusName,
            cusAddress,
            cusPhones,
            cusEmails,
        };

        try {
            const response = await axios.patch(fetchUrl, jobOrder, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
            
            // setTimeout(()=>{
            //     toast.success("Job Order Updates saved successfully!", { duration: 5000 });
            //     setIsLoading(false);
            //     handleClose();
            // }, 2000)

            toast.success("Customer Updates saved successfully!", { duration: 5000 });
            setIsLoading(false);
            handleClose();
            window.electronAPI.refreshMain();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
                if (!error.response?.data.message) {
                    toast.error("Request failed", { duration: 5000 });
                    setIsLoading(false);
                } else {
                    toast.error(error.response?.data.message, { duration: 5000 });
                    setIsLoading(false);
                }
            } else {
                console.error("Unexpected Error:", error);
                toast.error("Unexpected Error!", { duration: 5000 });
                setIsLoading(false);
            }
        }
    }

    async function handleDelete() {
        // Replace the built-in prompt with our Electron prompt
        const customerName = await window.electronAPI.prompt({
          title: 'Confirm Delete',
          label: `Please type the Customer Name: ${customerDetails?.cusName}`,
          value: '',
          inputAttrs: {
            type: 'text'
          },
          type: 'input'
        });
      
        if (customerName === (customerDetails?.cusName as unknown as string)) {
          const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
      
          if (confirmDelete) {
            try {
              const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/customers/${customerDetails?._id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
      
              console.log(response.data);
      
              toast.success("Customer deleted successfully!", { duration: 5000 });
              handleClose();
              window.electronAPI.closeWindow();
            } catch (error) {
              if (axios.isAxiosError(error)) {
                console.error("Axios Error:", error.response?.data);
                if (!error.response?.data.message) {
                  toast.error("Request failed", { duration: 5000 });
                } else {
                  toast.error(error.response?.data.message, { duration: 5000 });
                }
              } else {
                console.error("Unexpected Error:", error);
                toast.error("Unexpected Error!", { duration: 5000 });
              }
            }
          }
        } else if (customerName === null) {
          toast.error("Delete action aborted.", { duration: 3000 });
        } else {
          toast.error("Customer Name does not match", { duration: 3000 });
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

    useEffect(() => {
        setCusName(customerDetails?.cusName || "");
        setCusAddress(customerDetails?.cusAddress || "");
        setCusPhones(customerDetails?.cusPhones || []);
        setCusEmails(customerDetails?.cusEmails || []);
        setSelectedEmail("");
        setSelectedPhone("");
    }, [customerDetails]);

    return (
        <>
            <Button size="sm" variant="warning align-self-center" onClick={handleShow}>
                <FontAwesomeIcon icon={faPenToSquare} /> Update
            </Button>

            <Modal show={show} onHide={handleClose} size="xl" backdrop="static" fullscreen={true}>
                <Show when={isLoading}>
                    <LoadingOverlay message="Saving Job Updates..." />
                </Show>
                <Modal.Header closeButton>
                    <Modal.Title className="text-warning">
                        Update Customer Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid className="py-3 border">
                        {/* <h3 className="border-bottom pb-2 text-danger fw">
                    <FontAwesomeIcon icon={faScrewdriver} className="fs-3" /> Job Order Details
                </h3> */}
                    
                        <Form.Group  className="mb-2" controlId="name">
                            <Form.Label className="mb-0 fw-bold">Name:</Form.Label>
                            <Form.Control className="p-1 border-1 rounded-0 border-dark bg-light" autoComplete={"off"} type="text" placeholder="Enter name" required
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
                            <Form.Control className="p-1 border-1 rounded-0 border-dark bg-light" autoComplete={"off"}  placeholder="Enter address" required
                            onChange={(e) => setCusAddress(e.target.value)} value={cusAddress}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center gap-2 ">
                            
                            <Button
                                variant="outline-danger px-3 d-flex align-items-center gap-2 align-self-end"
                                onClick={handleDelete}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </div>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="success px-3 d-flex align-items-center gap-2"
                        onClick={handleSave}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} /> Save Updates
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} /> Cancel Editing
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateCustomerModal;

export interface UpdateCustomer {
    cusName: string;
    cusAddress: string;
    cusPhones: string[];
    cusEmails: string[];
}

