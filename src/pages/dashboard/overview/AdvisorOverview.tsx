import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, DollarSign, TrendingUp, FileText, MessageSquare, Star, Plus, Bell, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { advisorClients } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const aumData = [
  { month: 'Jul', aum: 14.2 }, { month: 'Aug', aum: 15.1 }, { month: 'Sep', aum: 14.8 },
  { month: 'Oct', aum: 16.2 }, { month: 'Nov', aum: 17.4 }, { month: 'Dec', aum: 18.1 },
];

const recentActivity = [
  { client: 'Robert Finch', action: 'Portfolio rebalancing recommended', time: '1h ago', type: 'action' },
  { client: 'Linda Park', action: 'Quarterly review scheduled', time: '3h ago', type: 'meeting' },
  { client: 'Thomas Berg', action: 'New opportunity alert: Healthcare REITs', time: '5h ago', type: 'alert' },
  { client: 'Mia Johnson', action: 'Retirement plan milestone achieved', time: '1d ago', type: 'success' },
];

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { X, Calendar } from 'lucide-react';

export default function AdvisorOverview() {
  const [clients, setClients] = useState(advisorClients);
  const [activities, setActivities] = useState(recentActivity);
  
  // Modals state
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', aum: '1.5', risk: 'Moderate', nextReview: 'Feb 25' });
  const [adding, setAdding] = useState(false);

  const [selectedClient, setSelectedClient] = useState<typeof advisorClients[0] | null>(null);
  const [chatClient, setChatClient] = useState<typeof advisorClients[0] | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'advisor' | 'client', text: string }>>([
    { role: 'client', text: 'Hi Jen, I saw the rebalancing suggestion. Should we execute it now?' },
    { role: 'advisor', text: 'Yes, I recommend doing it this week to lock in NVDA gains.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Quick Actions modal state
  const [quickAction, setQuickAction] = useState<'schedule' | 'report' | 'broadcast' | 'plan' | null>(null);
  
  // Quick Action form inputs
  const [scheduleForm, setScheduleForm] = useState({ client: 'Robert Finch', date: '2024-02-15', type: 'Quarterly Review' });
  const [reportForm, setReportForm] = useState({ client: 'Robert Finch', format: 'PDF' });
  const [broadcastForm, setBroadcastForm] = useState({ target: 'All Clients', subject: '', body: '' });
  const [planForm, setPlanForm] = useState({ client: 'Robert Finch', targetAge: '60', currentSavings: '2000000', monthlyContribution: '3000' });
  
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.aum) {
      return toast.error('Please enter client name and AUM');
    }
    const aumVal = parseFloat(newClient.aum);
    if (isNaN(aumVal) || aumVal <= 0) {
      return toast.error('AUM must be a positive number');
    }

    setAdding(true);
    setTimeout(() => {
      const added = {
        id: Date.now().toString(),
        name: newClient.name,
        aum: `$${aumVal.toFixed(1)}M`,
        portfolio: '+12.5%',
        risk: newClient.risk,
        nextReview: newClient.nextReview,
        status: 'active'
      };
      setClients(p => [...p, added]);
      setNewClient({ name: '', aum: '1.5', risk: 'Moderate', nextReview: 'Feb 25' });
      setShowAdd(false);
      setAdding(false);
      toast.success(`Client ${added.name} successfully registered.`);
      // Add activity
      setActivities(p => [
        { client: added.name, action: 'Client onboarded successfully', time: 'Just now', type: 'success' },
        ...p
      ]);
    }, 800);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { role: 'advisor' as const, text: chatInput };
    setChatMessages(p => [...p, newMsg]);
    setChatInput('');
    
    // Sim response
    setTimeout(() => {
      setChatMessages(p => [...p, { role: 'client', text: 'Understood. Thank you for the update.' }]);
    }, 1000);
  };

  const executeQuickAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAction === 'schedule') {
      toast.success(`Scheduled ${scheduleForm.type} with ${scheduleForm.client} for ${scheduleForm.date}`);
      setActivities(p => [
        { client: scheduleForm.client, action: `${scheduleForm.type} scheduled`, time: 'Just now', type: 'meeting' },
        ...p
      ]);
    } else if (quickAction === 'report') {
      const textContent = `Portfolio Performance Report\nClient: ${reportForm.client}\nAUM: $4.2M\nAsset Allocation: US Equities (60%), Bonds (30%), Alternatives (10%)\nReturn: +18.4% YTD\nSharpe Ratio: 1.84\nRisk profile: Moderate`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `performance_report_${reportForm.client.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${reportForm.format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Generated and downloaded report for ${reportForm.client}`);
    } else if (quickAction === 'broadcast') {
      if (!broadcastForm.subject || !broadcastForm.body) {
        return toast.error('Subject and body cannot be empty');
      }
      toast.success(`Broadcast sent to ${broadcastForm.target}: "${broadcastForm.subject}"`);
    } else if (quickAction === 'plan') {
      const retirementCapital = parseFloat(planForm.currentSavings) + (parseFloat(planForm.monthlyContribution) * 12 * (parseFloat(planForm.targetAge) - 45)); // assume age 45 base
      toast.success(`Financial Plan compiled for ${planForm.client}. Est. wealth at age ${planForm.targetAge}: $${retirementCapital.toLocaleString()}`);
      setActivities(p => [
        { client: planForm.client, action: `Financial plan created (Est. $${(retirementCapital/1000000).toFixed(1)}M)`, time: 'Just now', type: 'success' },
        ...p
      ]);
    }
    setQuickAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total AUM" value="$18.1M" change="+$1.2M this month" positive={true} icon={DollarSign} gradient />
        <KPICard label="Active Clients" value={clients.length.toString()} change="+3 this quarter" positive={true} icon={Users} iconColor="text-blue-400" />
        <KPICard label="Avg Portfolio Return" value="+18.4%" subtitle="vs benchmark +11.2%" icon={TrendingUp} iconColor="text-emerald-400" />
        <KPICard label="Research Published" value="12 Reports" subtitle="4,820 total views" icon={FileText} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-white">Client Portfolio</h3>
              <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs gap-1" onClick={() => setShowAdd(true)}>
                <Plus className="w-3 h-3" /> Add Client
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/10">
                    {['Client', 'AUM', 'Return', 'Risk', 'Next Review', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <span className="text-emerald-400 text-xs font-bold">{c.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-white text-sm">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-700 dark:text-slate-300 font-semibold">{c.aum}</td>
                      <td className="py-3 pr-4 text-sm text-emerald-500 font-semibold">{c.portfolio}</td>
                      <td className="py-3 pr-4"><Badge className={`text-[10px] border-0 ${c.risk === 'Aggressive' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : c.risk === 'Conservative' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{c.risk}</Badge></td>
                      <td className="py-3 pr-4 text-xs text-slate-400">{c.nextReview}</td>
                      <td className="py-3 pr-4"><Badge className={`text-[10px] border-0 ${c.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{c.status}</Badge></td>
                      <td className="py-3 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-400" onClick={() => setSelectedClient(c)} title="View Portfolio Allocation"><TrendingUp className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-blue-400" onClick={() => setChatClient(c)} title="Message Client"><MessageSquare className="w-3.5 h-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">AUM Growth</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={aumData}>
                <defs>
                  <linearGradient id="aum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip formatter={(v: number) => [`$${v}M AUM`, '']} contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="aum" stroke="#10B981" strokeWidth={2} fill="url(#aum)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.type === 'success' ? 'bg-emerald-500/20' : a.type === 'alert' ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                    {a.type === 'success'
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      : a.type === 'alert'
                      ? <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      : <ArrowRight className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-white truncate">{a.client}</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{a.action}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
            <h4 className="text-emerald-400 font-semibold text-sm mb-2">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { label: 'Schedule Client Review', action: 'schedule' },
                { label: 'Generate Portfolio Report', action: 'report' },
                { label: 'Send Market Update', action: 'broadcast' },
                { label: 'Create Financial Plan', action: 'plan' }
              ].map((act, i) => (
                <button key={i} onClick={() => setQuickAction(act.action as any)} className="w-full text-left text-xs text-slate-300 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add New Client</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Client Name</label>
                <Input value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Richard Hendricks" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Initial AUM ($M)</label>
                  <Input type="number" step="0.1" value={newClient.aum} onChange={e => setNewClient(p => ({ ...p, aum: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Risk profile</label>
                  <select value={newClient.risk} onChange={e => setNewClient(p => ({ ...p, risk: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                    {['Conservative', 'Moderate', 'Aggressive'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Next Review Date</label>
                <Input value={newClient.nextReview} onChange={e => setNewClient(p => ({ ...p, nextReview: e.target.value }))} placeholder="e.g. Feb 28" required />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setShowAdd(false)} disabled={adding}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit" disabled={adding}>
                  {adding ? 'Registering...' : 'Add Client'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Portfolio Viewer Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedClient(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedClient.name}'s Portfolio</h2>
                <p className="text-xs text-slate-400 mt-1">AUM: {selectedClient.aum} · YTD: {selectedClient.portfolio}</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Asset Allocation</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Equities', allocation: 65, value: 'US Blue Chips' },
                    { name: 'Fixed Income', allocation: 25, value: 'T-Bills & Munis' },
                    { name: 'Cash', allocation: 10, value: 'Money Market' },
                  ].map((asset, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{asset.name}</span>
                        <span className="text-slate-400">{asset.allocation}% ({asset.value})</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${asset.allocation}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-center">
                  <p className="text-xs text-slate-400">Sharpe Ratio</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">1.92</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl text-center">
                  <p className="text-xs text-slate-400">Risk Profile</p>
                  <p className="text-sm font-bold text-emerald-500">{selectedClient.risk}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button size="sm" className="gradient-growth text-white border-0" onClick={() => setSelectedClient(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Chat Simulation Modal */}
      {chatClient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Chat with {chatClient.name}</h2>
                <p className="text-[10px] text-emerald-500">Secure Direct Message</p>
              </div>
              <button onClick={() => setChatClient(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="h-60 overflow-y-auto p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 mb-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'advisor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${msg.role === 'advisor' ? 'bg-emerald-500 text-white font-medium' : 'bg-white dark:bg-navy text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="text-xs h-9" />
              <Button type="submit" size="sm" className="gradient-growth text-white border-0 text-xs">Send</Button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions Modals */}
      {quickAction && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {quickAction === 'schedule' && 'Schedule Client Review'}
                {quickAction === 'report' && 'Generate Performance Report'}
                {quickAction === 'broadcast' && 'Send Market Update'}
                {quickAction === 'plan' && 'Create Financial Plan'}
              </h2>
              <button onClick={() => setQuickAction(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={executeQuickAction} className="space-y-4">
              {quickAction === 'schedule' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Select Client</label>
                    <select value={scheduleForm.client} onChange={e => setScheduleForm(p => ({ ...p, client: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Review Date</label>
                    <Input type="date" value={scheduleForm.date} onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Review Type</label>
                    <select value={scheduleForm.type} onChange={e => setScheduleForm(p => ({ ...p, type: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {['Quarterly Review', 'Annual Performance', 'Portfolio Allocation Strategy', 'Tax Optimization'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </>
              )}

              {quickAction === 'report' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Select Client</label>
                    <select value={reportForm.client} onChange={e => setReportForm(p => ({ ...p, client: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Report Format</label>
                    <select value={reportForm.format} onChange={e => setReportForm(p => ({ ...p, format: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {['PDF', 'TXT', 'CSV'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </>
              )}

              {quickAction === 'broadcast' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Target Audience</label>
                    <select value={broadcastForm.target} onChange={e => setBroadcastForm(p => ({ ...p, target: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {['All Clients', 'Moderate Risk Profile', 'Aggressive Risk Profile', 'Active Status Only'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Subject</label>
                    <Input value={broadcastForm.subject} onChange={e => setBroadcastForm(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Market corrections and portfolio strategy" required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Message Body</label>
                    <textarea value={broadcastForm.body} onChange={e => setBroadcastForm(p => ({ ...p, body: e.target.value }))} rows={4} className="w-full text-xs bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg p-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Type group broadcast message..." required />
                  </div>
                </>
              )}

              {quickAction === 'plan' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Select Client</label>
                    <select value={planForm.client} onChange={e => setPlanForm(p => ({ ...p, client: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Target Age</label>
                      <Input type="number" value={planForm.targetAge} onChange={e => setPlanForm(p => ({ ...p, targetAge: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Current Capital ($)</label>
                      <Input type="number" value={planForm.currentSavings} onChange={e => setPlanForm(p => ({ ...p, currentSavings: e.target.value }))} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Monthly Contribution ($)</label>
                    <Input type="number" value={planForm.monthlyContribution} onChange={e => setPlanForm(p => ({ ...p, monthlyContribution: e.target.value }))} required />
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setQuickAction(null)}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit">
                  {quickAction === 'report' ? 'Download Report' : quickAction === 'plan' ? 'Calculate & Save' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
