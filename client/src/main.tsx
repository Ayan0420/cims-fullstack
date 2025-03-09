// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx';
import Jobs from './pages/Jobs.tsx';
import Login from './pages/Login.tsx';
import { AuthProvider } from './AuthContext.tsx';
import { Toaster } from 'react-hot-toast';
import AddJob from './pages/AddJob.tsx';
import JobDetails from './pages/JobDetails.tsx';
import Customers from './pages/Customers.tsx';
import AddCustomer from './pages/AddCustomer.tsx';
import CustomerDetails from './pages/CustomerDetails.tsx';
import LegacyJoms from './pages/LegacyJoms.tsx';
import Clock from './components/Clock.tsx';
import Analytics from './pages/Analytics.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <div className='sticky-top' style={{zIndex: 9999}}>
      <Clock />
    </div>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />}/>
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/jobs/:id' element={<JobDetails />}/> 
          <Route path='/create-job' element={<AddJob />}/>
          <Route path='/customers' element={<Customers />} />
          <Route path='/customers/:id' element={<CustomerDetails />} />
          <Route path='/create-customer' element={<AddCustomer />} />
          <Route path='/analytics' element={<Analytics  />} />
          <Route path='`legacy`' element={<LegacyJoms />}/>
        </Route>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
)
