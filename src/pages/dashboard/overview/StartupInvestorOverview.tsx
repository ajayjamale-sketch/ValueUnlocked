import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, TrendingUp, DollarSign, Target, Star, Search, ArrowUpRight, AlertTriangle } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { startupPortfolio } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const dealFlow = [
  { name: 'NexGen AI', stage: 'Series A', sector: 'AI', valuation: '$28M', ask: '$500K', fit: 94, status: 'hot' },
  { name: 'EcoLoop', stage: 'Seed', sector: 'CleanTech', valuation: '$8M', ask: '$150K', fit: 87, status: 'new' },
  { name: 'MedAI Platform', stage: 'Series B', sector: 'HealthTech', valuation: '$85M', ask: '$2M', fit: 82, status: 'reviewing' },
  { name: 'BlockLedger', stage: 'Pre-Seed', sector: 'Web3', valuation: '$4M', ask: '$75K', fit: 71, status: 'new' },
];

const sectorAlloc = [
  { name: 'AI/ML', value: 38, color: '#10B981' },
  { name: 'FinTech', value: 26, color: '#F59E0B' },
  { name: 'HealthTech', value: 18, color: '#3B82F6' },
  { name: 'CleanTech', value: 12, color: '#8B5CF6' },
  { name: 'Other', value: 6, color: '#64748B' },
];

const stageData = [
  { stage: 'Pre-Seed', count: 2, value: 75000 },
  { stage: 'Seed', count: 1, value: 100000 },
  { stage: 'Series A', count: 1, value: 250000 },
  { stage: 'Series B', count: 1, value: 500000 },
  { stage: 'Series C', count: 1, value: 500000 },
];

export default function StartupInvestorOverview() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Portfolio Companies" value="6 Startups" change="$1.47M invested" positive={true} icon={Zap} gradient />
        <KPICard label="Current Value" value="$2,468,000" change="+67.8% MOIC" positive={true} icon={TrendingUp} iconColor="text-emerald-400" />
        <KPICard label="Best Performer" value="NexaAI +228%" subtitle="Series B" icon={Star} iconColor="text-amber-400" />
        <KPICard label="Deal Flow" value="12 Active" subtitle="4 require action" icon={Target} iconColor="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 dark:text-white">Portfolio Companies</h3>
            <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs gap-1" onClick={() => navigate('/dashboard/startups')}>
              <Search className="w-3 h-3" /> Find Startups
            </Button>
          </div>
          <div className="space-y-3">
            {startupPortfolio.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer" onClick={() => toast.info(`Opening ${s.name} details...`)}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.status === 'growing' ? 'bg-emerald-500/20' : s.status === 'at-risk' ? 'bg-red-500/20' : 'bg-slate-200 dark:bg-white/10'}`}>
                    <span className={`text-xs font-bold ${s.status === 'growing' ? 'text-emerald-400' : s.status === 'at-risk' ? 'text-red-400' : 'text-slate-400'}`}>{s.name.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge className="text-[10px] h-4 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">{s.stage}</Badge>
                      <span className="text-xs text-slate-400">{s.sector}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">${(s.currentValue / 1000).toFixed(0)}K</p>
                  <p className={`text-xs font-medium ${s.return.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{s.return}</p>
                </div>
                <div className="text-right ml-4 hidden md:block">
                  <p className="text-xs text-slate-400">Ownership</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{s.ownership}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Sector Allocation</h3>
            <div className="flex items-center gap-3">
              <PieChart width={80} height={80}>
                <Pie data={sectorAlloc} cx={35} cy={35} innerRadius={20} outerRadius={36} paddingAngle={2} dataKey="value">
                  {sectorAlloc.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-1 flex-1">
                {sectorAlloc.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /><span className="text-slate-500 dark:text-slate-400">{s.name}</span></div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Live Deal Flow</h3>
            <div className="space-y-2">
              {dealFlow.slice(0,3).map((d, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-white">{d.name}</p>
                    <p className="text-[11px] text-slate-400">{d.stage} · {d.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-500">{d.fit}% fit</p>
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] p-0 text-slate-400 hover:text-emerald-400" onClick={() => toast.info(`Reviewing ${d.name}...`)}>Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Full Deal Pipeline</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10">
                {['Company', 'Stage', 'Sector', 'Valuation', 'Ask', 'AI Fit Score', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {dealFlow.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 font-semibold text-slate-800 dark:text-white text-sm">{d.name}</td>
                  <td className="py-3 pr-4"><Badge className="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">{d.stage}</Badge></td>
                  <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">{d.sector}</td>
                  <td className="py-3 pr-4 text-xs text-slate-600 dark:text-slate-300">{d.valuation}</td>
                  <td className="py-3 pr-4 text-xs text-slate-600 dark:text-slate-300">{d.ask}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full">
                        <div className="h-full gradient-growth rounded-full" style={{ width: `${d.fit}%` }} />
                      </div>
                      <span className="text-xs font-bold text-emerald-500">{d.fit}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge className={`text-[10px] border-0 ${d.status === 'hot' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : d.status === 'new' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{d.status}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-500 hover:text-emerald-400" onClick={() => toast.success(`Opening ${d.name} deep-dive...`)}>
                      Deep Dive <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
