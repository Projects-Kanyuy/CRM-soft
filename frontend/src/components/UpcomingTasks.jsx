import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast'; // This icon doesn't exist, we'll use a div instead

const isOverdue = (dueDate) => {
  return new Date(dueDate) < new Date() && !isToday(new Date(dueDate));
};

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};

export default function UpcomingTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks');
        setTasks(res.data.filter(t => t.status === 'Pending').slice(0, 5)); // Show top 5 pending tasks
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <p className="text-slate-500">Loading tasks...</p>;
  if (tasks.length === 0) return <p className="text-slate-500">No upcoming tasks.</p>;

  return (
    <ul className="divide-y divide-slate-200">
      {tasks.map(task => (
        <li key={task._id} className="py-3 flex items-start justify-between">
          <div>
            <p className="font-medium text-slate-800">{task.subject}</p>
            <p className="text-sm text-slate-500">
              For: <Link to={`/contacts/${task.contactId._id}`} className="hover:underline text-theme-accent">{task.contactId.firstName} {task.contactId.lastName}</Link>
            </p>
            <p className={`text-sm font-semibold ${isOverdue(task.dueDate) ? 'text-status-lost' : 'text-slate-500'}`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <button title="Mark as complete" className="text-slate-400 hover:text-green-500">
            {/* Simple circle icon */}
            <div className="h-6 w-6 rounded-full border-2 border-slate-400"></div>
          </button>
        </li>
      ))}
    </ul>
  );
}