// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
    return (
        <nav
            className="bottom-nav maxwith-mobile py-4"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: '1px solid var(--pico-border-color)',
                background: 'var(--pico-muted-border-color)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0.5rem 0',
                zIndex: 1000,
            }}
        >
            <NavLink
                to="/"
                className="nav-item text-decoration-none flex-centered"
            >
                <i className="bi bi-house-door-fill"></i>
                <small> Home</small>
            </NavLink>

            <NavLink
                to="/jobs"
                className="nav-item text-decoration-none flex-centered"
            >
                <i className="bi bi-tools"></i>
                <small> Jobs</small>
            </NavLink>
            <NavLink
                to="/customers"
                className="nav-item text-decoration-none flex-centered"
            >
                <i className="bi bi-people-fill"></i>
                <small> Customers</small>
            </NavLink>
            <NavLink
                to="/logout"
                className="nav-item text-decoration-none flex-centered"
            >
                <i className="bi bi-box-arrow-right"></i>
                <small> Logout</small>
            </NavLink>
        </nav>
    );
}
