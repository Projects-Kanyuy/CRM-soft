import { useState, useEffect } from 'react';

export default function OrganizationForm({ onSave, onCancel, initialData, isSaving }) {
  const [formData, setFormData] = useState({ name: '', website: '', industry: '', size: '', biography: '', services: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        website: initialData.website || '',
        industry: initialData.industry || '',
        size: initialData.size || '',
        biography: initialData.biography || '',
        services: initialData.services?.join(', ') || '', // Convert array to comma-separated string for the textarea
      });
    } else {
      setFormData({ name: '', website: '', industry: '', size: '', biography: '', services: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, _id: initialData?._id });
  };

  const inputStyle = "mt-1 block w-full rounded-md border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:border-violet-500 focus:ring-violet-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Organization Name</label>
        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyle} />
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-slate-700">Website</label>
        <input type="url" name="website" id="website" value={formData.website} onChange={handleChange} className={inputStyle} placeholder="https://example.com" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-700">Industry</label>
          <input type="text" name="industry" id="industry" value={formData.industry} onChange={handleChange} className={inputStyle} />
        </div>
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-slate-700">Company Size</label>
          <input type="number" name="size" id="size" value={formData.size} onChange={handleChange} className={inputStyle} />
        </div>
      </div>
      <div>
        <label htmlFor="biography" className="block text-sm font-medium text-slate-700">Biography</label>
        <textarea name="biography" id="biography" rows={4} value={formData.biography} onChange={handleChange} className={inputStyle} />
      </div>
      <div>
        <label htmlFor="services" className="block text-sm font-medium text-slate-700">Services</label>
        <textarea name="services" id="services" rows={2} value={formData.services} onChange={handleChange} className={inputStyle} placeholder="e.g., Web Design, SEO, Marketing" />
        <p className="mt-1 text-xs text-slate-500">Enter services separated by commas.</p>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 bg-white py-2 px-6 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isSaving} className="inline-flex justify-center rounded-lg border border-transparent bg-theme-accent py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Save Organization'}
        </button>
      </div>
    </form>
  );
}