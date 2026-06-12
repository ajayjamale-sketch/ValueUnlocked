import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Plus, RefreshCw, Download, Filter, X, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { portfolioAssets as initialAssets, portfolioChartData, assetAllocationData } from '@/lib/mockData';
import KPICard from '@/components/features/KPICard';
import { Briefcase, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { PortfolioAsset } from '@/types';

const monthlyData = [
  { month: 'Aug', return: 2.1 }, { month: 'Sep', return: 3.4 }, { month: 'Oct', return: -1.2 },
  { month: 'Nov', return: 4.1 }, { month: 'Dec', return: 2.8 }, { month: 'Jan', return: 3.7 },
];

export default function PortfolioPage() {
  const [assets, setAssets] = useState<PortfolioAsset[]>(initialAssets);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'holdings' | 'performance' | 'allocation'>('holdings');
  const [newPos, setNewPos] = useState({ symbol: '', name: '', type: 'stock', quantity: '', avgPrice: '' });
  const [showRebalance, setShowRebalance] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);

  const totalValue = assets.reduce((a, s) => a + s.value, 0);
  const totalGain = assets.reduce((a, s) => a + s.gain, 0);
  const gainPct = ((totalGain / (totalValue - totalGain)) * 100).toFixed(1);

  const addPosition = () => {
    if (!newPos.symbol || !newPos.quantity || !newPos.avgPrice) return toast.error('Please fill in all fields');
    const qty = parseInt(newPos.quantity);
    const avgPrice = parseFloat(newPos.avgPrice);
    const currentPrice = avgPrice * (1 + (Math.random() * 0.4 - 0.1)); // simulate price movement
    const value = qty * currentPrice;
    const gain = (currentPrice - avgPrice) * qty;
    const gainPercent = ((currentPrice - avgPrice) / avgPrice) * 100;
    const totalNewValue = totalValue + value;
    const newAsset: PortfolioAsset = {
      id: Date.now().toString(),
      symbol: newPos.symbol.toUpperCase(),
      name: newPos.name || newPos.symbol.toUpperCase(),
      type: newPos.type as any,
      quantity: qty,
      avgPrice,
      currentPrice: parseFloat(currentPrice.toFixed(2)),
      value: parseFloat(value.toFixed(0)),
      gain: parseFloat(gain.toFixed(0)),
      gainPercent: parseFloat(gainPercent.toFixed(1)),
      allocation: parseFloat(((value / totalNewValue) * 100).toFixed(1)),
    };
    // recalculate allocations
    setAssets(prev => [...prev.map(a => ({ ...a, allocation: parseFloat(((a.value / totalNewValue) * 100).toFixed(1)) })), newAsset]);
    setNewPos({ symbol: '', name: '', type: 'stock', quantity: '', avgPrice: '' });
    setShowAdd(false);
    toast.success(`${newAsset.symbol} added to portfolio`);
  };

  const removePosition = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    toast.success('Position removed from portfolio');
  };

  const exportToCSV = () => {
    const headers = ['Symbol', 'Name', 'Type', 'Quantity', 'Avg Price', 'Current Price', 'Market Value', 'Gain/Loss', 'Allocation (%)'];
    const rows = assets.map(a => [
      a.symbol,
      `"${a.name.replace(/"/g, '""')}"`,
      a.type,
      a.quantity,
      a.avgPrice.toFixed(2),
      a.currentPrice.toFixed(2),
      a.value,
      a.gain,
      a.allocation
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio_holdings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Portfolio exported as CSV successfully!');
  };

  const executeRebalance = () => {
    setRebalancing(true);
    setTimeout(() => {
      setAssets(prev => {
        let trimmedNVDA = false;
        let trimmedAAPL = false;
        
        let newAssets = prev.map(a => {
          if (a.symbol === 'NVDA') {
            trimmedNVDA = true;
            const newQty = Math.max(1, Math.round(a.quantity * 0.8)); // trim by ~20%
            const newValue = newQty * a.currentPrice;
            const newGain = (a.currentPrice - a.avgPrice) * newQty;
            return {
              ...a,
              quantity: newQty,
              value: parseFloat(newValue.toFixed(0)),
              gain: parseFloat(newGain.toFixed(0)),
            };
          }
          if (a.symbol === 'AAPL') {
            trimmedAAPL = true;
            const newQty = Math.max(1, Math.round(a.quantity * 0.9)); // trim by ~10%
            const newValue = newQty * a.currentPrice;
            const newGain = (a.currentPrice - a.avgPrice) * newQty;
            return {
              ...a,
              quantity: newQty,
              value: parseFloat(newValue.toFixed(0)),
              gain: parseFloat(newGain.toFixed(0)),
            };
          }
          return a;
        });

        const xlvPrice = 140.00;
        const xlvInvested = 7000;
        const xlvQty = Math.round(xlvInvested / xlvPrice);
        const existingXLV = newAssets.find(a => a.symbol === 'XLV');
        
        if (existingXLV) {
          const newQty = existingXLV.quantity + xlvQty;
          const newValue = newQty * existingXLV.currentPrice;
          const newGain = (existingXLV.currentPrice - existingXLV.avgPrice) * newQty;
          newAssets = newAssets.map(a => a.symbol === 'XLV' ? {
            ...a,
            quantity: newQty,
            value: parseFloat(newValue.toFixed(0)),
            gain: parseFloat(newGain.toFixed(0)),
          } : a);
        } else {
          newAssets.push({
            id: 'xlv-rebalance',
            symbol: 'XLV',
            name: 'Healthcare Select Sector SPDR',
            type: 'etf',
            quantity: xlvQty,
            avgPrice: xlvPrice,
            currentPrice: xlvPrice,
            value: xlvInvested,
            gain: 0,
            gainPercent: 0,
            allocation: 0,
          });
        }
        
        const totalNewValue = newAssets.reduce((a, s) => a + s.value, 0);
        return newAssets.map(a => ({
          ...a,
          allocation: parseFloat(((a.value / totalNewValue) * 100).toFixed(1))
        }));
      });
      
      setRebalancing(false);
      setShowRebalance(false);
      toast.success('Portfolio successfully rebalanced: Trimmed Tech, added XLV.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total invested portfolio value</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">${totalValue.toLocaleString()}</p>
          <p className={`text-sm font-medium ${totalGain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()} ({totalGain >= 0 ? '+' : ''}{gainPct}%) all time
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowRebalance(!showRebalance)}>
            <RefreshCw className="w-3.5 h-3.5" /> Rebalance
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={exportToCSV}>
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="gradient-growth text-white border-0 gap-2" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="w-3.5 h-3.5" /> Add Position
          </Button>
        </div>
      </div>

      {/* Rebalance Panel */}
      {showRebalance && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Rebalancing Analysis</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your tech sector allocation (68%) exceeds target (50%). Suggested actions:</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <li>• Trim NVDA by ~$4,200 (reduce to 12% allocation)</li>
                <li>• Trim AAPL by ~$2,800 (reduce to 18% allocation)</li>
                <li>• Redeploy into Healthcare ETF (XLV) and Bonds</li>
              </ul>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="gradient-growth text-white border-0 h-7 text-xs flex items-center gap-1" onClick={executeRebalance} disabled={rebalancing}>
                  {rebalancing ? (
                    <>
                      <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Rebalancing...
                    </>
                  ) : 'Execute Rebalance'}
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setShowRebalance(false)} disabled={rebalancing}>Dismiss</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Position Form */}
      {showAdd && (
        <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Add New Position</h4>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-white/10 transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <Input placeholder="Symbol (e.g. TSLA)" value={newPos.symbol} onChange={e => setNewPos(p => ({ ...p, symbol: e.target.value }))} className="h-9 text-sm" />
            <Input placeholder="Company Name" value={newPos.name} onChange={e => setNewPos(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" />
            <select value={newPos.type} onChange={e => setNewPos(p => ({ ...p, type: e.target.value }))} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy text-slate-700 dark:text-slate-300 text-sm">
              {['stock', 'etf', 'crypto', 'bond', 'startup'].map(t => <option key={t}>{t}</option>)}
            </select>
            <Input placeholder="Quantity" type="number" value={newPos.quantity} onChange={e => setNewPos(p => ({ ...p, quantity: e.target.value }))} className="h-9 text-sm" />
            <Input placeholder="Avg. Buy Price ($)" type="number" value={newPos.avgPrice} onChange={e => setNewPos(p => ({ ...p, avgPrice: e.target.value }))} className="h-9 text-sm" />
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs" onClick={addPosition}>Add to Portfolio</Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Gain" value={`${totalGain >= 0 ? '+' : ''}$${Math.abs(totalGain).toLocaleString()}`} change={`${totalGain >= 0 ? '+' : ''}${gainPct}% all time`} positive={totalGain >= 0} icon={TrendingUp} iconColor="text-emerald-400" />
        <KPICard label="Positions" value={assets.length.toString()} subtitle="Active holdings" icon={Briefcase} iconColor="text-blue-400" />
        <KPICard label="Portfolio Beta" value="0.76" subtitle="vs S&P 500" icon={Activity} iconColor="text-purple-400" />
        <KPICard label="Sharpe Ratio" value="1.84" change="Excellent risk-adj. return" positive icon={DollarSign} iconColor="text-gold-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {(['holdings', 'performance', 'allocation'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'holdings' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
          {assets.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No positions yet. Add your first investment.</p>
              <Button className="mt-4 gradient-growth text-white border-0 gap-2" onClick={() => setShowAdd(true)}>
                <Plus className="w-4 h-4" /> Add First Position
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5">
                    {['Asset', 'Type', 'Qty', 'Avg Price', 'Current', 'Value', 'Gain/Loss', 'Allocation', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {assets.map(asset => (
                    <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{asset.symbol.slice(0,2)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{asset.symbol}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[100px]">{asset.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><Badge variant="secondary" className="text-xs capitalize">{asset.type}</Badge></td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300">{asset.quantity}</td>
                      <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-300">${asset.avgPrice.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-800 dark:text-white">${asset.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white">${asset.value.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          {asset.gainPercent >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                          <span className={`text-sm font-medium ${asset.gainPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {asset.gainPercent >= 0 ? '+' : ''}{asset.gainPercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden w-14">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(asset.allocation * 2, 100)}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{asset.allocation}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => removePosition(asset.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Remove position">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">12-Month Performance</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={portfolioChartData}>
                <defs>
                  <linearGradient id="port2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Portfolio']} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#port2)" dot={false} />
                <Area type="monotone" dataKey="benchmark" stroke="#F59E0B" strokeWidth={1.5} fill="none" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Returns (%)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Return']} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="return" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'allocation' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Asset Allocation</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <PieChart width={180} height={180}>
                <Pie data={assetAllocationData} cx={85} cy={85} innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                  {assetAllocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2.5">
                {assetAllocationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Holdings by Value</h3>
            <div className="space-y-3">
              {assets.map(asset => (
                <div key={asset.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{asset.symbol.slice(0,2)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{asset.symbol}</span>
                      <span className="text-slate-400">{asset.allocation}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(asset.allocation * 2, 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">${asset.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
