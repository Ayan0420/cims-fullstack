import { Spinner, Table } from "react-bootstrap";
import { JobDocument } from "../pages/Jobs";
import { Show } from "../utils/ConditionalRendering";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import OpenWindowButton, { useOpenNewWindow } from "./electron/OpenWindowButton";

interface JobOrderTableProps {
  jobs:JobDocument[]
  isLoading: boolean
}

const JobTableCustomerPage: React.FC<JobOrderTableProps> = ({jobs, isLoading}) => {

  // const navigate = useNavigate();
  const openNewWindow = useOpenNewWindow();

  return (
    <Table bordered responsive size="sm">
      <thead className="table-info">
        <tr className="text-center">
          <th>J.O. #</th>
          <th>Work Performed</th>
          <th>Unit Model</th>
          <th>Status</th>
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
            <td colSpan={6} className="text-center fw-bold"><FontAwesomeIcon icon={faSearch} /> No jobs found!  <OpenWindowButton variant="success my-1" text="Add New Job" route="create-job" size={'sm'} icon={{icon: faCirclePlus}}/></td>
          </tr>
        </Show>
        { jobs.map((job) => (
          <tr key={job._id} className="text-center table-item" 
            onClick={() => openNewWindow(`jobs/${job._id}`)}
          >
            <td>{job.jobOrderNum}</td>
            <td>{job.workPerformed}</td>
            <td>{job.unitModel}</td>
            <td>{job.sStatus}</td>
            <td>{job.jobDate}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default JobTableCustomerPage;
