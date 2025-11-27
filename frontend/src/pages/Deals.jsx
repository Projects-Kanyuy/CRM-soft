import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import DealPipeline from '../components/DealPipeline';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';
import DealForm from '../components/DealForm';

const STAGES = ['Lead', 'Qualification', 'Proposal', 'Won', 'Lost'];

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!loading) setLoading(true); 

    try {
      const [dealsRes, contactsRes, orgsRes] = await Promise.all([
        api.get('/deals'),
        api.get('/contacts'),
        api.get('/organizations')
      ]);

      setDeals(dealsRes.data);
      setContacts(contactsRes.data);
      setOrganizations(orgsRes.data);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch necessary data.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const dealId = active.id;
      const newStage = over.id;
      
      const dealToUpdate = deals.find(d => d._id === dealId);
      if (!dealToUpdate) return;

      const originalDeals = [...deals];
      
      setDeals(currentDeals =>
        currentDeals.map(d =>
          d._id === dealId ? { ...d, stage: newStage } : d
        )
      );

      try {
        await api.put(`/deals/${dealId}`, { stage: newStage });
        toast.success("Deal stage updated!");
      } catch (error) {
        setDeals(originalDeals);
        toast.error("Failed to update deal stage.");
      }
    }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingDeal(null); };
  const handleAddClick = () => { setEditingDeal(null); setIsModalOpen(true); };
  const handleEditClick = (dealToEdit) => { setEditingDeal(dealToEdit); setIsModalOpen(true); };

  const handleSave = async (formData) => {
    setIsSaving(true);
    const isEditing = !!formData._id;

    try {
      if (isEditing) {
        await api.put(`/deals/${formData._id}`, formData);
      } else {
        await api.post('/deals', formData);
      }
      closeModal();
      toast.success(`Deal ${isEditing ? 'updated' : 'saved'}!`);
      await fetchData();

    } catch (error) {
      toast.error("Failed to save deal.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = async (dealId, newStage) => {
    const originalDeals = [...deals];

    setDeals(currentDeals =>
      currentDeals.map(d =>
        d._id === dealId ? { ...d, stage: newStage } : d
      )
    );

    try {
      await api.put(`/deals/${dealId}`, { stage: newStage });
      toast.success(`Deal moved to ${newStage}!`);
    } catch (error) {
      setDeals(originalDeals);
      toast.error("Failed to move deal.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center bg-theme-accent hover:bg-theme-accent-hover text-white font-bold py-2 px-4 rounded-lg"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Add Deal
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-10">Loading pipeline...</p>
      ) : (
        <DealPipeline 
          stages={STAGES}
          deals={deals}
          organizations={organizations}
          onDragEnd={handleDragEnd}
          onEditDeal={handleEditClick}
          onMoveDeal={handleMove}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        setIsOpen={closeModal}
        title={editingDeal ? "Edit Deal" : "Add New Deal"}
      >
        <DealForm
          onSave={handleSave}
          onCancel={closeModal}
          initialData={editingDeal}
          contacts={contacts}
          organizations={organizations}
          isSaving={isSaving}
        />
      </Modal>
    </div>
  );
}
