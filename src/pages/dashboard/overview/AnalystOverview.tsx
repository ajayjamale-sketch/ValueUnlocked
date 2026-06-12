import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, Eye, DollarSign, TrendingUp, Star, Plus, Download, Users } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { analystReports } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const revenueChart = [
  { month: 'Aug', revenue: 2400 }, { month: 'Sep', revenue: 3800 }, { month: 'Oct', revenue: 5200 },
  { month: 'Nov', revenue: 8900 }, { month: 'Dec', revenue: 12400 }, { month: 'Jan', revenue: 17800 },
];

const viewsChart = [
  { month: 'Aug', views: 420 }, { month: 'Sep', views: 890 }, { month: 'Oct', views: 1240 },
  { month: 'Nov', views: 2180 }, { month: 'Dec', views: 3640 }, { month: 'Jan', views: 4820 },
];

const topReaders = [
  { type: 'Individual Investors', percent: 48, color: '#10B981' },
  { type: 'Family Offices', percent: 22, color: '#F59E0B' },
  { type: 'Hedge Funds', percent: 18, color: '#3B82F6' },
  { type: 'Retail Traders', percent: 12, color: '#8B5CF6' },
];

export default function AnalystOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Revenue" value="$17,800" change="+43% this month" positive={true} icon={DollarSign} gradient />
        <KPICard label="Total Views" value="4,820" change="+32% this month" positive={true} icon={Eye} iconColor="text-blue-400" />
        <KPICard label="Reports Published" value="12" subtitle="3 drafts pending" icon={FileText} iconColor="text-emerald-400" />
        <KPICard label="Avg Rating" value="4.85 / 5" subtitle="From 289 reviews" icon={Star} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-white">My Research Reports</h3>
              <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs gap-1" onClick={() => toast.success('New report editor opened')}>
                <Plus className="w-3 h-3" /> New Report
              </Button>
            </div>
            <div className="space-y-3">
              {analystReports.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`text-[10px] border-0 ${r.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{r.status}</Badge>
                      <span className="text-xs text-slate-400">{r.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{r.title}</p>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{r.views.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-500">${r.revenue.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Revenue</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-400" onClick={() => toast.info('Editing report...')}><FileText className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-400" onClick={() => toast.info('Downloading report...')}><Download className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Revenue Growth</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={revenueChart}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(1)}K`} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="revenue" fill="#10B981" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Views Growth</h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={viewsChart}>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Reader Breakdown</h3>
            </div>
            <div className="space-y-3">
              {topReaders.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{r.type}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{r.percent}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.percent}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Analyst Profile</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Follower Count', value: '2,840' },
                { label: 'Track Record', value: '73.2% accuracy' },
                { label: 'Specialization', value: 'Asian Markets, Tech' },
                { label: 'Certifications', value: 'CFA Level III' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.value}</span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-3 gradient-growth text-white border-0 text-xs h-8" onClick={() => toast.info('Opening public profile...')}>View Public Profile</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
