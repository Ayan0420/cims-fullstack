import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, login } from '../api/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    useEffect(() => {
        if (getToken()) {
            navigate('/');
        }
    }, []);

    return (
        <main className="container pt-5 mt-5">
            <h2 className='text-center'>CIMS Mobile Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </main>
    );
}
