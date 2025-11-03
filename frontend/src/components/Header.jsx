import { Fragment, useState, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Header({ title }) {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const markNotificationsAsRead = async () => {
    try {
        await api.post('/notifications/read');
        // Optimistically update the UI
        setNotifications(notifications.map(n => ({...n, read: true})));
    } catch(error) {
        console.error("Failed to mark notifications as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
      
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button 
              onClick={open ? null : markNotificationsAsRead}
              className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-xs text-white">
                    {unreadCount}
                  </span>
                </span>
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80 max-w-sm origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4 font-semibold border-b">Notifications</div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <Link
                        key={notif._id}
                        to={notif.link || '#'}
                        onClick={() => close()}
                        className={`block p-4 text-sm hover:bg-slate-50 ${!notif.read ? 'bg-violet-50' : ''}`}
                      >
                        <p className="font-medium text-slate-900">{notif.message}</p>
                        <p className="text-slate-500">{new Date(notif.createdAt).toLocaleString()}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}