import { useEffect, useState } from 'react';
import { getJobs, getMonthlyReport } from '../api/job';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../api/auth';

export default function Dashboard() {
    const navigate = useNavigate();

    const [summary, setSummary] = useState({
        monthCount: 0,
        ongoingCount: 0,
        notReleasedCount: 0,
        recentJobs: [],
    });
    const [isLoading, setIsLoading] = useState(true)

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const monthLabel = now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    useEffect(() => {
        Promise.all([getJobs(), getMonthlyReport(year, month)]).then(
            ([jobRes, reportRes]) => {
                const jobs = jobRes.data.jobs || [];

                const ongoing = jobs.filter((j) => j.sStatus === 'ONGOING');
                const notReleased = jobs.filter((j) =>
                    ['DONE/UNRELEASED', 'PAID/UNRELEASED'].includes(j.sStatus),
                );

                const recent = [...jobs]
                    .sort((a, b) => new Date(b.jobDate) - new Date(a.jobDate))
                    .slice(0, 5);

                setSummary({
                    monthCount: reportRes.data?.count || jobs.length,
                    ongoingCount: ongoing.length,
                    notReleasedCount: notReleased.length,
                    recentJobs: recent,
                });
                setIsLoading(false)
            },
        );
    }, [month, year]);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
    });

    return (
        <main className="container mb-5">
            <h2>👋 Welcome back!</h2>
            <span className="mb-1">Here's your job summary for:</span>
            <h4 className="mb-3">
                <i className="bi bi-calendar-event"></i> {monthLabel}
            </h4>

            <section className="grid" style={{ gap: '1rem' }}>
                <article className="card mb-0">
                    <h4>
                        <i className="bi bi-calendar3"></i> Jobs This Month
                    </h4>
                    <p>{summary.monthCount}</p>
                </article>
                <article className="card mb-0">
                    <h4>
                        <i className="bi bi-hourglass-split"></i> Ongoing Jobs
                    </h4>
                    <p>{summary.ongoingCount}</p>
                </article>
                <article className="card mb-0">
                    <h4>
                        <i className="bi bi-box-seam"></i> Not Released
                    </h4>
                    <p>{summary.notReleasedCount}</p>
                </article>
            </section>

            <hr />

            <h4 className="mt-4">🧾 Recent Jobs</h4>
            {isLoading && (
                <main className="container mb-5 py-5">
                    <div className="text-center">Loading data...</div>
                    <progress />
                </main>
            )}
            {summary.recentJobs.length === 0 && !isLoading ? (
                <p>No recent jobs found.</p>
            ) : (
                <ul>
                    {summary.recentJobs.map((job) => (
                        <li key={job._id}>
                            <Link to={`/jobs/${job._id}`}>
                                <i className="bi bi-tools"></i> #
                                {job.jobOrderNum} – {job.unitModel}{' '}
                                <small>({job.sStatus})</small>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
