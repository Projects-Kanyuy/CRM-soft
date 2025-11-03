import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { ArrowLeftIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Timeline from '../components/Timeline';
import FileAttachments from '../components/FileAttachments';
import RichTextEditor from '../components/RichTextEditor';
import EmailComposer from '../components/EmailComposer';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ContactDetail() {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [timelineKey, setTimelineKey] = useState(Date.now());

  const refreshTimeline = () => setTimelineKey(Date.now());

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const contactRes = await api.get(`/contacts/${contactId}`);
        setContact(contactRes.data);
      } catch (error) {
        toast.error('Failed to load contact details.');
      } finally {
        setLoading(false);
      }
    };
    fetchContactData();
  }, [contactId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim() || noteContent === '<p></p>') return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = noteContent;
    const noteText = tempDiv.textContent || tempDiv.innerText || '';
    try {
      await api.post(`/contacts/${contactId}/notes`, { body: noteText });
      toast.success("Note added!");
      setNoteContent('');
      refreshTimeline();
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };
  
  if (loading) return <div className="text-center p-8">Loading contact...</div>;

  if (!contact) return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Contact not found</h1>
      </div>
    );

  return (
    <div>
      <div className="flex items-start gap-x-4 mb-6">
        <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600">
          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{contact.firstName} {contact.lastName}</h1>
          {contact.organizationId && (
            <p className="text-slate-500 flex items-center gap-x-2">
              <BuildingOfficeIcon className="h-5 w-5 text-slate-400" />
              <Link to={`/organizations/${contact.organizationId._id}`} className="hover:underline">{contact.organizationId.name}</Link>
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-slate-200 p-1">
              <Tab className={({ selected }) => classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5', 'focus:outline-none', selected ? 'bg-white shadow' : 'text-slate-500 hover:bg-white/[0.5]')}>Add Note</Tab>
              <Tab className={({ selected }) => classNames('w-full rounded-lg py-2.5 text-sm font-medium leading-5', 'focus:outline-none', selected ? 'bg-white shadow' : 'text-slate-500 hover:bg-white/[0.5]')}>Send Email</Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="rounded-xl focus:outline-none">
                <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                  <form onSubmit={handleAddNote}>
                    <RichTextEditor content={noteContent} onUpdate={(c) => setNoteContent(c)} />
                    <div className="mt-3 flex justify-end">
                      <button type="submit" className="inline-flex items-center rounded-lg border border-transparent bg-theme-accent px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover">Save Note</button>
                    </div>
                  </form>
                </div>
              </Tab.Panel>
              <Tab.Panel className="rounded-xl focus:outline-none">
                <EmailComposer contact={contact} onEmailSent={refreshTimeline} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <FileAttachments parentId={contactId} parentType="contacts" />
          <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4">Timeline</h2>
            <Timeline contactId={contactId} key={timelineKey} />
          </div>
        </div>
        <div className="lg:col-span-1 bg-white p-5 rounded-lg shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-semibold mb-4">Contact Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-x-3"><EnvelopeIcon className="h-5 w-5 text-slate-400"/><span className="text-slate-700 break-all">{contact.email}</span></div>
            <div className="flex items-center gap-x-3"><PhoneIcon className="h-5 w-5 text-slate-400"/><span className="text-slate-700">{contact.phone || 'N/A'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}