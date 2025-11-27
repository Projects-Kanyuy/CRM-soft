import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const isOverdue = (dueDate) => new Date(dueDate) < new Date() && !isToday(new Date(dueDate));
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear();
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        toast.error("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      const updatedTask = await api.put(`/tasks/${task._id}`, { status: newStatus });
      setTasks(currentTasks => currentTasks.map(t => t._id === task._id ? updatedTask.data : t));
      toast.success(`Task marked as ${newStatus.toLowerCase()}.`);
    } catch (error) {
      toast.error("Failed to update task status.");
    }
  };

  if (loading) return <p>Loading tasks...</p>;
  
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div>
      {/*<h1 className="text-3xl font-bold text-slate-800 mb-6">My Tasks</h1>*/}

      {/* Pending Tasks */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Pending</h2>
        {pendingTasks.length > 0 ? (
          <ul className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-200">
            {pendingTasks.map(task => (
              <li key={task._id} className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <button onClick={() => handleToggleComplete(task)} title="Mark complete" className="mt-1 flex-shrink-0 h-6 w-6 rounded-full border-2 border-slate-300 hover:border-green-500 transition-colors">
                  </button>
                  <div>
                    <p className="font-medium text-slate-900">{task.subject}</p>
                    <p className="text-sm text-slate-500">For: <Link to={`/contacts/${task.contactId._id}`} className="hover:underline text-theme-accent">{task.contactId.firstName} {task.contactId.lastName}</Link></p>
                  </div>
                </div>
                <p className={`text-sm font-semibold flex-shrink-0 ${isOverdue(task.dueDate) ? 'text-status-lost' : 'text-slate-500'}`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : <p className="text-slate-500">No pending tasks. Great job!</p>}
      </div>

      {/* Completed Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Completed</h2>
        {completedTasks.length > 0 ? (
          <ul className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-200">
            {completedTasks.map(task => (
              <li key={task._id} className="p-4 flex items-start justify-between opacity-60">
                <div className="flex items-start gap-4">
                  <button onClick={() => handleToggleComplete(task)} title="Mark as pending" className="mt-1 flex-shrink-0 h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <div>
                    <p className="font-medium text-slate-900 line-through">{task.subject}</p>
                    <p className="text-sm text-slate-500">For: <Link to={`/contacts/${task.contactId._id}`} className="hover:underline text-theme-accent">{task.contactId.firstName} {task.contactId.lastName}</Link></p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-500">Completed</p>
              </li>
            ))}
          </ul>
        ) : <p className="text-slate-500">No tasks completed yet.</p>}
      </div>
    </div>
  );
}