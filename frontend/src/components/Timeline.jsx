import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import {
  ChatBubbleLeftIcon, PhoneIcon, VideoCameraIcon, ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  Note: ChatBubbleLeftIcon,
  Call: PhoneIcon,
  Meeting: VideoCameraIcon,
  Task: ClipboardDocumentCheckIcon,
};

function TimelineItem({ item }) {
  const Icon = iconMap[item.type] || ChatBubbleLeftIcon;
  const date = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="relative flex items-start space-x-3">
      <div className="relative">
        <span className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center ring-8 ring-white">
          <Icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <div className="text-sm">
            <p className="font-medium text-slate-900">{item.subject}</p>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{date}</p>
        </div>
        <div className="mt-2 text-sm text-slate-700">
          <p>{item.body}</p>
        </div>
      </div>
    </div>
  );
}

export default function Timeline({ contactId }) {
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contactId) return;

    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const [notesRes, activitiesRes] = await Promise.all([
          api.get(`/contacts/${contactId}/notes`),
          api.get(`/contacts/${contactId}/activities`),
        ]);

        const formattedNotes = notesRes.data.map(n => ({
          id: `note-${n._id}`,
          type: 'Note',
          subject: `Note added`,
          body: n.body,
          date: n.createdAt,
        }));

        const formattedActivities = activitiesRes.data.map(a => ({
          id: `activity-${a._id}`,
          type: a.kind,
          subject: a.subject,
          body: a.body,
          date: a.scheduledAt,
        }));
        
        const combined = [...formattedNotes, ...formattedActivities];
        combined.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first
        
        setTimelineItems(combined);
      } catch (error) {
        toast.error("Failed to load timeline.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, [contactId]);

  if (loading) return <p>Loading timeline...</p>;

  return (
    <div className="flow-root">
      <ul  className="-mb-8 space-y-8">
        {timelineItems.length > 0 ? (
          timelineItems.map((item, itemIdx) => (
            <li key={item.id}>
              {/* This div creates the vertical line */}
              <div className="relative pb-8">
                {itemIdx !== timelineItems.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                ) : null}
                <TimelineItem item={item} />
              </div>
            </li>
          ))
        ) : (
          <p className="text-slate-500">No activities or notes for this contact yet.</p>
        )}
      </ul>
    </div>
  );
}