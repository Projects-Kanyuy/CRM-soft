import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import OrganizationForm from '../components/OrganizationForm';

export default function Organizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/organizations');
      setOrganizations(response.data);
    } catch (error) {
      toast.error("Failed to fetch organizations.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  const handleAddClick = () => {
    setEditingOrg(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (org) => {
    setEditingOrg(org);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (orgId) => {
    if (window.confirm("Are you sure you want to delete this organization? This may affect related contacts and deals.")) {
      try {
        await api.delete(`/organizations/${orgId}`);
        toast.success('Organization deleted.');
        fetchOrganizations();
      } catch (error) {
        toast.error("Failed to delete organization.");
      }
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    const isEditing = !!formData._id;
    try {
      if (isEditing) {
        await api.put(`/organizations/${formData._id}`, formData);
      } else {
        await api.post('/organizations', formData);
      }
      closeModal();
      toast.success(`Organization ${isEditing ? 'updated' : 'saved'}!`);
      fetchOrganizations();
    } catch (error)
    {
      toast.error("Failed to save organization.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <button onClick={handleAddClick} className="flex items-center justify-center bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-2 px-4 rounded-lg">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Organization
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4 text-center text-slate-500">Loading organizations...</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Website</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Modified</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {organizations.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      <Link to={`/organizations/${org._id}`} className="hover:text-theme-accent hover:underline">{org.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{org.industry || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {org.website ? (<a href={org.website} target="_blank" rel="noopener noreferrer" className="text-theme-accent hover:underline">{org.website}</a>) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div>{new Date(org.updatedAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">by {org.lastModifiedBy?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <button onClick={() => handleEditClick(org)} className="text-slate-500 hover:text-theme-accent"><PencilSquareIcon className="h-5 w-5" /></button>
                      <button onClick={() => handleDeleteClick(org._id)} className="text-slate-500 hover:text-status-lost"><TrashIcon className="h-5 w-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} setIsOpen={closeModal} title={editingOrg ? "Edit Organization" : "Add New Organization"}>
        <OrganizationForm 
          onSave={handleSave} 
          onCancel={closeModal} 
          initialData={editingOrg} 
          isSaving={isSaving} 
        />
      </Modal>
    </div>
  );
}