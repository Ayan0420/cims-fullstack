import { Pagination, Spinner, Table } from "react-bootstrap";
import { JobDocument } from "../pages/Jobs";
import { Show } from "../utils/ConditionalRendering";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface JobOrderTableProps {
  jobs:JobDocument[]
  isLoading: boolean
  handleGetJobs: (pg:string, kw:string) => void
}

const JobOrderTable: React.FC<JobOrderTableProps> = ({jobs, isLoading, handleGetJobs}) => {

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
    handleGetJobs(page.toString(), "")
  }, [page])

  return (
    <>
    <Table bordered responsive size="sm">
      <thead className="table-info">
        <tr className="text-center">
          <th>J.O. #</th>
          <th>Work Performed</th>
          <th>Unit Model</th>
          <th>Status</th>
          <th>Customer Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <Show when={isLoading}>
          <tr>
            <td colSpan={6} className="text-center"><Spinner size="sm" /> Searching Job...</td>
          </tr>
        </Show>
        <Show when={jobs.length === 0 && !isLoading}>
          <tr>
            <td colSpan={6} className="text-center fw-bold"><FontAwesomeIcon icon={faSearch} /> No jobs found</td>
          </tr>
        </Show>
        { jobs.map((job) => (
          <tr key={job._id} className="text-center table-item" 
            onClick={() => navigate(`/jobs/${job._id}?prev=/jobs`)}
          >
            <td>{job.jobOrderNum}</td>
            <td>{job.workPerformed}</td>
            <td>{job.unitModel}</td>
            <td>{job.sStatus}</td>
            <td>{job.customerId.cusName}</td>
            <td>{job.jobDate}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Pagination size="sm" className="">
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

export default JobOrderTable;
