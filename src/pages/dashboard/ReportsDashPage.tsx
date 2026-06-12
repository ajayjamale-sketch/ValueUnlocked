import { useState } from 'react';
import { FileText, Star, Download, Plus, Eye, DollarSign, Filter, Search, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { researchReports } from '@/lib/mockData';
import { getStoredUser } from '@/lib/auth';
import { toast } from 'sonner';
import type { ResearchReport } from '@/types';

const initialMyReports = [
  { id: '1', title: 'AAPL Q4 2024: Deep Dive — Buy Below $185', status: 'published', views: 2840, revenue: 21300, date: 'Jan 20', category: 'Technology', price: 150, summary: 'Apple valuation deep dive after Q4 earnings report.' },
  { id: '2', title: 'India Banking Sector: Hidden Champions', status: 'published', views: 1920, revenue: 13350, date: 'Jan 15', category: 'Global Markets', price: 150, summary: 'An analysis of high-growth mid-cap banking options in India.' },
  { id: '3', title: 'Biotech Small-Cap Screener Q1 2024', status: 'draft', views: 0, revenue: 0, date: 'Jan 25', category: 'Healthcare', price: 99, summary: 'Draft screener analyzing biotech candidates for 2024.' },
];

export default function ReportsDashPage() {
  const user = getStoredUser();
  const isAnalyst = user?.role === 'analyst' || user?.role === 'advisor';
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'browse' | 'mine'>('browse');

  // Balances & Purchase states
  const [balance, setBalance] = useState(1200); // Mock portfolio cash balance
  const [purchasedIds, setPurchasedIds] = useState<string[]>(['1']);
  const [purchasingReport, setPurchasingReport] = useState<ResearchReport | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // My reports list state
  const [myReportsList, setMyReportsList] = useState(initialMyReports);
  
  // Editor/View States
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', price: '99', category: 'Technology', summary: '' });

  const [editingReport, setEditingReport] = useState<typeof initialMyReports[0] | null>(null);
  const [viewingReport, setViewingReport] = useState<any | null>(null);

  const filtered = researchReports.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.author.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReport.title || !newReport.summary || !newReport.price) {
      return toast.error('Please fill in all fields');
    }
    const priceNum = parseFloat(newReport.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return toast.error('Please enter a valid price');
    }

    setSubmitting(true);
    setTimeout(() => {
      const added = {
        id: Date.now().toString(),
        title: newReport.title,
        status: 'published',
        views: 0,
        revenue: 0,
        date: 'Today',
        category: newReport.category,
        price: priceNum,
        summary: newReport.summary
      };
      setMyReportsList(prev => [added, ...prev]);
      setNewReport({ title: '', price: '99', category: 'Technology', summary: '' });
      setShowAdd(false);
      setSubmitting(false);
      toast.success('Analyst report published successfully!');
    }, 1000);
  };

  const handleEditReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport?.title || !editingReport?.summary || !editingReport?.price) {
      return toast.error('Please fill in all fields');
    }
    const priceNum = parseFloat(editingReport.price as any);
    if (isNaN(priceNum) || priceNum <= 0) {
      return toast.error('Please enter a valid price');
    }

    setMyReportsList(prev => prev.map(r => r.id === editingReport.id ? { ...editingReport, price: priceNum } : r));
    setEditingReport(null);
    toast.success('Report updated successfully.');
  };

  const handleConfirmPurchase = () => {
    if (!purchasingReport) return;
    if (balance < purchasingReport.price) {
      toast.error('Insufficient funds in your account balance.');
      setPurchasingReport(null);
      return;
    }
    
    setIsPaying(true);
    setTimeout(() => {
      setBalance(b => b - purchasingReport.price);
      setPurchasedIds(prev => [...prev, purchasingReport.id]);
      setIsPaying(false);
      setPurchasingReport(null);
      toast.success(`Purchased report: ${purchasingReport.title}`);
    }, 1200);
  };

  const downloadReportFile = (title: string) => {
    const textContent = `ValueUnlocked Premium Research Report\nTitle: ${title}\nAuthorized User: ${user?.name || 'Valued Client'}\nDate: ${new Date().toLocaleDateString()}\n\nThis is a mock PDF download containing comprehensive industry dynamics, financial models, risk assessments, and investment ratings.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Balance Indicator for Browse tab */}
      <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-slate-400">Account Investment Balance</p>
            <p className="text-lg font-bold text-slate-800 dark:text-white">${balance.toLocaleString()}</p>
          </div>
        </div>
        <span className="text-xs text-slate-400">Mock Balance (updates on purchases)</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-0 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {(['browse', ...(isAnalyst ? ['mine'] : [])] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              {t === 'mine' ? 'My Reports' : 'Browse Marketplace'}
            </button>
          ))}
        </div>
        {isAnalyst && tab === 'mine' && (
          <Button className="gradient-growth text-white border-0 gap-2 h-9 text-sm w-full sm:w-auto justify-center" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> New Report
          </Button>
        )}
      </div>

      {tab === 'browse' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Search reports, analysts, categories..." />
            </div>
            <Button variant="outline" className="gap-2 h-10"><Filter className="w-4 h-4" />Filter</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r, i) => {
              const isPurchased = purchasedIds.includes(r.id);
              return (
                <div key={`${r.id}-${i}`} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 text-xs">{r.category}</Badge>
                      <p className="text-xl font-bold text-emerald-500">${r.price}</p>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-sm leading-snug line-clamp-2">{r.title}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{r.summary}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <img src={r.authorAvatar} alt={r.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{r.author}</span>
                      <span className="ml-auto flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{r.rating}</span>
                        <span className="text-xs text-slate-400">({r.reviews})</span>
                      </span>
                    </div>
                  </div>
                  {isPurchased ? (
                    <Button className="w-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-0 text-sm gap-2 h-9" onClick={() => downloadReportFile(r.title)}>
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </Button>
                  ) : (
                    <Button className="w-full gradient-growth text-white border-0 text-sm gap-2 hover:opacity-90 h-9" onClick={() => setPurchasingReport(r)}>
                      <DollarSign className="w-3.5 h-3.5" /> Purchase Report
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'mine' && (
        <div className="space-y-4">
          {myReportsList.map(r => (
            <div key={r.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] border-0 ${r.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{r.status}</Badge>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{r.title}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between sm:justify-end flex-1 w-full sm:w-auto">
                <div className="text-center hidden md:block">
                  <p className="text-sm font-bold text-slate-700 dark:text-white">{r.views.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Views</p>
                </div>
                <div className="text-center hidden md:block">
                  <p className="text-sm font-bold text-emerald-500">${r.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Revenue</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setEditingReport(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400" onClick={() => setViewingReport(r)}><Eye className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Report Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Publish New Research Report</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Report Title</label>
                <Input value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} placeholder="e.g. MSFT Q1 Deep Dive: Growth Potential" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Target Price ($)</label>
                  <Input type="number" value={newReport.price} onChange={e => setNewReport(p => ({ ...p, price: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
                  <select value={newReport.category} onChange={e => setNewReport(p => ({ ...p, category: e.target.value }))} className="w-full text-sm h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-3 text-slate-700 dark:text-slate-300">
                    {['Technology', 'Value Investing', 'Healthcare', 'Global Markets', 'FinTech'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Executive Summary</label>
                <textarea value={newReport.summary} onChange={e => setNewReport(p => ({ ...p, summary: e.target.value }))} rows={4} className="w-full text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Provide a summary of investment arguments, ratings, and valuation targets..." required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setShowAdd(false)} disabled={submitting}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit" disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Research Report</h2>
              <button onClick={() => setEditingReport(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleEditReport} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Report Title</label>
                <Input value={editingReport.title} onChange={e => setEditingReport(p => p ? ({ ...p, title: e.target.value }) : null)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Target Price ($)</label>
                  <Input type="number" value={editingReport.price} onChange={e => setEditingReport(p => p ? ({ ...p, price: e.target.value as any }) : null)} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Category</label>
                  <select value={editingReport.category} onChange={e => setEditingReport(p => p ? ({ ...p, category: e.target.value }) : null)} className="w-full text-sm h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-3 text-slate-700 dark:text-slate-300">
                    {['Technology', 'Value Investing', 'Healthcare', 'Global Markets', 'FinTech'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Executive Summary</label>
                <textarea value={editingReport.summary} onChange={e => setEditingReport(p => p ? ({ ...p, summary: e.target.value }) : null)} rows={4} className="w-full text-sm bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setEditingReport(null)}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Detail Modal */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setViewingReport(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-1 border-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">{viewingReport.category}</Badge>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-snug">{viewingReport.title}</h2>
                <p className="text-xs text-slate-400 mt-1">Published on {viewingReport.date} · Price: ${viewingReport.price}</p>
              </div>
              <button onClick={() => setViewingReport(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Executive Summary</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{viewingReport.summary || 'This report details current valuations and earnings forecasts.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg text-center">
                <p className="text-xs text-slate-400 mb-0.5">Views</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{viewingReport.views.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg text-center">
                <p className="text-xs text-slate-400 mb-0.5">Revenue Earned</p>
                <p className="text-sm font-bold text-emerald-500">${viewingReport.revenue.toLocaleString()}</p>
              </div>
            </div>
            <Button className="w-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-0 text-sm gap-2 h-9" onClick={() => { downloadReportFile(viewingReport.title); setViewingReport(null); }}>
              <Download className="w-3.5 h-3.5" /> Download Report Copy
            </Button>
          </div>
        </div>
      )}

      {/* Confirm Purchase Modal */}
      {purchasingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Confirm Report Purchase</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">You are purchasing: <strong className="text-slate-700 dark:text-slate-300">{purchasingReport.title}</strong></p>
            <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/10 mb-5 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Report Price:</span>
                <span className="font-semibold text-slate-800 dark:text-white">${purchasingReport.price}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-semibold text-slate-800 dark:text-white">${balance}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 text-emerald-500 font-bold">
                <span>Remaining Balance:</span>
                <span>${balance - purchasingReport.price}</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setPurchasingReport(null)} disabled={isPaying}>Cancel</Button>
              <Button className="gradient-growth text-white border-0 size-sm" onClick={handleConfirmPurchase} disabled={isPaying}>
                {isPaying ? 'Processing...' : 'Confirm & Pay'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
