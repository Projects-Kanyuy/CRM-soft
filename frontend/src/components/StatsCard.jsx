export default function StatsCard({ title, value, change, changeType }) {
  const isPositive = changeType === 'increase';
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-200">
      <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
      <div className="mt-1 flex items-baseline">
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        {change && (
          <p className={`ml-2 flex items-baseline text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}