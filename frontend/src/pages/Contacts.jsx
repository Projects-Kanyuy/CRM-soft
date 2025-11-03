import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';
import FilterSidebar from '../components/FilterSidebar'; // <-- Import the new sidebar
import ContactImportModal from '../components/ContactImportModal';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null); // <-- State for the selected filter
   const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // useCallback ensures this function is not recreated on every render,
  // making it safe to use in a useEffect dependency array.
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      // Build the query parameters for the API call
      const params = new URLSearchParams();
      if (selectedOrg) {
        params.append('organization', selectedOrg);
      }
      
      const response = await api.get('/contacts', { params });
      setContacts(response.data);
    } catch (error) {
      toast.error("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  }, [selectedOrg]); // Re-fetch only when the selected organization changes

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]); // The effect depends on the memoized fetchContacts function

  // Client-side search on the already filtered results
  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ... (closeModal, handleAddClick, handleEditClick, handleDeleteClick remain the same)
  const closeModal = () => { setIsModalOpen(false); setEditingContact(null); };
  const handleAddClick = () => { setEditingContact(null); setIsModalOpen(true); };
  const handleEditClick = (contact) => { setEditingContact(contact); setIsModalOpen(true); };
  const handleDeleteClick = async (contactId) => {
    if (window.confirm("...")) {
      try {
        await api.delete(`/contacts/${contactId}`);
        // Instead of just filtering, we call fetchContacts to get the fresh list
        fetchContacts();
        toast.success('Contact deleted.');
      } catch (error) {
        toast.error("Failed to delete contact.");
      }
    }
  };


  const handleSaveContact = async (formData) => {
    setIsSaving(true);
    const isEditing = !!editingContact;
    const contactData = { ...formData, _id: editingContact?._id };

    try {
      if (isEditing) {
        await api.put(`/contacts/${contactData._id}`, contactData);
      } else {
        await api.post('/contacts', contactData);
      }
      closeModal();
      // Refresh the list to show the new/updated contact
      fetchContacts(); 
      toast.success(`Contact ${isEditing ? 'updated' : 'saved'} successfully!`);
    } catch (error) {
      toast.error("Failed to save contact.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilterChange = (orgId) => {
    setSelectedOrg(orgId);
  };
 return (
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Column */}
      <div className="lg:col-span-1">
        <FilterSidebar onFilterChange={handleFilterChange} selectedOrg={selectedOrg} />
      </div>

      {/* Main Content Column */}
      <div className="lg:col-span-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-xs">
            {/* Search Input... */}
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex-shrink-0 flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-lg"
            >
              Import
            </button>
            <button onClick={handleAddClick} className="flex-shrink-0 flex items-center justify-center bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-2 px-4 rounded-lg">
              <PlusIcon className="h-5 w-5 mr-2" /><span className="hidden sm:inline">Add Contact</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            {loading ? (<p className="p-4 text-center text-slate-500">Loading contacts...</p>) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Organization</th><th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th></tr></thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap"><Link to={`/contacts/${contact._id}`} className="text-sm font-medium text-slate-900 hover:text-theme-accent hover:underline">{contact.firstName} {contact.lastName}</Link></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{contact.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{contact.organizationId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <button onClick={() => handleEditClick(contact)}><PencilSquareIcon className="h-5 w-5 text-slate-500 hover:text-theme-accent"/></button>
                      <button onClick={() => handleDeleteClick(contact._id)}><TrashIcon className="h-5 w-5 text-slate-500 hover:text-status-lost"/></button>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="4" className="text-center p-4 text-slate-500">No contacts found for this filter.</td>
                    </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      </div>
      
       <Modal isOpen={isModalOpen} setIsOpen={closeModal} title={editingContact ? "Edit Contact" : "Add New Contact"}>
        <ContactForm onSave={handleSaveContact} onCancel={closeModal} initialData={editingContact} isSaving={isSaving} />
      </Modal>
      <ContactImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={fetchContacts} // Pass the fetch function to refresh the list
      />
    </div>
  );
}