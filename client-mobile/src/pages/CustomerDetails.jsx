import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCustomer } from '../api/customer';
import { getToken } from '../api/auth';

export default function CustomerDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
        getCustomer(id).then((res) => setCustomer(res.data));
    }, [id]);

    if (!customer) {
        return (
            <main className="container mb-5 py-5">
                <div className='text-center'>Loading data...</div>
                <progress />
            </main>
        );
    }

    return (
        <main className="container mb-5">
            <header className="mb-4">
                <h2>
                    <i className="bi bi-person-fill"></i> {customer.cusName}
                </h2>
            </header>

            <p>
                <i className="bi bi-geo-alt-fill"></i> <strong>Address:</strong>{' '}
                {customer.cusAddress}
            </p>

            {customer.cusPhones?.length > 0 && (
                <>
                    <p className="mt-3 mb-1">
                        <strong>
                            <i className="bi bi-telephone-fill"></i> Phone
                            Numbers:
                        </strong>
                    </p>
                    <ul>
                        {customer.cusPhones.map((p, i) => (
                            <li key={i}>
                                <i className="bi bi-dot"></i> {p}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {customer.cusEmails?.length > 0 && (
                <>
                    <p className="mt-3 mb-1">
                        <strong>
                            <i className="bi bi-envelope-fill"></i> Email
                            Addresses:
                        </strong>
                    </p>
                    <ul>
                        {customer.cusEmails.map((e, i) => (
                            <li key={i}>
                                <i className="bi bi-dot"></i> {e}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {customer.jobOrders?.length > 0 && (
                <>
                    <p className="mt-4 mb-1">
                        <strong>
                            <i className="bi bi-clipboard-check"></i> Job
                            Orders:
                        </strong>
                    </p>
                    <ul>
                        {customer.jobOrders.map((job) => (
                            <li key={job._id}>
                                <Link to={`/jobs/${job._id}`}>
                                    <i className="bi bi-tools"></i> #
                                    {job.jobOrderNum} – {job.unitModel}{' '}
                                    <small>({job.sStatus})</small>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </main>
    );
}
