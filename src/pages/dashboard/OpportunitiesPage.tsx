import { useState, useEffect } from 'react';
import { Compass, Filter, TrendingUp, Zap, X, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OpportunityCard from '@/components/features/OpportunityCard';
import { opportunities } from '@/lib/mockData';
import { toast } from 'sonner';
import { useDashboard } from '@/context/DashboardContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const types = ['All', 'Stock', 'Sector', 'Startup', 'Acquisition', 'Franchise'];
const risks = ['All Risks', 'Low', 'Medium', 'High'];

// Simulated price targets for the opportunities
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

export default function OpportunitiesPage() {
  const { watchlist, toggleWatchlist, addPosition } = useDashboard();
  const location = useLocation();
  const [type, setType] = useState('All');
  const [risk, setRisk] = useState('All Risks');
  const [selectedOpp, setSelectedOpp] = useState<typeof opportunities[0] | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [buyQty, setBuyQty] = useState('10');
  const [buyPrice, setBuyPrice] = useState(0);
  const [buyTicker, setBuyTicker] = useState('OPP');

  useEffect(() => {
    if (location.state?.openOppId) {
      const opp = opportunities.find(o => o.id === location.state.openOppId);
      if (opp) {
        setSelectedOpp(opp);
        setIsBuying(false);
      }
      // Clear location state to prevent reopening on reload
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleOpenOpp = (opp: typeof opportunities[0]) => {
    setSelectedOpp(opp);
    setIsBuying(false);
  };

  const filtered = opportunities.filter(o => {
    const typeMatch = type === 'All' || o.type.toLowerCase() === type.toLowerCase();
    const riskMatch = risk === 'All Risks' || o.risk.toLowerCase() === risk.toLowerCase();
    return typeMatch && riskMatch;
  });

  const handleBuyClick = (opp: typeof opportunities[0]) => {
    let ticker = opp.title.split(' ')[0].toUpperCase();
    if (ticker.length > 5 || ticker.includes('AI') || ticker.includes('CLEANTECH')) {
      ticker = 'OPP';
    }
    const price = opp.risk === 'low' ? 45 : opp.risk === 'medium' ? 120 : 250;
    setBuyTicker(ticker);
    setBuyPrice(price);
    setBuyQty('10');
    setIsBuying(true);
  };

  const confirmBuy = () => {
    if (!selectedOpp) return;
    const qty = parseInt(buyQty);
    if (isNaN(qty) || qty <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }
    addPosition(buyTicker, selectedOpp.title, selectedOpp.type === 'startup' ? 'startup' : 'stock', qty, buyPrice);
    setIsBuying(false);
    setSelectedOpp(null);
  };

  const chartData = selectedOpp ? (simulatedChartData[selectedOpp.id] || simulatedChartData['default']) : [];

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
        {filtered.map(opp => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onAction={() => handleOpenOpp(opp)}
            onBookmark={() => toggleWatchlist(opp.title)}
            isBookmarked={watchlist.includes(opp.title)}
          />
        ))}
      </div>

      {/* AI Opportunity Analysis Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto pt-24 pb-8" onClick={() => setSelectedOpp(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-2xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative my-8" onClick={e => e.stopPropagation()}>
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
                      <AreaChart data={chartData}>
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
                  {isBuying ? (
                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-left space-y-3">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm Purchase</p>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-450 font-medium">Quantity</label>
                        <Input 
                          type="number" 
                          min={1} 
                          value={buyQty} 
                          onChange={e => setBuyQty(e.target.value)} 
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
                        <span>Total Price:</span>
                        <span>${(parseInt(buyQty || '0') * buyPrice).toLocaleString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 gradient-growth text-white border-0 text-[10px] h-7"
                          onClick={confirmBuy}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-[10px] h-7"
                          onClick={() => setIsBuying(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full gradient-growth text-white border-0 text-xs" onClick={() => handleBuyClick(selectedOpp)}>
                      Buy / Invest Position
                    </Button>
                  )}
                  <Button variant="outline" className="w-full text-xs" onClick={() => { toggleWatchlist(selectedOpp.title); setSelectedOpp(null); }}>
                    {watchlist.includes(selectedOpp.title) ? 'Remove Watchlist' : 'Add Watchlist'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">No opportunities match your filters</p>
        </div>
      )}
    </div>
  );
}
