import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Deals from './pages/Deals';
import Organizations from './pages/Organizations';
import OrganizationDetail from './pages/OrganizationDetail'; // <-- IMPORT WAS LIKELY MISSING
import MyTasks from './pages/MyTasks';
import Settings from './pages/Settings';

function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/:contactId" element={<ContactDetail />} />
          <Route path="deals" element={<Deals />} />
          <Route path="organizations" element={<Organizations />} />
          
          {/* --- THIS IS THE MISSING ROUTE THAT IS NOW FIXED --- */}
          <Route path="organizations/:orgId" element={<OrganizationDetail />} />
          
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function Root() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
          success: { style: { background: 'white' } },
          error: { style: { background: 'white' } },
        }}
      />
      <App />
    </BrowserRouter>
  );
}

export default Root;