import { useState, useEffect, Fragment, memo } from 'react';
import { Tab, Dialog, Transition, Switch } from '@headlessui/react';
import api from '../api';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import AdminOnly from '../components/AdminOnly';
import { EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// --- Reusable Form Components for this page (wrapped in memo) ---

const ProfileForm = memo(function ProfileForm() {
    const { user, updateUser } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.put('/users/profile', { name });
            updateUser(res.data);
            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500" 
                />
            </div>
            <div className="text-right pt-2">
                <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg border border-transparent bg-theme-accent py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
});

const PasswordForm = memo(function PasswordForm() {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [visibility, setVisibility] = useState({ current: false, new: false, confirm: false });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => setPasswords({...passwords, [e.target.name]: e.target.value });
    const toggleVisibility = (field) => setVisibility({...visibility, [field]: !visibility[field]});

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setIsSaving(true);
        try {
            await api.put('/users/profile/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
            toast.success("Password changed successfully!");
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password.");
        } finally {
            setIsSaving(false);
        }
    };

    const PasswordInput = ({ name, value, label, isVisible, onToggle }) => (
        <div>
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative mt-1">
                <input type={isVisible ? 'text' : 'password'} name={name} value={value} onChange={handleChange} required className="block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500"/>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button type="button" onClick={onToggle} className="text-slate-400 hover:text-slate-600">
                        {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-6 mt-6 border-t border-slate-200">
            <h3 className="text-lg font-medium text-slate-900">Change Password</h3>
            <PasswordInput name="currentPassword" value={passwords.currentPassword} label="Current Password" isVisible={visibility.current} onToggle={() => toggleVisibility('current')} />
            <PasswordInput name="newPassword" value={passwords.newPassword} label="New Password" isVisible={visibility.new} onToggle={() => toggleVisibility('new')} />
            <PasswordInput name="confirmPassword" value={passwords.confirmPassword} label="Confirm New Password" isVisible={visibility.confirm} onToggle={() => toggleVisibility('confirm')} />
             <div className="text-right pt-2">
                <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg border border-transparent bg-theme-accent py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Change Password'}
                </button>
            </div>
        </form>
    );
});

function CreateUserModal({ isOpen, onClose, onUserCreated }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });
    const [isSaving, setIsSaving] = useState(false);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.post('/users', formData);
            toast.success("User created successfully!");
            onUserCreated(res.data);
            onClose();
        } catch(error) {
            toast.error(error.response?.data?.message || "Failed to create user.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyle = "mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500";
    const ROLES = ['Admin', 'Manager', 'User', 'Viewer'];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Create New User</Dialog.Title>
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div><label className="text-sm font-medium text-slate-700">Full Name</label><input type="text" name="name" required onChange={handleChange} className={inputStyle} /></div>
                                    <div><label className="text-sm font-medium text-slate-700">Email</label><input type="email" name="email" required onChange={handleChange} className={inputStyle} /></div>
                                    <div><label className="text-sm font-medium text-slate-700">Password</label><input type="password" name="password" required onChange={handleChange} className={inputStyle} /></div>
                                    <div><label className="text-sm font-medium text-slate-700">Role</label><select name="role" onChange={handleChange} defaultValue="User" className={inputStyle}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 bg-white py-2 px-6 text-sm font-medium text-slate-700">Cancel</button>
                                        <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg bg-theme-accent py-2 px-6 text-sm font-medium text-white disabled:opacity-50">{isSaving ? 'Creating...' : 'Create User'}</button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

function UserManagementTable() {
    const ROLES = ['Admin', 'Manager', 'User', 'Viewer'];
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    
    useEffect(() => {
        api.get('/users').then(res => {
            setUsers(res.data);
            setLoading(false);
        }).catch(() => toast.error("Failed to fetch users."));
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const res = await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(currentUsers => currentUsers.map(user => user._id === userId ? res.data : user));
            toast.success("User role updated!");
        } catch (error) {
            toast.error("Failed to update role.");
        }
    };

    const handleStatusChange = async (user, newStatus) => {
        try {
            const res = await api.put(`/users/${user._id}/status`, { isActive: newStatus });
            setUsers(currentUsers => currentUsers.map(u => u._id === user._id ? res.data : u));
            toast.success(`User account ${newStatus ? 'activated' : 'deactivated'}.`);
        } catch (error) {
            toast.error("Failed to update user status.");
        }
    };
    
    if (loading) return <p className="text-center p-4">Loading users...</p>;
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
                <button onClick={() => setCreateModalOpen(true)} className="flex items-center justify-center bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-2 px-4 rounded-lg">
                    <PlusIcon className="h-5 w-5 mr-2" />Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th></tr></thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                    <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="rounded-md border-slate-300 shadow-sm focus:border-violet-500 focus:ring-violet-500">
                                        {ROLES.map(role => (<option key={role} value={role}>{role}</option>))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Switch checked={user.isActive} onChange={(checked) => handleStatusChange(user, checked)} className={classNames(user.isActive ? 'bg-violet-600' : 'bg-slate-200', 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2')}>
                                        <span className={classNames(user.isActive ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out')}/>
                                    </Switch>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onUserCreated={(newUser) => setUsers([...users, newUser])}/>
        </div>
    );
}

// --- Main Settings Page Component ---
export default function Settings() {
  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-slate-200 p-1 max-w-md">
          <Tab as={Fragment}>
              {({ selected }) => (
                <button className={classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5', 'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-violet-300 ring-white ring-opacity-60', selected ? 'bg-white shadow text-violet-700' : 'text-slate-500 hover:bg-white/[0.5]')}>
                  Profile
                </button>
              )}
          </Tab>
          <AdminOnly>
            <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5', 'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-violet-300 ring-white ring-opacity-60', selected ? 'bg-white shadow text-violet-700' : 'text-slate-500 hover:bg-white/[0.5]')}>
                    User Management
                  </button>
                )}
            </Tab>
          </AdminOnly>
        </Tab.List>
        <Tab.Panels className="mt-6">
          <Tab.Panel className="rounded-xl focus:outline-none">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl">
              <h2 className="text-xl font-semibold mb-6">Your Profile Settings</h2>
              <ProfileForm />
              <PasswordForm />
            </div>
          </Tab.Panel>
          <AdminOnly>
            <Tab.Panel className="rounded-xl focus:outline-none">
              <UserManagementTable />
            </Tab.Panel>
          </AdminOnly>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}