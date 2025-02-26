import { Pagination, Spinner, Table } from "react-bootstrap";
import { Show } from "../utils/ConditionalRendering";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { CustomerDocument } from "../pages/AddJob";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface CustomerTableProps {
  customers: CustomerDocument[]
  isLoading: boolean
  handleGetCustomer: (pg:string, kw:string) => void
}

const CustomerTable: React.FC<CustomerTableProps> = ({customers, isLoading, handleGetCustomer}) => {

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  function handleNextPage() {
    setPage(prev => prev + 1)
  }

  function handlePrevPage() {
    if(page <= 1) {
      toast.error("You're at the first page.")
    } else {
      setPage(prev => prev - 1)
    }
  }

  useEffect(() => {
    console.log(page)
    handleGetCustomer(page.toString(), "")
  }, [page])

  return (
    <>
    <Table bordered responsive size="sm">
      <thead className="table-warning">
        <tr className="text-center">
          <th>Name</th>
          <th>Address</th>
          <th>Job Count</th>
        </tr>
      </thead>
      <tbody>
        <Show when={isLoading}>
          <tr>
            <td colSpan={6} className="text-center"><Spinner size="sm" /> Searching Customer...</td>
          </tr>
        </Show>
        <Show when={customers.length === 0 && !isLoading}>
          <tr>
            <td colSpan={6} className="text-center fw-bold"><FontAwesomeIcon icon={faSearch} /> No customers found.</td>
          </tr>
        </Show>
        { customers.map((customer: CustomerDocument) => (
          <tr key={customer._id} className="text-center table-item" 
            onClick={() => navigate(`/customers/${customer._id}`)}
          >
            <td>{customer.cusName}</td>
            <td>{customer.cusAddress}</td>
            <td>{customer.jobOrders.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Pagination size="sm">
        <Show when={page !== 1}>
          <Pagination.Item linkClassName="text-dark" onClick={handlePrevPage}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Pagination.Item>
        </Show>
        <Pagination.Item linkClassName="text-dark">
          Page {page}
        </Pagination.Item>
        <Pagination.Item linkClassName="text-dark" onClick={handleNextPage}>
          <FontAwesomeIcon icon={faArrowRight} />
        </Pagination.Item>
      </Pagination>
    </>
  );
};

export default CustomerTable;
