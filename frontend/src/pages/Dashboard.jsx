import { useEffect, useState } from 'react';
import api from '../api';
import StatsCard from '../components/StatsCard';
import DealPipelineChart from '../components/DealPipelineChart'; // Import the new chart
import UpcomingTasks from '../components/UpcomingTasks';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [deals, setDeals] = useState([]); // We need to store the raw deals data
  const [stats, setStats] = useState({
    totalDeals: 0,
    dealsWon: 0,
    valueWon: 0,
    newLeads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dealsRes = await api.get('/deals');
        const fetchedDeals = dealsRes.data;
        setDeals(fetchedDeals); // Store the deals for the chart

        // Calculate KPIs from the fetched deals
        const totalDeals = fetchedDeals.length;
        const dealsWon = fetchedDeals.filter(d => d.stage === 'Won').length;
        const valueWon = fetchedDeals
          .filter(d => d.stage === 'Won')
          .reduce((sum, deal) => sum + deal.value, 0);
        const newLeads = fetchedDeals.filter(d => d.stage === 'Lead').length;
        
        setStats({ totalDeals, dealsWon, valueWon, newLeads });

      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/*<h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>*/}
      
      {loading ? (<p className="text-center py-4">Loading stats...</p>) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Deals" value={stats.totalDeals} />
          <StatsCard title="Deals Won" value={stats.dealsWon} />
          <StatsCard title="Value Won" value={`$${stats.valueWon.toLocaleString()}`} />
          <StatsCard title="New Leads" value={stats.newLeads} />
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Replace the placeholder with the new chart component */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Deal Pipeline Overview</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-500">Loading chart...</div>
          ) : (
            <DealPipelineChart deals={deals} />
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Upcoming Tasks</h2>
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
}