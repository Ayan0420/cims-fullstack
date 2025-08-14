import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import JobForm from './pages/JobForm';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { useEffect } from 'react';
import Logout from './pages/Logout';
import ScanPage from './pages/ScanPage';
import InstallButton from './components/InstallButton';

function AppRoutes() {
    const location = useLocation();

    // Define routes where navs should be hidden
    const hideNavRoutes = ['/login', '/logout'];
    const hideNav = hideNavRoutes.includes(location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0); // optional: scroll to top on route change
    }, [location]);

    return (
        <>
            {!hideNav && <TopNav />}

            <div className="py-5 my-3 maxwith-mobile">
                <InstallButton />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/logout" element={<Logout />} />

                    <Route path="/" element={<Dashboard />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/jobs/new" element={<JobForm />} />
                    <Route path="/jobs/:id/edit" element={<JobForm />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />
                    <Route
                        path="/customers/:id"
                        element={<CustomerDetails />}
                    />
                    <Route
                        path="*"
                        element={
                            <div className="text-center mt-5 py-5">
                                404 Not Found
                            </div>
                        }
                    />
                </Routes>
            </div>

            {!hideNav && <BottomNav />}
        </>
    );
}

export default function Router() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
