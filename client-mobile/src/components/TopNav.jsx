import { Link } from "react-router-dom";

// src/components/TopNav.jsx
export default function TopNav() {
    return (
        <nav
            className="top-nav maxwith-mobile px-3"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '3rem',
                background: 'var(--pico-primary-background)',
                borderBottom: '1px solid var(--pico-border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                zIndex: 1000,
            }}
        >
            <Link to="/" className="text-white text-decoration-none">CIMS</Link>
            <Link to="/scan" className="scanner-button">
                <i className="bi bi-qr-code-scan text-danger"></i>
            </Link>
        </nav>
    );
}
