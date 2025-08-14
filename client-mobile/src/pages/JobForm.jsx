import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getJob, createJob, updateJob } from '../api/job';
import { getToken } from '../api/auth';

export default function JobForm() {
    const { id } = useParams();
    const isEdit = id !== 'new';
    const navigate = useNavigate();
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
        if (isEdit) {
            getJob(id).then((res) => {
                setJob(res.data)
            });
            
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setJob({ ...job, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEdit) {
            await updateJob(id, job);
        } else {
            await createJob(job);
        }
        navigate(`/jobs/${id}`);
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
            <div className='mb-3'>
                <h3>{isEdit ? 'Edit Job' : 'Create Job'}</h3>
                <Link to={`/jobs/${id}`}>Cancel Editing</Link>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    name="jobOrderNum"
                    value={job.jobOrderNum}
                    onChange={handleChange}
                    placeholder="Job Order #"
                    required
                />
                <input
                    name="trackingCode"
                    value={job.trackingCode}
                    onChange={handleChange}
                    placeholder="Tracking Code"
                    required
                />
                <input
                    name="jobDate"
                    type="date"
                    value={job.jobDate}
                    onChange={handleChange}
                    required
                />
                <input
                    name="unitModel"
                    value={job.unitModel}
                    onChange={handleChange}
                    placeholder="Model"
                    required
                />
                <input
                    name="unitSpecs"
                    value={job.unitSpecs}
                    onChange={handleChange}
                    placeholder="Specs"
                    required
                />
                <input
                    name="unitAccessories"
                    value={job.unitAccessories}
                    onChange={handleChange}
                    placeholder="Accessories"
                    required
                />
                <input
                    name="workPerformed"
                    value={job.workPerformed}
                    onChange={handleChange}
                    placeholder="Work Performed"
                    required
                />
                <input
                    name="sCharge"
                    type="number"
                    value={job.sCharge}
                    onChange={handleChange}
                    placeholder="Charge"
                />
                <select
                    name="sPayMeth"
                    value={job.sPayMeth}
                    onChange={handleChange}
                >
                    {[
                        'OVER THE COUNTER',
                        'G-CASH',
                        'PAYMAYA',
                        'BANK TRANSFER',
                        'OTHERS',
                    ].map((opt) => (
                        <option key={opt}>{opt}</option>
                    ))}
                </select>
                <input
                    name="sDownPayment"
                    type="number"
                    value={job.sDownPayment}
                    onChange={handleChange}
                    placeholder="Down Payment"
                />
                <input
                    name="sBalance"
                    type="number"
                    value={job.sBalance}
                    onChange={handleChange}
                    placeholder="Balance"
                />
                <select
                    name="sStatus"
                    value={job.sStatus}
                    onChange={handleChange}
                >
                    {[
                        'ONGOING',
                        'DONE/UNRELEASED',
                        'PAID/UNRELEASED',
                        'PAID/RELEASED',
                        'BACK JOB',
                        'DMD/UNRELEASED',
                        'DMD/RELEASED',
                        'CANCELLED',
                    ].map((opt) => (
                        <option key={opt}>{opt}</option>
                    ))}
                </select>
                <label>
                    <input
                        type="checkbox"
                        name="sUnitDropOff"
                        checked={job.sUnitDropOff}
                        onChange={handleChange}
                    />
                    Unit Drop Off
                </label>
                <input
                    name="sRelDate"
                    type="date"
                    value={job.sRelDate}
                    onChange={handleChange}
                />
                <textarea
                    name="notes"
                    value={job.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                />
                <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
            </form>
        </main>
    );
}
