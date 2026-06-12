import { useState } from 'react';
import { Compass, TrendingUp, Zap, Building2, Globe, Filter, Star, BookmarkPlus, ArrowRight, X, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { opportunities } from '@/lib/mockData';
import OpportunityCard from '@/components/features/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const trendingThemes = [
  { name: 'AI Infrastructure', change: '+65%', icon: Zap, color: 'from-purple-500 to-violet-600' },
  { name: 'India Markets', change: '+45%', icon: Globe, color: 'from-emerald-500 to-teal-600' },
  { name: 'Healthcare REITs', change: '+22%', icon: Building2, color: 'from-red-500 to-rose-600' },
  { name: 'Dividend Growth', change: '+18%', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
];

const types = ['All', 'Stock', 'Sector', 'Startup', 'Acquisition', 'Franchise'];
const risks = ['All Risks', 'Low', 'Medium', 'High'];

const simulatedChartData: Record<string, Array<{ month: string, target: number, baseline: number }>> = {
  '1': [
    { month: 'Jan', target: 160, baseline: 160 },
    { month: 'Feb', target: 172, baseline: 162 },
    { month: 'Mar', target: 168, baseline: 165 },
    { month: 'Apr', target: 185, baseline: 170 },
    { month: 'May', target: 210, baseline: 172 },
    { month: 'Jun', target: 235, baseline: 175 },
  ],
  'default': [
    { month: 'Jan', target: 100, baseline: 100 },
    { month: 'Feb', target: 105, baseline: 101 },
    { month: 'Mar', target: 112, baseline: 102 },
    { month: 'Apr', target: 125, baseline: 103 },
    { month: 'May', target: 140, baseline: 105 },
    { month: 'Jun', target: 165, baseline: 108 },
  ]
};

export default function OpportunityDiscovery() {
  const navigate = useNavigate();
  const [type, setType] = useState('All');
  const [risk, setRisk] = useState('All Risks');
  const [query, setQuery] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<typeof opportunities[0] | null>(null);

  const [localWatchlist, setLocalWatchlist] = useState<string[]>(() => {
    const stored = localStorage.getItem('vu_watchlist');
    return stored ? JSON.parse(stored) : ['AAPL', 'NVDA'];
  });

  const filtered = opportunities.filter(o => {
    const typeMatch = type === 'All' || o.type.toLowerCase() === type.toLowerCase();
    const riskMatch = risk === 'All Risks' || o.risk.toLowerCase() === risk.toLowerCase();
    const queryMatch = !query || o.title.toLowerCase().includes(query.toLowerCase());
    return typeMatch && riskMatch && queryMatch;
  });

  const handleWatchlistToggle = (oppTitle: string) => {
    const user = getStoredUser();
    if (!user) {
      toast.info('Please sign in to manage your watchlist.');
      navigate('/login');
      return;
    }

    const stored = localStorage.getItem('vu_watchlist');
    let wl = stored ? JSON.parse(stored) : ['AAPL', 'NVDA'];
    const cleanTitle = oppTitle.toUpperCase();

    if (wl.includes(cleanTitle)) {
      wl = wl.filter((s: string) => s !== cleanTitle);
      toast.success(`Removed ${oppTitle} from watchlist.`);
    } else {
      wl.push(cleanTitle);
      toast.success(`Added ${oppTitle} to watchlist.`);
    }
    localStorage.setItem('vu_watchlist', JSON.stringify(wl));
    setLocalWatchlist(wl);
  };

  const handleBuyFromOpportunity = (opp: typeof opportunities[0]) => {
    const user = getStoredUser();
    if (!user) {
      toast.info('Please sign in to buy positions.');
      navigate('/login');
      return;
    }

    // Determine ticker
    let ticker = opp.title.split(' ')[0].toUpperCase();
    if (ticker.length > 5 || ticker.includes('AI') || ticker.includes('CLEANTECH')) {
      ticker = 'OPP';
    }
    const price = opp.risk === 'low' ? 45 : opp.risk === 'medium' ? 120 : 250;
    const qtyStr = window.prompt(`Enter quantity of ${ticker} to buy at $${price} per share:`, "10");
    if (qtyStr === null) return;
    const qty = parseInt(qtyStr);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Invalid quantity entered.');
      return;
    }

    // Add position directly to localStorage
    const stored = localStorage.getItem('vu_portfolio_assets');
    const portfolioAssets = stored ? JSON.parse(stored) : [];
    
    const currentPrice = price * (1 + (Math.random() * 0.2 - 0.05));
    const value = qty * currentPrice;
    const gain = (currentPrice - price) * qty;
    const gainPercent = ((currentPrice - price) / price) * 100;

    const existingIndex = portfolioAssets.findIndex((a: any) => a.symbol.toUpperCase() === ticker.toUpperCase());
    let newAssets = [...portfolioAssets];

    if (existingIndex > -1) {
      const existing = portfolioAssets[existingIndex];
      const newQty = existing.quantity + qty;
      const newAvgPrice = ((existing.quantity * existing.avgPrice) + (qty * price)) / newQty;
      const newValue = newQty * currentPrice;
      const newGain = (currentPrice - newAvgPrice) * newQty;
      const newGainPercent = ((currentPrice - newAvgPrice) / newAvgPrice) * 100;

      newAssets[existingIndex] = {
        ...existing,
        quantity: newQty,
        avgPrice: parseFloat(newAvgPrice.toFixed(2)),
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        value: parseFloat(newValue.toFixed(0)),
        gain: parseFloat(newGain.toFixed(0)),
        gainPercent: parseFloat(newGainPercent.toFixed(1)),
      };
    } else {
      newAssets.push({
        id: Date.now().toString(),
        symbol: ticker,
        name: opp.title,
        type: opp.type === 'startup' ? 'startup' : 'stock',
        quantity: qty,
        avgPrice: price,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        value: parseFloat(value.toFixed(0)),
        gain: parseFloat(gain.toFixed(0)),
        gainPercent: parseFloat(gainPercent.toFixed(1)),
        allocation: 0
      });
    }

    const totalVal = newAssets.reduce((acc: number, a: any) => acc + a.value, 0);
    newAssets = newAssets.map((a: any) => ({
      ...a,
      allocation: totalVal > 0 ? parseFloat(((a.value / totalVal) * 100).toFixed(1)) : 0
    }));

    localStorage.setItem('vu_portfolio_assets', JSON.stringify(newAssets));
    toast.success(`${ticker} successfully added to your portfolio!`);
    setSelectedOpp(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">Opportunity Discovery</span>
          <h1 className="text-4xl font-bold text-white mb-4">Find <span className="text-emerald-400">Hidden Value</span> Before the Market</h1>
          <p className="text-slate-300 text-lg mb-8">Our AI screens 50,000+ assets daily to surface undervalued opportunities, emerging sectors, and high-conviction investment ideas.</p>
          <div className="relative max-w-xl mx-auto">
            <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-base" placeholder="Search opportunities..." />
          </div>
        </div>
      </section>

      {/* Trending Themes */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-5">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Trending Themes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingThemes.map((theme, i) => {
              const Icon = theme.icon;
              return (
                <div key={i} className={`bg-gradient-to-br ${theme.color} rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform`} onClick={() => { setType('Sector'); toast.info(`Filtering by ${theme.name}`); }}>
                  <Icon className="w-6 h-6 text-white mb-3" />
                  <p className="text-white font-bold text-sm">{theme.name}</p>
                  <p className="text-white/80 text-xs mt-1">Potential: {theme.change}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onAction={() => setSelectedOpp(opp)}
                onBookmark={() => handleWatchlistToggle(opp.title)}
                isBookmarked={localWatchlist.includes(opp.title.toUpperCase())}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No opportunities match your filters.</p>
            </div>
          )}

          <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">Unlock Full AI Opportunity Discovery</h3>
            <p className="text-slate-300 text-sm mb-5">Get access to 500+ opportunities, real-time AI scoring, and portfolio integration.</p>
            <Link to="/register"><Button className="gradient-growth text-white border-0 gap-2">Start Free Trial <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* AI Opportunity Analysis Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedOpp(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-2xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative my-8 text-left" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> AI Valuation Intelligence
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{selectedOpp.title}</h2>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md">Rating Score: {selectedOpp.score}/100</span>
                  <span className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md capitalize">Risk: {selectedOpp.risk}</span>
                  <span className="text-xs px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-medium">Upside: {selectedOpp.upside}</span>
                </div>
              </div>
              <button onClick={() => setSelectedOpp(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Thesis & Points */}
              <div className="md:col-span-3 space-y-4 text-sm leading-relaxed">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-1">Opportunity Description</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{selectedOpp.description}</p>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Core AI Investment Thesis
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <li>• Undervalued relative to industry peers with strong growth drivers.</li>
                    <li>• Institutional accumulation observed over the last 60 days (+4.2%).</li>
                    <li>• Multi-year macro tailwinds are driving increased demand.</li>
                  </ul>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5">
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Risk Watchpoints
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <li>• Short-term volatility remains elevated due to inflation concerns.</li>
                    <li>• Regulatory constraints in this segment could delay monetization.</li>
                  </ul>
                </div>
              </div>

              {/* Chart Target Visual */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-center">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2">Simulated Target Return</h4>
                  <div className="h-[140px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simulatedChartData[selectedOpp.id] || simulatedChartData['default']}>
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} />
                        <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} fill="rgba(16,185,129,0.1)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">6-Month AI Projected Yield</p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full gradient-growth text-white border-0 text-xs" onClick={() => handleBuyFromOpportunity(selectedOpp)}>
                    Buy / Invest Position
                  </Button>
                  <Button variant="outline" className="w-full text-xs" onClick={() => { handleWatchlistToggle(selectedOpp.title); setSelectedOpp(null); }}>
                    {localWatchlist.includes(selectedOpp.title.toUpperCase()) ? 'Remove Watchlist' : 'Add Watchlist'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
