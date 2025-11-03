import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { BriefcaseIcon, UsersIcon, GlobeAltIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import ImageGallery from '../components/ImageGallery';
import VideoGallery from '../components/VideoGallery';
import FileAttachments from '../components/FileAttachments';

export default function OrganizationDetail() {
  const { orgId } = useParams();
  const [organization, setOrganization] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadingPictures, setIsUploadingPictures] = useState(false);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);
  const logoInputRef = useRef(null);

  const fetchData = async () => {
    // Keep the loading state true if we are re-fetching
    if (!loading) setLoading(true);
    try {
      const [orgRes, contactsRes, dealsRes] = await Promise.all([
        api.get(`/organizations/${orgId}`),
        api.get(`/contacts?organization=${orgId}`),
        api.get(`/deals?organization=${orgId}`),
      ]);
      setOrganization(orgRes.data);
      setContacts(contactsRes.data);
      setDeals(dealsRes.data);
    } catch (error) {
      toast.error("Failed to load organization data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await api.post(`/organizations/${orgId}/logo`, formData);
      setOrganization(res.data.organization);
      toast.success("Logo updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logo upload failed.");
    }
  };

  const handlePictureUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('pictures', files[i]); }
    setIsUploadingPictures(true);
    try {
        const res = await api.post(`/organizations/${orgId}/pictures`, formData);
        setOrganization(res.data.organization);
        toast.success(`${files.length > 1 ? `${files.length} pictures` : 'Picture'} uploaded!`);
    } catch (error) { toast.error("Picture upload failed."); } 
    finally { setIsUploadingPictures(false); }
  };

  const handlePictureDelete = async (publicId) => {
    if (window.confirm("Are you sure you want to delete this picture?")) {
        try {
            const res = await api.delete(`/organizations/${orgId}/pictures/${publicId}`);
            setOrganization(res.data.organization);
            toast.success("Picture deleted.");
        } catch (error) { toast.error("Failed to delete picture."); }
    }
  };

  const handleVideoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('videos', files[i]); }
    setIsUploadingVideos(true);
    try {
        const res = await api.post(`/organizations/${orgId}/videos`, formData);
        setOrganization(res.data.organization);
        toast.success(`${files.length > 1 ? `${files.length} videos` : 'Video'} uploaded!`);
    } catch (error) { toast.error("Video upload failed."); }
    finally { setIsUploadingVideos(false); }
  };

  const handleVideoDelete = async (publicId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
        try {
            const res = await api.delete(`/organizations/${orgId}/videos/${publicId}`);
            setOrganization(res.data.organization);
            toast.success("Video deleted.");
        } catch (error) { toast.error("Failed to delete video."); }
    }
  };

  if (loading) return <p className="text-center p-8">Loading organization details...</p>;
  if (!organization) return <p className="text-center p-8">Organization not found.</p>;

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between md:space-x-5 mb-8">
        <div className="flex items-start space-x-5">
          <div className="relative flex-shrink-0">
            {organization.logoUrl ? (
              <img className="h-24 w-24 rounded-lg object-cover bg-white border" src={organization.logoUrl} alt={`${organization.name} logo`} />
            ) : (
              <div className="h-24 w-24 rounded-lg bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-500">{organization.name.charAt(0)}</div>
            )}
            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
            <button onClick={() => logoInputRef.current.click()} title="Upload logo" className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow border text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
              <ArrowUpOnSquareIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="pt-1.5">
            <h1 className="text-3xl font-bold text-slate-800">{organization.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              {organization.industry && <span className="flex items-center gap-x-1.5"><BriefcaseIcon className="h-4 w-4"/> {organization.industry}</span>}
              {organization.website && <a href={organization.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-x-1.5 text-theme-accent hover:underline"><GlobeAltIcon className="h-4 w-4"/> {organization.website}</a>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {organization.biography && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-2 text-slate-900">About {organization.name}</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{organization.biography}</p>
            </div>
          )}
          {organization.services?.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-3 text-slate-900">Services</h2>
              <div className="flex flex-wrap gap-2">
                {organization.services.map(s => <span key={s} className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>)}
              </div>
            </div>
          )}
          <ImageGallery pictures={organization.pictures} onUpload={handlePictureUpload} onDelete={handlePictureDelete} isUploading={isUploadingPictures} />
          <VideoGallery videos={organization.videos} onUpload={handleVideoUpload} onDelete={handleVideoDelete} isUploading={isUploadingVideos} />
          <FileAttachments parentId={orgId} parentType="organizations" />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><UsersIcon className="h-5 w-5 text-slate-500"/> Related Contacts</h2>
            <ul className="divide-y divide-slate-200">
              {contacts.length > 0 ? contacts.map(contact => (
                <li key={contact._id} className="py-3">
                  <Link to={`/contacts/${contact._id}`} className="font-medium text-slate-800 hover:text-theme-accent">{contact.firstName} {contact.lastName}</Link>
                  <p className="text-sm text-slate-500">{contact.email}</p>
                </li>
              )) : <p className="text-sm text-slate-500">No contacts for this organization.</p>}
            </ul>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BriefcaseIcon className="h-5 w-5 text-slate-500"/> Related Deals</h2>
            <ul className="divide-y divide-slate-200">
              {deals.length > 0 ? deals.map(deal => (
                <li key={deal._id} className="py-3">
                  <p className="font-medium text-slate-800">{deal.title}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Value: ${deal.value.toLocaleString()}</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${deal.stage === 'Won' ? 'bg-green-100 text-green-800' : deal.stage === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>{deal.stage}</span>
                  </div>
                </li>
              )) : <p className="text-sm text-slate-500">No deals for this organization.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}