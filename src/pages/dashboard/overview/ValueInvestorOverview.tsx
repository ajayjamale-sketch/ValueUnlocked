import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Search, Filter, TrendingDown, Shield, BookOpen, Target, BarChart3, Layers } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { valuePortfolioAssets } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const screenedStocks = [
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', pe: 8.2, pb: 1.3, roe: 18.4, score: 94, moat: 'Wide', margin: 12.1, upside: '+28%' },
  { symbol: 'KO', name: 'Coca-Cola', pe: 22.1, pb: 9.8, roe: 42.1, score: 89, moat: 'Wide', margin: 23.4, upside: '+18%' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', pe: 14.8, pb: 4.2, roe: 28.7, score: 86, moat: 'Wide', margin: 19.8, upside: '+22%' },
  { symbol: 'WMT', name: 'Walmart', pe: 28.4, pb: 6.1, roe: 14.2, score: 81, moat: 'Narrow', margin: 3.1, upside: '+14%' },
  { symbol: 'LOW', name: "Lowe's Companies", pe: 16.9, pb: 150.2, roe: 88.4, score: 78, moat: 'Narrow', margin: 9.2, upside: '+32%' },
];

const radarData = [
  { subject: 'Valuation', A: 88, fullMark: 100 },
  { subject: 'Quality', A: 92, fullMark: 100 },
  { subject: 'Growth', A: 67, fullMark: 100 },
  { subject: 'Moat', A: 95, fullMark: 100 },
  { subject: 'Mgmt', A: 84, fullMark: 100 },
  { subject: 'Balance Sheet', A: 91, fullMark: 100 },
];

export default function ValueInvestorOverview() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const filtered = screenedStocks.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Portfolio Value" value="$3,100,000" change="+$42,800 today" positive={true} icon={Layers} gradient />
        <KPICard label="Avg P/E Ratio" value="14.2x" subtitle="vs Market 22.4x" icon={BarChart3} iconColor="text-blue-400" />
        <KPICard label="Margin of Safety" value="32%" subtitle="Average across holdings" icon={Shield} iconColor="text-emerald-400" />
        <KPICard label="Stocks Screened" value="1,240" subtitle="This month" icon={Search} iconColor="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Value Screener</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-9 h-8 text-xs w-48" placeholder="Search stocks..." />
              </div>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1"><Filter className="w-3 h-3" />Filter</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/10">
                  {['Symbol', 'P/E', 'P/B', 'ROE', 'Upside', 'Moat', 'Score'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">{h}</th>
                  ))}
                  <th className="text-right text-xs font-medium text-slate-400 pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(s => (
                  <tr key={s.symbol} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.symbol}</p>
                        <p className="text-xs text-slate-400">{s.name}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 text-xs">{s.pe}x</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 text-xs">{s.pb}x</td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300 text-xs">{s.roe}%</td>
                    <td className="py-3 pr-4">
                      <span className="text-emerald-500 font-semibold text-xs">{s.upside}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge className={`text-[10px] border-0 ${s.moat === 'Wide' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{s.moat}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full w-12">
                          <div className="h-full gradient-growth rounded-full" style={{ width: `${s.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-emerald-500">{s.score}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-500 hover:text-emerald-400" onClick={() => navigate(`/dashboard/research?symbol=${s.symbol}`)}>Analyze</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 text-sm">Portfolio Quality Score</h3>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Portfolio" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Top Value Picks Today</h3>
            <div className="space-y-2">
              {[
                { symbol: 'KO', reason: 'Trading 18% below 10yr avg P/E' },
                { symbol: 'JNJ', reason: 'Spin-off discount presents opportunity' },
                { symbol: 'WMT', reason: 'Market share gains accelerating' },
              ].map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" onClick={() => navigate(`/dashboard/research?symbol=${p.symbol}`)}>
                  <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 text-[10px] font-bold">{p.symbol.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-white">{p.symbol}</p>
                    <p className="text-[11px] text-slate-400">{p.reason}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-3 gradient-growth text-white border-0 text-xs h-8" onClick={() => navigate('/dashboard/research')}>
              Open Full Screener
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
