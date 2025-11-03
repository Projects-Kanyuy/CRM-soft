import { useState, useEffect } from 'react';
import api from '../api';

export default function ContactForm({ onSave, onCancel, initialData, isSaving }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', organizationId: '' });
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    api.get('/organizations').then(res => setOrganizations(res.data)).catch(err => console.error("Could not fetch organizations"));
  }, []);
  
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        organizationId: initialData.organizationId?._id || '',
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', phone: '', organizationId: '' });
    }
  }, [initialData]);

  const handleChange = (e) => setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  const inputStyle = "mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500";
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">First Name</label>
          <input type="text" name="firstName" id="firstName" required value={formData.firstName} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">Last Name</label>
          <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className={inputStyle} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={inputStyle} />
      </div>
       <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
        <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyle} />
      </div>
      <div>
        <label htmlFor="organizationId" className="block text-sm font-medium text-slate-700">Organization</label>
        <select id="organizationId" name="organizationId" value={formData.organizationId} onChange={handleChange} className={inputStyle}>
          <option value="">Select an organization</option>
          {organizations.map(org => (<option key={org._id} value={org._id}>{org.name}</option>))}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 bg-white py-2 px-6 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg border border-transparent bg-theme-accent py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Save Contact'}
        </button>
      </div>
    </form>
  );
}