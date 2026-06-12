import { useState } from 'react';
import { Compass, Filter, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpportunityCard from '@/components/features/OpportunityCard';
import { opportunities } from '@/lib/mockData';
import { toast } from 'sonner';

const types = ['All', 'Stock', 'Sector', 'Startup', 'Acquisition', 'Franchise'];
const risks = ['All Risks', 'Low', 'Medium', 'High'];

export default function OpportunitiesPage() {
  const [type, setType] = useState('All');
  const [risk, setRisk] = useState('All Risks');

  const filtered = opportunities.filter(o => {
    const typeMatch = type === 'All' || o.type.toLowerCase() === type.toLowerCase();
    const riskMatch = risk === 'All Risks' || o.risk.toLowerCase() === risk.toLowerCase();
    return typeMatch && riskMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${type === t ? 'gradient-growth text-white' : 'bg-white dark:bg-navy border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {risks.map(r => (
            <button key={r} onClick={() => setRisk(r)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${risk === r ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-800' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(opp => <OpportunityCard key={opp.id} opportunity={opp} onAction={() => toast.success(`Added ${opp.title} to watchlist!`)} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No opportunities match your filters</p>
        </div>
      )}
    </div>
  );
}
