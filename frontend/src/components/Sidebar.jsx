import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import useAuthStore from '../store/authStore';
import { ChartBarIcon, UsersIcon, BuildingOffice2Icon, BanknotesIcon, Cog6ToothIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AdminOnly from './AdminOnly';

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  //{ name: 'My Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
  { name: 'Contacts', href: '/contacts', icon: UsersIcon },
  { name: 'Deals', href: '/deals', icon: BanknotesIcon },
  { name: 'Organizations', href: '/organizations', icon: BuildingOffice2Icon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold text-white">StellarCRM</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      classNames(
                        isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200'
                      )
                    }
                  >
                    <item.icon className="h-6 w-6 shrink-0" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <AdminOnly>
                <li>
                  <NavLink to="/settings" className={({ isActive }) => classNames(isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200')}>
                    <Cog6ToothIcon className="h-6 w-6 shrink-0" />
                    Settings
                  </NavLink>
                </li>
              </AdminOnly>
            </ul>
          </li>
          
          <li className="mt-auto">
            <Menu as="div" className="relative">
              <Menu.Button className="group -mx-2 flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold leading-6 text-slate-400 hover:bg-slate-800 hover:text-white">
                <div className="flex items-center gap-x-3">
                  <img className="h-8 w-8 rounded-full bg-slate-800" src={`https://ui-avatars.com/api/?name=${user?.name}&background=64748b&color=fff`} alt="" />
                  <span className="text-white">{user?.name || 'User'}</span>
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute bottom-full left-0 z-10 mb-2 w-56 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                      <p className="truncate text-sm text-slate-500">{user?.email}</p>
                    </div>
                    <Menu.Item>
                      {({ active }) => (
                        <Link to="/settings" className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700')}>
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button onClick={handleLogout} className={classNames(active ? 'bg-slate-100' : '', 'block w-full text-left px-4 py-2 text-sm text-slate-700')}>
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        </ul>
      </nav>
    </div>
  );
}