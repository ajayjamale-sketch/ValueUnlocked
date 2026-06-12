import { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown, BarChart2, Filter, Eye, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', price: 189.50, change: 1.24, pE: 31.2, eps: 6.08, roe: 145.0, score: 88, rating: 'Buy', mktCap: '$2.9T', revenue: '$394B', dividend: '0.5%' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', price: 378.90, change: 0.87, pE: 35.8, eps: 10.58, roe: 38.2, score: 92, rating: 'Strong Buy', mktCap: '$2.8T', revenue: '$211B', dividend: '0.7%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication', price: 156.20, change: -0.42, pE: 26.3, eps: 5.94, roe: 24.6, score: 85, rating: 'Buy', mktCap: '$1.9T', revenue: '$307B', dividend: '—' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', price: 185.70, change: 2.15, pE: 62.1, eps: 2.99, roe: 21.8, score: 79, rating: 'Hold', mktCap: '$1.9T', revenue: '$574B', dividend: '—' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', price: 875.50, change: 3.82, pE: 65.4, eps: 13.39, roe: 91.5, score: 94, rating: 'Strong Buy', mktCap: '$2.1T', revenue: '$60B', dividend: '0.03%' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financials', price: 358.40, change: 0.21, pE: 21.8, eps: 16.44, roe: 14.2, score: 82, rating: 'Buy', mktCap: '$781B', revenue: '$364B', dividend: '—' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', price: 158.90, change: -0.31, pE: 14.8, eps: 10.74, roe: 28.7, score: 80, rating: 'Buy', mktCap: '$383B', revenue: '$85B', dividend: '3.0%' },
  { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples', price: 61.20, change: 0.44, pE: 22.1, eps: 2.77, roe: 42.1, score: 77, rating: 'Hold', mktCap: '$264B', revenue: '$45B', dividend: '3.1%' },
];

