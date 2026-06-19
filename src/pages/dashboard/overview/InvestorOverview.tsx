import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Briefcase, DollarSign, TrendingUp, Zap, Brain, Activity } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import OpportunityCard from '@/components/features/OpportunityCard';
import { portfolioChartData, assetAllocationData, aiInsights, opportunities } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '@/context/DashboardContext';

const insightBg: Record<string, string> = { opportunity: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', risk: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30', action: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' };
const insightText: Record<string, string> = { opportunity: 'text-emerald-600 dark:text-emerald-400', risk: 'text-red-600 dark:text-red-400', action: 'text-amber-600 dark:text-amber-400', info: 'text-blue-600 dark:text-blue-400' };

export default function InvestorOverview() {
  const navigate = useNavigate();
  const { portfolioAssets, watchlist, toggleWatchlist } = useDashboard();

  const [timeframe, setTimeframe] = useState('1Y');

  // Dynamic calculations
  const totalValue = portfolioAssets.reduce((a, s) => a + s.value, 0);
  const totalGain = portfolioAssets.reduce((a, s) => a + s.gain, 0);
  const gainPct = totalValue > 0 ? ((totalGain / (totalValue - totalGain)) * 100).toFixed(1) : '0.0';
  const netWorth = 2847500 - 1245830 + totalValue;
  const sortedAssets = [...portfolioAssets].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Portfolio Value" value={`$${totalValue.toLocaleString()}`} change={`${totalGain >= 0 ? '+' : ''}$${totalGain.toLocaleString()} all time`} positive={totalGain >= 0} icon={Briefcase} gradient />
        <KPICard label="Net Worth" value={`$${netWorth.toLocaleString()}`} change={`${totalGain >= 0 ? '+' : ''}${gainPct}% vs baseline`} positive={totalGain >= 0} icon={DollarSign} iconColor="text-gold-400" />
        <KPICard label="Monthly Returns" value="$18,420" change="+21% vs last month" positive={true} icon={TrendingUp} iconColor="text-emerald-400" />
        <KPICard label="Opportunity Score" value="87 / 100" subtitle="High Conviction" icon={Zap} iconColor="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Portfolio Value</h3>
              <p className="text-xs text-slate-400 mt-1">Growth & income projection</p>
            </div>
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
              {['1M', '3M', '6M', '1Y', 'All'].map(t => (
                <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeframe === t ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={portfolioChartData}>
              <defs>
                <linearGradient id="inv1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fill="url(#inv1)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Asset Allocation</h3>
            <div className="flex items-center gap-4">
              <PieChart width={90} height={90}>
                <Pie data={assetAllocationData} cx={40} cy={40} innerRadius={24} outerRadius={40} paddingAngle={2} dataKey="value">
                  {assetAllocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="space-y-1.5 flex-1">
                {assetAllocationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Financial Health Score</h3>
              <span className="text-2xl font-bold text-emerald-500">84</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[84%] gradient-growth rounded-full" />
            </div>
            <p className="text-xs text-slate-400">Excellent — Top 12% of investors</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-slate-800 dark:text-white">AI Insights</h3>
            <Badge className="ml-auto bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-0 text-xs">4 New</Badge>
          </div>
          <div className="space-y-3">
            {aiInsights.map(insight => (
              <div key={insight.id} className={`p-3 rounded-lg border ${insightBg[insight.type]}`}>
                <p className={`text-xs font-semibold mb-1 ${insightText[insight.type]}`}>{insight.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{insight.description}</p>
                <p className="text-xs text-slate-400 mt-2">{insight.confidence}% confidence · {insight.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Top Holdings</h3>
            <Button variant="ghost" size="sm" className="text-xs text-emerald-500 h-auto p-0" onClick={() => navigate('/dashboard/portfolio')}>View All</Button>
          </div>
          <div className="space-y-3">
            {sortedAssets.slice(0, 5).map(asset => (
              <div key={asset.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{asset.symbol.slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{asset.symbol}</p>
                    <p className="text-xs text-slate-400">{asset.allocation}% of portfolio</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">${asset.currentPrice.toFixed(0)}</p>
                  <p className={`text-xs font-medium ${asset.gainPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {asset.gainPercent >= 0 ? '+' : ''}{asset.gainPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
            {sortedAssets.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No holdings yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {opportunities.slice(0, 2).map(opp => (
            <OpportunityCard 
              key={opp.id} 
              opportunity={opp} 
              compact 
              onAction={() => navigate('/dashboard/opportunities', { state: { openOppId: opp.id } })}
              onBookmark={() => toggleWatchlist(opp.title)}
              isBookmarked={watchlist?.includes(opp.title)}
            />
          ))}
          <Button className="w-full gradient-growth text-white border-0 text-sm" onClick={() => navigate('/dashboard/opportunities')}>
            Explore All Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
}
