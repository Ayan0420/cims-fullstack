import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getJob, printJob } from '../api/job';
import { getToken } from '../api/auth';

export default function JobDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
        getJob(id).then((res) => setJob(res.data));
    }, [id]);

    const handlePrint = async () => {
        printJob(id);
    };

    if (!job)
        return (
            <main className="container mb-5 py-5">
                <div className="text-center">Loading data...</div>
                <progress />
            </main>
        );

    return (
        <main className="container mb-5">
            <h2>Job Order #{job.jobOrderNum}</h2>
            <p>
                <strong>Tracking Code:</strong> {job.trackingCode}
            </p>
            <p>
                <strong>Job Date:</strong> {job.jobDate}
            </p>
            <p>
                <strong>Model:</strong> {job.unitModel}
            </p>
            <p>
                <strong>Specs:</strong> {job.unitSpecs}
            </p>
            <p>
                <strong>Accessories:</strong> {job.unitAccessories}
            </p>
            <p>
                <strong>Work Performed:</strong> {job.workPerformed}
            </p>
            <p>
                <strong>Status:</strong> {job.sStatus}
            </p>
            <p>
                <strong>Charge:</strong> ₱{job.sCharge}
            </p>
            <p>
                <strong>Payment Method:</strong> {job.sPayMeth}
            </p>
            <p>
                <strong>Down Payment:</strong> ₱{job.sDownPayment}
            </p>
            <p>
                <strong>Balance:</strong> ₱{job.sBalance}
            </p>
            <p>
                <strong>Release Date:</strong> {job.sRelDate}
            </p>
            <p>
                <strong>Drop Off:</strong> {job.sUnitDropOff ? 'Yes' : 'No'}
            </p>
            <p>
                <strong>Notes:</strong> {job.notes}
            </p>

            <div className="mt-5" style={{ display: 'flex', gap: '1rem' }}>
                <button href="#" onClick={handlePrint}>
                    🖨 Print Job Order
                </button>
                <Link to={`/jobs/${id}/edit`}>
                    <button className="secondary">✏️ Edit</button>
                </Link>
            </div>
        </main>
    );
}
