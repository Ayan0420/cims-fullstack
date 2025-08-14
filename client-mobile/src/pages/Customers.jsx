import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../api/customer';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../api/auth';

export default function Customers() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
        }
        getCustomers().then((res) => {
            setCustomers(res.data.customers || res.data || []);
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
        <main className="container ">
            <header className="mb-5">
                <h2>Customers</h2>
            </header>

            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <section>
                    {customers.map((customer) => (
                        <article
                            className="card"
                            key={customer._id}
                            style={{ marginBottom: '1rem' }}
                        >
                            <header>
                                <strong>{customer.cusName}</strong>
                            </header>

                            <p>
                                <i className="bi bi-geo-alt-fill"></i>{' '}
                                {customer.cusAddress}
                            </p>
                            {customer.cusPhones?.length > 0 && (
                                <p>
                                    <i className="bi bi-telephone-fill"></i>{' '}
                                    {customer.cusPhones[0]}
                                </p>
                            )}
                            {customer.cusEmails?.length > 0 && (
                                <p>
                                    <i className="bi bi-envelope-fill"></i>{' '}
                                    {customer.cusEmails[0]}
                                </p>
                            )}

                            <footer
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '0.5rem',
                                }}
                            >
                                <Link
                                    to={`/customers/${customer._id}`}
                                    title="View"
                                    className="secondary"
                                >
                                    <i className="bi bi-eye"></i>
                                </Link>
                            </footer>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}
