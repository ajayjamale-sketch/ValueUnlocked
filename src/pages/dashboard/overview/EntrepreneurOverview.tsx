import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Building2, TrendingUp, DollarSign, Target, BarChart3, Lightbulb, ArrowUpRight, Users } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { entrepreneurMetrics, revenueData } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const competitorData = [
  { company: 'Your Business', revenue: 142, growth: 15.3, market: 8.2, color: '#10B981' },
  { company: 'Competitor A', revenue: 280, growth: 8.1, market: 16.4, color: '#64748b' },
  { company: 'Competitor B', revenue: 95, growth: 22.4, market: 5.5, color: '#64748b' },
  { company: 'Competitor C', revenue: 410, growth: 5.2, market: 24.0, color: '#64748b' },
];

const milestones = [
  { goal: 'Reach $2M ARR', progress: 71, deadline: 'Q2 2024', status: 'on-track' },
  { goal: 'Launch Enterprise Tier', progress: 45, deadline: 'Q1 2024', status: 'at-risk' },
  { goal: 'Series A Fundraising', progress: 20, deadline: 'Q3 2024', status: 'planning' },
  { goal: 'Expand to 3 New Markets', progress: 60, deadline: 'Q4 2024', status: 'on-track' },
];

export default function EntrepreneurOverview() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Business Valuation" value="$12.4M" change="+8.2% this quarter" positive={true} icon={Building2} gradient />
        <KPICard label="Monthly Revenue" value="$142K" change="+15.3% MoM" positive={true} icon={DollarSign} iconColor="text-emerald-400" />
        <KPICard label="Runway" value="18 months" change="+3 months" positive={true} icon={Target} iconColor="text-blue-400" />
        <KPICard label="Growth Rate" value="15.3% MoM" subtitle="Target: 20% MoM" icon={TrendingUp} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Revenue vs Expenses</h3>
              <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 text-xs">Profitable since Mar</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4,4,0,0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4,4,0,0]} fillOpacity={0.7} name="Expenses" />
                <Bar dataKey="profit" fill="#F59E0B" radius={[4,4,0,0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Competitive Intelligence</h3>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-500 hover:text-emerald-400 p-0" onClick={() => navigate('/dashboard/startups')}>Update Competitors</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/10">
                    {['Company', 'MRR ($K)', 'Growth', 'Market Share', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {competitorData.map((c, i) => (
                    <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${i === 0 ? 'font-semibold' : ''}`}>
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          {i === 0 && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                          <span className={`text-sm ${i === 0 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>{c.company}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-sm text-slate-600 dark:text-slate-300">{c.revenue}</td>
                      <td className="py-2.5 pr-4"><span className={`text-sm font-medium ${c.growth > 10 ? 'text-emerald-500' : 'text-slate-400'}`}>+{c.growth}%</span></td>
                      <td className="py-2.5 pr-4 text-sm text-slate-600 dark:text-slate-300">{c.market}%</td>
                      <td className="py-2.5 text-right">
                        {i === 0 ? <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0">You</Badge> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Business Milestones</h3>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-500 hover:text-emerald-400 p-0" onClick={() => navigate('/dashboard/startups')}>Manage</Button>
            </div>
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-slate-700 dark:text-white">{m.goal}</p>
                    <Badge className={`text-[10px] border-0 ${m.status === 'on-track' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : m.status === 'at-risk' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>{m.status}</Badge>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${m.status === 'on-track' ? 'bg-emerald-500' : m.status === 'at-risk' ? 'bg-red-500' : 'bg-slate-400'}`} style={{ width: `${m.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{m.progress}% complete</span><span>Due: {m.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">AI Business Insights</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {['Expand to SMB segment to unlock +$800K ARR potential', 'Reduce CAC by 18% by focusing on LinkedIn outreach', 'Series A readiness score: 72/100 — improve retention first'].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-white/5 rounded-lg">
                  <span className="text-amber-400 font-bold mt-0.5">{i+1}.</span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
