import { useEffect, useState } from 'react';
import api from '../api';

export default function FilterSidebar({ onFilterChange, selectedOrg }) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/organizations');
        setOrganizations(res.data);
      } catch (error) {
        console.error("Failed to fetch organizations for filter.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 h-fit">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Filters</h3>
      <div>
        <h4 className="font-medium text-slate-600 mb-2">Organization</h4>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onFilterChange(null)}
              className={`w-full text-left p-2 rounded-md text-sm ${!selectedOrg ? 'bg-violet-100 text-violet-700 font-semibold' : 'hover:bg-slate-100'}`}
            >
              All Organizations
            </button>
          </li>
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : organizations.map(org => (
            <li key={org._id}>
              <button
                onClick={() => onFilterChange(org._id)}
                className={`w-full text-left p-2 rounded-md text-sm ${selectedOrg === org._id ? 'bg-violet-100 text-violet-700 font-semibold' : 'hover:bg-slate-100'}`}
              >
                {org.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* You can add more filter sections here in the future (e.g., by date created, by tag, etc.) */}
    </div>
  );
}