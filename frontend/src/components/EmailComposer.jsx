import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor'; // We'll reuse our powerful editor
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function EmailComposer({ contact, onEmailSent }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim() || body === '<p></p>') {
      toast.error("Subject and body are required.");
      return;
    }

    setIsSending(true);
    try {
      await api.post(`/contacts/${contact._id}/email`, { subject, body });
      toast.success(`Email sent to ${contact.firstName}!`);
      setSubject('');
      setBody('');
      onEmailSent(); // Notify parent to refresh the timeline
    } catch (error) {
      toast.error("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-4">Send Email</h2>
      <form onSubmit={handleSendEmail} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
          <RichTextEditor
            content={body}
            onUpdate={(newContent) => setBody(newContent)}
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={isSending} className="inline-flex items-center rounded-md border border-transparent bg-theme-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-theme-accent-hover disabled:opacity-50">
            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </div>
  );
}