import { useState, useEffect } from 'react';

const STAGES = ['Lead', 'Qualification', 'Proposal', 'Won', 'Lost'];

export default function DealForm({ onSave, onCancel, initialData, contacts, organizations, isSaving }) {
  const [formData, setFormData] = useState({ title: '', value: '', stage: 'Lead', contactId: '', organizationId: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        value: initialData.value || '',
        stage: initialData.stage || 'Lead',
        contactId: initialData.contactId?._id || '',
        organizationId: initialData.organizationId?._id || '',
      });
    } else {
      setFormData({ title: '', value: '', stage: 'Lead', contactId: '', organizationId: '' });
    }
  }, [initialData]);

  // --- THIS IS THE UPDATED LOGIC ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the user is changing the contact...
    if (name === 'contactId') {
      // Find the full contact object from our list
      const selectedContact = contacts.find(contact => contact._id === value);
      
      // Get the associated organization ID, if it exists
      const orgId = selectedContact?.organizationId?._id || '';
      
      // Update BOTH the contactId and the organizationId in the form state
      setFormData(prevData => ({
        ...prevData,
        contactId: value,
        organizationId: orgId,
      }));
    } else {
      // For any other field, just update it normally
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...formData, _id: initialData?._id }); };
  
  const inputStyle = "mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Deal Title</label>
        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className={inputStyle} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-slate-700">Value ($)</label>
          <input type="number" name="value" id="value" required value={formData.value} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-slate-700">Stage</label>
          <select id="stage" name="stage" value={formData.stage} onChange={handleChange} className={inputStyle}>
            {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contactId" className="block text-sm font-medium text-slate-700">Contact</label>
        <select id="contactId" name="contactId" value={formData.contactId} onChange={handleChange} required className={inputStyle}>
          <option value="">Select a contact</option>
          {contacts.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="organizationId" className="block text-sm font-medium text-slate-700">Organization</label>
        {/* The 'value' of this select is now controlled by the smart handleChange function */}
        <select id="organizationId" name="organizationId" value={formData.organizationId} onChange={handleChange} required className={inputStyle}>
          <option value="">Select an organization</option>
          {organizations.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 bg-white py-2 px-6 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg border border-transparent bg-theme-accent py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Save Deal'}
        </button>
      </div>
    </form>
  );
}