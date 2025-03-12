import { faFloppyDisk, faScrewdriver } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useAuth } from "../AuthContext";
import { Show } from "../utils/ConditionalRendering";
import LoadingOverlay from "./LoadingOverlay";
import { useNavigate } from "react-router";
// import { useOpenNewWindow } from "./electron/OpenWindowButton";


interface AddJobOrderProps { 
    customerId: string;
};

const AddJobOrderForm: React.FC<AddJobOrderProps> = ({customerId}) => {

    const { token } = useAuth();
    const navigate = useNavigate();
    // const openNewWindow = useOpenNewWindow();
   
    const [jobDate, setJobDate] = useState<string>("");
    const [unitModel, setUnitModel] = useState<string>("");
    const [unitSpecs, setUnitSpecs] = useState<string>("");
    const [unitAccessories, setUnitAccessories] = useState<string>("");
    const [workPerformed, setWorkPerformed] = useState<string>("");
    const [sCharge, setSCharge] = useState<number>(0);
    const [sPayMeth, setSPayMeth] = useState<PaymentMethodEnum>(PaymentMethodEnum.otc);
    const [sDownPayment, setSDownPayment] = useState<number>(0);
    const [sBalance, setSBalance] = useState<number>(0);
    const [sStatus, setSStatus] = useState<JobStatusEnum>(JobStatusEnum.onGoing);
    const [sUnitDropOff, setSUnitDropOff] = useState<boolean>(true);
    const [sRelDate, setSRelDate] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (sDownPayment > sCharge) {
            toast.error("Down payment cannot be greater than the service charge!", {
                duration: 5000,
            });
            setSBalance(sCharge);
        } else {
            setSBalance(sCharge - sDownPayment);
        }
    }, [sCharge, sDownPayment]);

    async function handleSave() {

        setIsLoading(true);

        const fetchUrl = `${import.meta.env.VITE_API_URL}/api/jobs`

        const jobOrder: JobOrder = {
            customerId,
            jobDate,
            unitModel: unitModel.toUpperCase(),
            unitSpecs: unitSpecs.toUpperCase(),
            unitAccessories: unitAccessories.toUpperCase(),
            workPerformed: workPerformed.toUpperCase(),
            sCharge,
            sPayMeth,
            sDownPayment,
            sBalance,
            sStatus,
            sUnitDropOff,
            sRelDate,
            notes,
        };

        try {
            const response = await axios.post(
                fetchUrl,
                jobOrder,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            console.log(response.data)
            
            toast.success("Job Order saved successfully!", { duration: 5000 });
            
            
            navigate(`/jobs/${response.data._id}`)
            window.electronAPI.refreshMain();

            

            setIsLoading(false);

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

    return (
        <>
        <Show when={isLoading}>
            <LoadingOverlay message="Saving New Job..."/>
        </Show>
        <Container fluid className="py-3 border">
            <h3 className="border-bottom pb-2 text-danger fw">
                <FontAwesomeIcon icon={faScrewdriver} className="fs-3" /> Job Order Details
            </h3>
            <Form onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}>
                <h4>Unit Specification:</h4>
                <Row>
                    <Col xs={12} md={3}>
                        <Form.Group className="mb-2" controlId="jobDate">
                            <Form.Label className="mb-0 fw-bold">Date:</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="date"
                                required
                                onChange={(e) => setJobDate(e.target.value)}
                                value={jobDate}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="unitModel">
                            <Form.Label className="mb-0 fw-bold">Unit Model:</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="text"
                                placeholder="e.g. Lenovo Ideal Pad Slim i3"
                                required
                                onChange={(e) => setUnitModel(e.target.value)}
                                value={unitModel}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="g-1">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="unitAccessories">
                            <Form.Label className="mb-0 fw-bold">Unit Accessories:</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="text"
                                placeholder="e.g. Charger, Laptop Bag"
                                required
                                onChange={(e) => setUnitAccessories(e.target.value)}
                                value={unitAccessories}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3" controlId="unitSpecs">
                            <Form.Label className="mb-0 fw-bold">Unit Specs:</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="text"
                                placeholder="e.g. 8GB RAM, Intel i3 CPU "
                                required
                                onChange={(e) => setUnitSpecs(e.target.value)}
                                value={unitSpecs}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <h4>Work Performed:</h4>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="workPerformed">
                            <Form.Label className="mb-0 fw-bold">Job Type:</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="text"
                                placeholder="e.g. No power, OS Reinstallation"
                                required
                                onChange={(e) => setWorkPerformed(e.target.value)}
                                value={workPerformed}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="sStatus">
                            <Form.Label className="mb-0 fw-bold">Job Status:</Form.Label>
                            <Form.Select
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                required
                                onChange={(e) => setSStatus(e.target.value as JobStatusEnum)}
                                value={sStatus}
                            >
                                {Object.values(JobStatusEnum).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="sCharge">
                            <Form.Label className="mb-0 fw-bold">Service Charge (₱):</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="number"
                                required
                                onChange={(e) => setSCharge(parseFloat(e.target.value))}
                                value={sCharge}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="sDownPayment">
                            <Form.Label className="mb-0 fw-bold">Amount Paid (₱):</Form.Label>
                            <Form.Control
                                className={
                                    sDownPayment > sCharge ?
                                    "p-1 border-1 rounded-0 border-danger bg-light text-danger"
                                    :
                                    "p-1 border-1 rounded-0 border-dark bg-light"
                                }
                                autoComplete={"off"}
                                type="number"
                                required
                                onChange={(e) => setSDownPayment(parseFloat(e.target.value))}
                                value={sDownPayment}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="sBalance">
                            <Form.Label className="mb-0 fw-bold">Balance (₱):</Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="number"
                                disabled
                                onChange={(e) => setSBalance(parseFloat(e.target.value))}
                                value={sBalance}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="sPayMeth">
                            <Form.Label className="mb-0 fw-bold">Payment Method:</Form.Label>
                            <Form.Select
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                required
                                onChange={(e) => setSPayMeth(e.target.value as PaymentMethodEnum)}
                                value={sPayMeth}
                            >
                                {Object.values(PaymentMethodEnum).map((method) => (
                                    <option key={method} value={method}>
                                        {method}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="sRelDate">
                            <Form.Label className="mb-0 fw-bold">
                                Date Released/Returned:
                            </Form.Label>
                            <Form.Control
                                className="text-uppercase p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                type="date"
                                onChange={(e) => setSRelDate(e.target.value)}
                                value={sRelDate}
                            />
                        </Form.Group>
                    </Col>
                    <Col className="d-flex align-items-end">
                        <Form.Group className="mb-3 d-flex align-items-end gap-2" controlId="sUnitDropOff">
                            <Form.Check
                                type="checkbox"
                                onChange={(e) => setSUnitDropOff(e.target.checked)}
                                checked={sUnitDropOff}
                            />
                            <Form.Label className="mb-0 fw-bold">
                                Unit Drop Off
                            </Form.Label>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    
                </Row>

                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="notes">
                            <Form.Label className="mb-0 fw-bold">Technician's Notes:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className="p-1 border-1 rounded-0 border-dark bg-light"
                                autoComplete={"off"}
                                placeholder="Additional notes or comments"
                                onChange={(e) => setNotes(e.target.value)}
                                value={notes}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="success px-3 d-flex align-items-center gap-2" type="submit">
                    <FontAwesomeIcon icon={faFloppyDisk} /> Save Job Order
                </Button>
            </Form>
        </Container>
        </>
    );
};

export default AddJobOrderForm;

// Types
export interface JobOrder {
    customerId: string;
    jobDate: string;
    unitModel: string;
    unitSpecs: string;
    unitAccessories: string;
    workPerformed: string;
    sCharge: number;
    sPayMeth: PaymentMethodEnum;
    sDownPayment: number;
    sBalance: number;
    sStatus: JobStatusEnum;
    sUnitDropOff: boolean;
    sRelDate: string;
    notes: string;
};

export enum PaymentMethodEnum {
    otc = "OVER THE COUNTER",
    gCash = "G-CASH",
    payMaya = "PAYMAYA",
    bank = "BANK TRANSFER",
    others = "OTHERS",
}

export enum JobStatusEnum {
    onGoing = "ONGOING",
    doneUnreleased = "DONE/UNRELEASED",
    paidUnreleased = "PAID/UNRELEASED",
    paidReleased = "PAID/RELEASED",
    backJob = "BACK JOB",
    dmdUnreleased = "DMD/UNRELEASED",
    dmdReleased = "DMD/RELEASED",
    cancelled = "CANCELLED",
}