const ratingColors: Record<string, string> = {
  'Strong Buy': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'Buy': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'Hold': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  'Sell': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

export default function ResearchPage() {
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'NVDA']);
  const [selectedStock, setSelectedStock] = useState<typeof stocks[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'screener' | 'watchlist'>('screener');
  const [sortKey, setSortKey] = useState<'score' | 'change' | 'pE'>('score');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filterSector, setFilterSector] = useState('All');
  const [filterRating, setFilterRating] = useState('All');
  const [filterMinScore, setFilterMinScore] = useState(0);

  // Screener state
  const [runningScreener, setRunningScreener] = useState(false);
  const [screenerActive, setScreenerActive] = useState(false);

  const filtered = stocks
    .filter(s => {
      const matchesQuery = s.symbol.includes(query.toUpperCase()) || s.name.toLowerCase().includes(query.toLowerCase());
      const matchesSector = filterSector === 'All' || s.sector === filterSector;
      const matchesRating = filterRating === 'All' || s.rating === filterRating;
      const matchesMinScore = s.score >= filterMinScore;
      const matchesScreener = !screenerActive || (s.score >= 85 && (s.rating === 'Strong Buy' || s.rating === 'Buy'));
      return matchesQuery && matchesSector && matchesRating && matchesMinScore && matchesScreener;
    })
    .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);

  const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol));

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
    toast.success(watchlist.includes(symbol) ? `Removed ${symbol} from watchlist` : `Added ${symbol} to watchlist`);
  };

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const runAIScreener = () => {
    setRunningScreener(true);
    setTimeout(() => {
      setScreenerActive(true);
      setRunningScreener(false);
      toast.success('AI Screener complete: filtered for high-conviction buy opportunities!');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Detail Modal */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedStock(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedStock.symbol}</h2>
                <p className="text-slate-400 text-sm">{selectedStock.name} · {selectedStock.sector}</p>
              </div>
              <button onClick={() => setSelectedStock(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Price', value: `$${selectedStock.price}` },
                { label: '1D Change', value: `${selectedStock.change >= 0 ? '+' : ''}${selectedStock.change}%`, color: selectedStock.change >= 0 ? 'text-emerald-500' : 'text-red-500' },
                { label: 'AI Score', value: `${selectedStock.score}/100`, color: 'text-emerald-500' },
                { label: 'P/E Ratio', value: `${selectedStock.pE}x` },
                { label: 'EPS', value: `$${selectedStock.eps}` },
                { label: 'ROE', value: `${selectedStock.roe}%` },
                { label: 'Market Cap', value: selectedStock.mktCap },
                { label: 'Revenue', value: selectedStock.revenue },
                { label: 'Dividend', value: selectedStock.dividend },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${(item as any).color || 'text-slate-800 dark:text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">AI Rating</p>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${ratingColors[selectedStock.rating]}`}>{selectedStock.rating}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-white/10 rounded-full">
                  <div className="h-full gradient-growth rounded-full" style={{ width: `${selectedStock.score}%` }} />
                </div>
                <span className="text-sm font-bold text-emerald-500">{selectedStock.score}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 gradient-growth text-white border-0" onClick={() => { toast.success(`${selectedStock.symbol} added to portfolio`); setSelectedStock(null); }}>
                Add to Portfolio
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { toggleWatchlist(selectedStock.symbol); setSelectedStock(null); }}>
                {watchlist.includes(selectedStock.symbol) ? 'Remove Watchlist' : 'Add Watchlist'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Search stocks, ETFs, companies..." />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className={`gap-2 flex-1 sm:flex-none ${showFilters ? 'bg-slate-100 dark:bg-white/15' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-4 h-4" /> Filters
          </Button>
          <Button className="gradient-growth text-white border-0 flex-1 sm:flex-none flex items-center justify-center gap-1.5" onClick={runAIScreener} disabled={runningScreener}>
            {runningScreener ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : 'Run Screener'}
          </Button>
          {screenerActive && (
            <Button variant="ghost" className="h-10 text-xs text-purple-400 gap-1 hover:text-purple-300" onClick={() => setScreenerActive(false)}>
              Reset Screener <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Sector</label>
            <select
              value={filterSector}
              onChange={e => setFilterSector(e.target.value)}
              className="w-full text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300"
            >
              {['All', 'Technology', 'Communication', 'Consumer', 'Financials', 'Healthcare', 'Consumer Staples'].map(sec => (
                <option key={sec}>{sec}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Analyst Rating</label>
            <select
              value={filterRating}
              onChange={e => setFilterRating(e.target.value)}
              className="w-full text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300"
            >
              {['All', 'Strong Buy', 'Buy', 'Hold'].map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Minimum AI Score: {filterMinScore}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterMinScore}
              onChange={e => setFilterMinScore(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
          <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
            <Button size="sm" variant="ghost" className="text-xs text-slate-400 h-7" onClick={() => {
              setFilterSector('All');
              setFilterRating('All');
              setFilterMinScore(0);
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {(['screener', 'watchlist'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab} {tab === 'watchlist' && <span className="ml-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-full">{watchlist.length}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Watchlist Items', value: watchlist.length.toString(), sub: 'Actively monitored' },
          { label: 'Avg. Score', value: (stocks.reduce((a, s) => a + s.score, 0) / stocks.length).toFixed(1), sub: 'Portfolio conviction' },
          { label: 'Buy Signals', value: stocks.filter(s => s.rating === 'Strong Buy' || s.rating === 'Buy').length.toString(), sub: 'This week' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
            <BarChart2 className="w-8 h-8 text-emerald-400 opacity-50" />
          </div>
        ))}
      </div>

      {activeTab === 'screener' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white">Stock Screener Results</h3>
            <span className="text-xs text-slate-400">{filtered.length} results · Click row to analyze</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  {[
                    { label: 'Ticker', key: null },
                    { label: 'Company', key: null },
                    { label: 'Sector', key: null },
                    { label: 'Price', key: null },
                    { label: '1D Chg', key: 'change' },
                    { label: 'P/E', key: 'pE' },
                    { label: 'EPS', key: null },
                    { label: 'ROE', key: null },
                    { label: 'AI Score', key: 'score' },
                    { label: 'Rating', key: null },
                    { label: '', key: null },
                  ].map((h, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap ${h.key ? 'cursor-pointer hover:text-emerald-500 select-none' : ''}`}
                      onClick={() => h.key && handleSort(h.key as typeof sortKey)}>
                      <span className="flex items-center gap-1">
                        {h.label}
                        {h.key && sortKey === h.key && (sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(s => (
                  <tr key={s.symbol} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedStock(s)}>
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.symbol.slice(0,2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.symbol}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[120px]">{s.name}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{s.sector}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white">${s.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {s.change >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                        <span className={`text-xs font-medium ${s.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{s.pE}x</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">${s.eps}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{s.roe}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${s.score >= 90 ? 'text-emerald-500' : s.score >= 80 ? 'text-blue-500' : 'text-amber-500'}`}>{s.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ratingColors[s.rating]}`}>{s.rating}</span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleWatchlist(s.symbol)}
                        className={`p-1.5 rounded-lg transition-colors ${watchlist.includes(s.symbol) ? 'text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300 hover:text-amber-400'}`}
                        title={watchlist.includes(s.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}
                      >
                        <Star className="w-4 h-4" fill={watchlist.includes(s.symbol) ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-white/10">
            <h3 className="font-semibold text-slate-800 dark:text-white">My Watchlist ({watchlist.length})</h3>
          </div>
          {watchlistStocks.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No stocks in your watchlist yet.</p>
              <p className="text-slate-400 text-xs mt-1">Click the star icon on any stock to add it.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {watchlistStocks.map(s => (
                <div key={s.symbol} className="flex flex-col sm:flex-row justify-between sm:items-center px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.symbol.slice(0,2)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.symbol}</p>
                      <p className="text-xs text-slate-400">{s.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between sm:justify-end flex-1 w-full sm:w-auto">
                    <div className="text-right">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">${s.price}</p>
                      <p className={`text-xs font-medium ${s.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{s.change >= 0 ? '+' : ''}{s.change}%</p>
                    </div>
                    <Badge className={`text-[10px] border-0 ${ratingColors[s.rating]}`}>{s.rating}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelectedStock(s)}><Eye className="w-3 h-3 mr-1" />Analyze</Button>
                      <button onClick={() => toggleWatchlist(s.symbol)} className="p-1.5 rounded-lg text-amber-400 hover:text-slate-400 transition-colors">
                        <Star className="w-4 h-4" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
