import { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../api/job';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../api/auth';

export default function Jobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
        getJobs().then((res) => {
            setJobs(res.data.jobs || []);
            setIsLoading(false);
        });
    }, []);

    if (isLoading)
        return (
            <main className="container mb-5 py-5">
                <div className="text-center">Loading data...</div>
                <progress />
            </main>
        );

    return (
        <main className="container mb-5">
            <header className="mb-5">
                <h2>Jobs</h2>
            </header>

            {jobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                <section>
                    {jobs.map((job) => (
                        <article
                            className="card"
                            key={job._id}
                            style={{ marginBottom: '1rem' }}
                        >
                            <header>
                                <strong>Job #{job.jobOrderNum}</strong>
                                <small style={{ float: 'right' }}>
                                    {job.sStatus}
                                </small>
                            </header>
                            <p>
                                <strong>Tracking:</strong> {job.trackingCode}
                            </p>
                            <p>
                                <strong>Date:</strong> {job.jobDate}
                            </p>
                            <p>
                                <strong>Model:</strong> {job.unitModel}
                            </p>

                            <footer
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.5rem',
                                }}
                            >
                                <Link
                                    to={`/jobs/${job._id}`}
                                    title="View"
                                    className="secondary"
                                >
                                    <i className="bi bi-eye"></i>
                                </Link>
                                <Link
                                    to={`/jobs/${job._id}/edit`}
                                    title="Edit"
                                    className="secondary"
                                >
                                    <i className="bi bi-pencil"></i>
                                </Link>
                            </footer>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}
