import { Table } from "react-bootstrap";
import { JobDocument } from "../pages/Jobs";
import { Show } from "../utils/ConditionalRendering";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import LoadingOverlay from "./LoadingOverlay";

interface JobOrderTableProps {
  jobs:JobDocument[]
  isLoading: boolean
  handleGetJobs: (pg:string, kw:string) => void
}

const JobOrderTable: React.FC<JobOrderTableProps> = ({jobs, isLoading}) => {

  const navigate = useNavigate();


  return (
    <div className="position-relative" style={{minHeight: "25rem"}}>

    <Show when={isLoading}>
      <LoadingOverlay message="Searching jobs..." />
    </Show>

    <Show when={!isLoading}>
      <Table bordered size="sm">
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
    </Show>
    
    </div>
  );
};

export default JobOrderTable;
