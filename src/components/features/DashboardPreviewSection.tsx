import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { portfolioChartData, assetAllocationData, aiInsights } from '@/lib/mockData';
import { Brain, TrendingUp, AlertTriangle, Info } from 'lucide-react';

const insightIcons = { opportunity: TrendingUp, risk: AlertTriangle, action: Brain, info: Info };
const insightColors = { opportunity: 'text-emerald-400', risk: 'text-red-400', action: 'text-gold-400', info: 'text-blue-400' };

export default function DashboardPreviewSection() {
  return (
    <section className="py-24 bg-navy overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-400 text-sm font-semibold uppercase tracking-wider mb-3">Platform Preview</span>
          <h2 className="text-4xl font-bold text-white mb-4">
            An Executive-Grade <span className="text-gradient-emerald">Wealth Dashboard</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-time portfolio intelligence, AI insights, and wealth analytics — all in one command center.
          </p>
        </div>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Portfolio Chart */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Portfolio Performance vs Benchmark</p>
                  <p className="text-white text-2xl font-bold mt-1">$1,245,830</p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <span className="text-emerald-400 text-sm font-semibold">+24.7% YTD</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={portfolioChartData}>
                  <defs>
                    <linearGradient id="portfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="benchmark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="benchmark" stroke="#F59E0B" strokeWidth={1.5} fill="url(#benchmark)" strokeDasharray="4 4" dot={false} />
                  <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#portfolio)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-3">
                {[{l:'Sharpe Ratio',v:'1.84'},{l:'Max Drawdown',v:'-8.2%'},{l:'Beta',v:'0.76'}].map((m,i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white font-bold">{m.v}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">Asset Allocation</p>
                <div className="flex items-center gap-4">
                  <PieChart width={100} height={100}>
                    <Pie data={assetAllocationData} cx={45} cy={45} innerRadius={28} outerRadius={44} paddingAngle={2} dataKey="value">
                      {assetAllocationData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="space-y-1.5">
                    {assetAllocationData.slice(0,4).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} />
                        <span className="text-xs text-slate-300">{item.name}</span>
                        <span className="text-xs font-medium text-white ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">AI Insights</p>
                <div className="space-y-2">
                  {aiInsights.slice(0,3).map(insight => {
                    const Icon = insightIcons[insight.type];
                    return (
                      <div key={insight.id} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="flex items-start gap-2">
                          <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${insightColors[insight.type]}`} />
                          <div>
                            <p className="text-white text-xs font-medium leading-tight">{insight.title}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{insight.confidence}% confidence</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
