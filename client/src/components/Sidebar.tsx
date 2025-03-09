import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faLaptopMedical, faGauge, faScrewdriverWrench, faUsers, faGears } from '@fortawesome/free-solid-svg-icons';
// import Clock from './Clock';


const Sidebar = () => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    function handleLogout() {
        logout()
        navigate('/login')
        toast.success('Logged out successfully!', {duration: 5000})
    }
    return (
        <>
        <div className='bg-danger min-vh-100 max-vh-100 py-3 d-flex flex-column sticky-top'>
            <Link to="/" className='text-decoration-none text-light pb-2 border-bottom border-light mb-3'>
               
                <h1 className=' text-center fw-bolder mb-0'>
                    <FontAwesomeIcon icon={faLaptopMedical} /> CIMS
                </h1>
            </Link>
            <div className='flex flex-column flex-grow-1 p-1 '>
                <Link className='sidebar-nav text-light mb-1 rounded-1 d-flex align-items-center gap-3' to='/' >
                    <FontAwesomeIcon icon={faGauge} className='fs-4'/><span>Dashboard</span>
                </Link>
                <Link className='sidebar-nav text-light mb-1 rounded-1 d-flex align-items-center gap-3' to='/jobs' >
                    <FontAwesomeIcon icon={faScrewdriverWrench} className='fs-4'/><span>Jobs</span>
                </Link>
                <Link className='sidebar-nav text-light mb-1 rounded-1 d-flex align-items-center gap-3' to='/customers' >
                    <FontAwesomeIcon icon={faUsers} className='fs-4'/><span>Customers</span>
                </Link>
                <Link className='sidebar-nav text-light mb-1 rounded-1 d-flex align-items-center gap-3' to='/analytics' >
                    <FontAwesomeIcon icon={faChartLine} className='fs-4'/><span>Analytics</span>
                </Link>
                 
            </div>
            <div className='mt-auto text-center'>
                <Button variant='warning fw-light px-5' size='sm' onClick={handleLogout}>Logout</Button>
            </div>
        </div>
        </>

    );
}

export default Sidebar;