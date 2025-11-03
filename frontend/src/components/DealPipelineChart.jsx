import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STAGES = ['Lead', 'Qualification', 'Proposal', 'Won', 'Lost'];

export default function DealPipelineChart({ deals }) {
  // useMemo ensures this complex calculation only runs when the deals data changes
  const chartData = useMemo(() => {
    return STAGES.map(stage => {
      const dealsInStage = deals.filter(deal => deal.stage === stage);
      return {
        name: stage,
        // Calculate the total value of deals in this stage
        value: dealsInStage.reduce((sum, deal) => sum + deal.value, 0),
        // Count the number of deals in this stage
        count: dealsInStage.length,
      };
    });
  }, [deals]);

  // A custom tooltip for better presentation
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-sm">
          <p className="font-bold text-slate-800">{`${label}`}</p>
          <p className="text-sm text-slate-600">{`Total Value: $${payload[0].value.toLocaleString()}`}</p>
          <p className="text-sm text-slate-600">{`Deal Count: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // ResponsiveContainer makes the chart adapt to its parent's size
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis 
          tickFormatter={(value) => `$${(value/1000)}k`} // Format Y-axis ticks
          stroke="#64748b" 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
        <Legend />
        <Bar dataKey="value" name="Total Value" fill="#8b5cf6" /> {/* theme-accent: violet-500 */}
        <Bar dataKey="count" name="Deal Count" fill="#a78bfa" /> {/* A lighter violet */}
      </BarChart>
    </ResponsiveContainer>
  );
}