import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // <-- Import Header
import { motion } from 'framer-motion';

// A helper function to get the title from the pathname
const getTitleFromPathname = (pathname) => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/contacts/')) return 'Contact Detail';
    const name = pathname.split('/')[1];
    return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter
};

export default function Layout() {
  const location = useLocation();
  const title = getTitleFromPathname(location.pathname);

  return (
    <div>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      <div className="lg:pl-72">
        <div className="p-4 sm:p-6 lg:p-8">
          <Header title={title} /> {/* <-- Add Header */}
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </div>
  );
}