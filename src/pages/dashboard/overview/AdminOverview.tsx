import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Users, DollarSign, TrendingUp, Shield, Settings, AlertTriangle, CheckCircle2, Activity, BarChart3, X, Search, Check, Trash2, Edit2, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { adminStats, adminRevenueData, recentUsers } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const planDistribution = [
  { plan: 'Starter', users: 68420, percent: 37, color: '#64748B' },
  { plan: 'Investor Pro', users: 51200, percent: 28, color: '#3B82F6' },
  { plan: 'Wealth Builder', users: 42100, percent: 23, color: '#10B981' },
  { plan: 'Enterprise', users: 23700, percent: 12, color: '#F59E0B' },
];

const systemHealth = [
  { name: 'API Uptime', value: '99.98%', status: 'green' },
  { name: 'Database', value: '12ms avg', status: 'green' },
  { name: 'AI Services', value: '98.4%', status: 'yellow' },
  { name: 'Storage', value: '68% used', status: 'green' },
];

export default function AdminOverview() {
  const [usersList, setUsersList] = useState(recentUsers);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  
  // Modals open states
  const [manageUsersOpen, setManageUsersOpen] = useState(false);
  const [reviewReportsOpen, setReviewReportsOpen] = useState(false);
  const [complianceLogOpen, setComplianceLogOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);

  // Search inside user management
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Pending reports state
  const [pendingReports, setPendingReports] = useState([
    { id: '101', title: 'Biotech Small-Cap Screener Q1 2024', author: 'Sophia Chen', category: 'Healthcare', price: 99, date: '1 day ago', status: 'pending' },
    { id: '102', title: 'Tesla Inc: Valuation Model & Projections', author: 'Marcus Chen', category: 'Technology', price: 149, date: '2 days ago', status: 'pending' },
    { id: '103', title: 'Global REITs in High Interest Rate Environment', author: 'Sarah Williams', category: 'Real Estate', price: 199, date: '3 days ago', status: 'pending' },
  ]);
  const [reportActionLoadingId, setReportActionLoadingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [showRejectFormId, setShowRejectFormId] = useState<string | null>(null);

  // System settings state
  const [settingsForm, setSettingsForm] = useState({
    queryRateLimit: 100,
    platformFeeRate: 2.5,
    maintenanceMode: false,
    auditLogging: true
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Compliance logs state
  const [complianceLogs, setComplianceLogs] = useState([
    { id: 1, action: 'User status updated', detail: 'Aarav Singh role updated to investor', admin: 'Admin User', date: 'Just now' },
    { id: 2, action: 'Report pending review', detail: 'New report draft uploaded by Sophia Chen', admin: 'System', date: '2 hours ago' },
    { id: 3, action: 'Platform configuration updated', detail: 'Platform commission fee adjusted to 2.5%', admin: 'Admin User', date: '5 hours ago' },
    { id: 4, action: 'Security scan completed', detail: '0 vulnerabilities found in API services', admin: 'System', date: '1 day ago' },
    { id: 5, action: 'System settings saved', detail: 'AI Query Limits set to 100 queries/month', admin: 'Admin User', date: '1 day ago' },
  ]);
  const [refreshingLogs, setRefreshingLogs] = useState(false);

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        toast.success(`Role for ${u.name} updated to ${newRole}`);
        const log = {
          id: Date.now(),
          action: 'User Role Update',
          detail: `Updated role of ${u.name} (${u.email}) to ${newRole}`,
          admin: 'Admin User',
          date: 'Just now'
        };
        setComplianceLogs(logs => [log, ...logs]);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const handleUpdatePlan = (userId: string, newPlan: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        toast.success(`Plan for ${u.name} updated to ${newPlan}`);
        const log = {
          id: Date.now(),
          action: 'User Plan Update',
          detail: `Updated subscription plan of ${u.name} to ${newPlan}`,
          admin: 'Admin User',
          date: 'Just now'
        };
        setComplianceLogs(logs => [log, ...logs]);
        return { ...u, plan: newPlan };
      }
      return u;
    }));
  };

  const handleToggleStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        toast.success(`User ${u.name} is now ${nextStatus}`);
        const log = {
          id: Date.now(),
          action: nextStatus === 'suspended' ? 'User Suspension' : 'User Activation',
          detail: `${nextStatus === 'suspended' ? 'Suspended' : 'Activated'} user account for ${u.name}`,
          admin: 'Admin User',
          date: 'Just now'
        };
        setComplianceLogs(logs => [log, ...logs]);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleApproveReport = (reportId: string, title: string) => {
    setReportActionLoadingId(reportId);
    setTimeout(() => {
      setPendingReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'approved' } : r));
      setReportActionLoadingId(null);
      toast.success(`Report "${title}" has been approved and published.`);
      
      const log = {
        id: Date.now(),
        action: 'Report Approved',
        detail: `Approved and published report: "${title}"`,
        admin: 'Admin User',
        date: 'Just now'
      };
      setComplianceLogs(logs => [log, ...logs]);
    }, 800);
  };

  const handleRejectReport = (reportId: string, title: string) => {
    const reason = rejectionReason[reportId] || 'Does not meet formatting standards';
    if (!reason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }
    setReportActionLoadingId(reportId);
    setTimeout(() => {
      setPendingReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'rejected' } : r));
      setReportActionLoadingId(null);
      setShowRejectFormId(null);
      toast.warning(`Report "${title}" has been rejected.`);
      
      const log = {
        id: Date.now(),
        action: 'Report Rejected',
        detail: `Rejected report: "${title}". Reason: ${reason}`,
        admin: 'Admin User',
        date: 'Just now'
      };
      setComplianceLogs(logs => [log, ...logs]);
    }, 800);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm.queryRateLimit || settingsForm.queryRateLimit < 1) {
      toast.error('Query limit must be at least 1.');
      return;
    }
    if (settingsForm.platformFeeRate === undefined || settingsForm.platformFeeRate < 0 || settingsForm.platformFeeRate > 100) {
      toast.error('Platform fee must be between 0% and 100%.');
      return;
    }

    setSettingsSaving(true);
    setTimeout(() => {
      setSettingsSaving(false);
      setSystemSettingsOpen(false);
      toast.success('System settings saved successfully!');
      
      const log = {
        id: Date.now(),
        action: 'Settings Changed',
        detail: `System params: AI Limit = ${settingsForm.queryRateLimit}, Fee = ${settingsForm.platformFeeRate}%, Maintenance = ${settingsForm.maintenanceMode ? 'ON' : 'OFF'}`,
        admin: 'Admin User',
        date: 'Just now'
      };
      setComplianceLogs(logs => [log, ...logs]);
    }, 1000);
  };

  const handleRefreshLogs = () => {
    setRefreshingLogs(true);
    setTimeout(() => {
      setRefreshingLogs(false);
      const randomLogs = [
        { id: Date.now(), action: 'API Key Generated', detail: 'Admin generated enterprise read keys', admin: 'System', date: 'Just now' },
        { id: Date.now() + 1, action: 'Database Cleanup', detail: 'Garbage collection processed 412 entries', admin: 'System', date: 'Just now' },
        { id: Date.now() + 2, action: 'Rate Limit Triggered', detail: 'User IP 192.168.1.4 throttled (limit exceeded)', admin: 'System', date: 'Just now' },
      ];
      setComplianceLogs(prev => [...randomLogs, ...prev]);
      toast.success('Audit logs refreshed!');
    }, 500);
  };

  const filteredUsers = usersList.filter(u =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.plan.toLowerCase().includes(userSearchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy to-[#0f2d1f] border border-emerald-500/20 rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">Platform Administration</h2>
          <p className="text-slate-400 text-sm mt-0.5">All systems operational · Last updated 2 min ago</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Users" value="185,420" change="+2,340 this week" positive={true} icon={Users} gradient />
        <KPICard label="Monthly MRR" value="$782,400" change="+12.4%" positive={true} icon={DollarSign} iconColor="text-emerald-400" />
        <KPICard label="Active Subscriptions" value="42,180" change="+890 this week" positive={true} icon={TrendingUp} iconColor="text-blue-400" />
        <KPICard label="Churn Rate" value="1.4%" change="-0.2% improved" positive={true} icon={Activity} iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Revenue & User Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={adminRevenueData}>
                <defs>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area yAxisId="left" type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={2} fill="url(#mrr)" dot={false} name="MRR" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} dot={false} name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Recent Registrations</h3>
              <Button variant="ghost" size="sm" className="text-xs text-emerald-500 h-auto p-0" onClick={() => setManageUsersOpen(true)}>Manage All Users</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/10">
                    {['User', 'Role', 'Plan', 'Joined', 'Status', ''].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-slate-400 pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <span className="text-emerald-400 text-xs font-bold">{u.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-800 dark:text-white">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4"><span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{u.role.replace('_',' ')}</span></td>
                      <td className="py-2.5 pr-4"><Badge className="text-[10px] border-0 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">{u.plan.replace('_',' ')}</Badge></td>
                      <td className="py-2.5 pr-4 text-xs text-slate-400">{u.joined}</td>
                      <td className="py-2.5 pr-4"><Badge className={`text-[10px] border-0 ${u.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>{u.status}</Badge></td>
                      <td className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" className="h-6 text-xs text-slate-400 hover:text-emerald-400 p-1" onClick={() => { setSelectedUserForEdit(u); setManageUsersOpen(true); }}>Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Plan Distribution</h3>
            <div className="space-y-3">
              {planDistribution.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">{p.plan}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.users.toLocaleString()} users</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.percent}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">System Health</h3>
            </div>
            <div className="space-y-3">
              {systemHealth.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${s.status === 'green' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{s.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Admin Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => { setSelectedUserForEdit(null); setManageUsersOpen(true); }} 
                className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 py-2 px-3 rounded-lg hover:bg-emerald-500/10 transition-colors border border-slate-100 dark:border-white/10 flex items-center justify-between"
              >
                <span>Manage Users</span>
                <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{usersList.length}</span>
              </button>
              <button 
                onClick={() => setReviewReportsOpen(true)} 
                className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 py-2 px-3 rounded-lg hover:bg-emerald-500/10 transition-colors border border-slate-100 dark:border-white/10 flex items-center justify-between"
              >
                <span>Review Reports</span>
                {pendingReports.filter(r => r.status === 'pending').length > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold">
                    {pendingReports.filter(r => r.status === 'pending').length} pending
                  </span>
                )}
              </button>
              <button 
                onClick={() => setComplianceLogOpen(true)} 
                className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 py-2 px-3 rounded-lg hover:bg-emerald-500/10 transition-colors border border-slate-100 dark:border-white/10 flex items-center justify-between"
              >
                <span>Compliance Log</span>
                <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-400">{complianceLogs.length}</span>
              </button>
              <button 
                onClick={() => setSystemSettingsOpen(true)} 
                className="w-full text-left text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 py-2 px-3 rounded-lg hover:bg-emerald-500/10 transition-colors border border-slate-100 dark:border-white/10"
              >
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Manage Users */}
      {manageUsersOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl my-auto animate-in fade-in zoom-in-95 duration-150 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                User Registration Management
              </h3>
              <button onClick={() => { setManageUsersOpen(false); setSelectedUserForEdit(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Search */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search user name, email, role or plan..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9 text-xs w-full text-slate-850 dark:text-white bg-white dark:bg-navy"
                />
              </div>
            </div>

            {/* User List Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {selectedUserForEdit && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Editing User Controls</h4>
                    <button onClick={() => setSelectedUserForEdit(null)} className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white">Clear Focus</button>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{selectedUserForEdit.name}</p>
                      <p className="text-[10px] text-slate-400">{selectedUserForEdit.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">ROLE</label>
                        <select
                          value={selectedUserForEdit.role}
                          onChange={(e) => {
                            handleUpdateRole(selectedUserForEdit.id, e.target.value);
                            setSelectedUserForEdit(prev => ({ ...prev, role: e.target.value }));
                          }}
                          className="text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                        >
                          {['investor', 'value_investor', 'startup_investor', 'advisor', 'entrepreneur', 'analyst', 'admin'].map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 block font-semibold">PLAN</label>
                        <select
                          value={selectedUserForEdit.plan}
                          onChange={(e) => {
                            handleUpdatePlan(selectedUserForEdit.id, e.target.value);
                            setSelectedUserForEdit(prev => ({ ...prev, plan: e.target.value }));
                          }}
                          className="text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
                        >
                          {['starter', 'investor_pro', 'wealth_builder', 'enterprise'].map(p => (
                            <option key={p} value={p}>{p.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1 pt-4">
                        <Button
                          size="sm"
                          variant={selectedUserForEdit.status === 'active' ? 'outline' : 'destructive'}
                          onClick={() => {
                            handleToggleStatus(selectedUserForEdit.id);
                            setSelectedUserForEdit(prev => ({ ...prev, status: prev.status === 'active' ? 'suspended' : 'active' }));
                          }}
                          className="h-7 text-xs font-semibold px-2"
                        >
                          {selectedUserForEdit.status === 'active' ? 'Suspend User' : 'Activate User'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 text-xs font-bold">{u.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{u.name}</p>
                          <Badge className={`text-[9px] border-0 h-4 ${u.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
                            {u.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-400">{u.email} · Joined {u.joined}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/10">
                        <span className="text-[10px] text-slate-400 uppercase">Role:</span>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="text-[10px] font-semibold bg-transparent border-0 p-0 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0 capitalize"
                        >
                          {['investor', 'value_investor', 'startup_investor', 'advisor', 'entrepreneur', 'analyst', 'admin'].map(r => (
                            <option key={r} value={r}>{r.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/10">
                        <span className="text-[10px] text-slate-400 uppercase">Plan:</span>
                        <select
                          value={u.plan}
                          onChange={(e) => handleUpdatePlan(u.id, e.target.value)}
                          className="text-[10px] font-semibold bg-transparent border-0 p-0 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-0 capitalize"
                        >
                          {['starter', 'investor_pro', 'wealth_builder', 'enterprise'].map(p => (
                            <option key={p} value={p}>{p.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(u.id)}
                        className={`h-7 px-2 text-[10px] font-semibold border ${
                          u.status === 'active' 
                            ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20' 
                            : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20'
                        }`}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400">No users found matching "{userSearchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end flex-shrink-0">
              <Button onClick={() => { setManageUsersOpen(false); setSelectedUserForEdit(null); }}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Review Reports */}
      {reviewReportsOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                Research Reports Review Queue
              </h3>
              <button onClick={() => setReviewReportsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {pendingReports.filter(r => r.status === 'pending').map((r) => (
                  <div key={r.id} className="py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {r.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mt-1">{r.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Author: {r.author} · Price: ${r.price} · Submitted: {r.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="h-8 text-xs gradient-growth text-white border-0 flex items-center gap-1"
                          disabled={reportActionLoadingId === r.id}
                          onClick={() => handleApproveReport(r.id, r.title)}
                        >
                          {reportActionLoadingId === r.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10"
                          disabled={reportActionLoadingId === r.id}
                          onClick={() => {
                            if (showRejectFormId === r.id) {
                              setShowRejectFormId(null);
                            } else {
                              setShowRejectFormId(r.id);
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>

                    {showRejectFormId === r.id && (
                      <div className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                        <label className="text-xs font-semibold text-slate-400 block">Rejection Feedback/Reason</label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="e.g. Please add a comparative table for competitors..."
                            value={rejectionReason[r.id] || ''}
                            onChange={(e) => setRejectionReason(prev => ({ ...prev, [r.id]: e.target.value }))}
                            className="text-xs flex-1 h-8 text-slate-850 dark:text-white bg-white dark:bg-navy"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 text-xs"
                            onClick={() => handleRejectReport(r.id, r.title)}
                          >
                            Confirm Reject
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {pendingReports.filter(r => r.status === 'pending').length === 0 && (
                  <div className="text-center py-12 space-y-2">
                    <div className="w-12 h-12 bg-emerald-500/25 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-white">All caught up!</p>
                    <p className="text-xs text-slate-400">All pending research reports have been reviewed and processed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end flex-shrink-0">
              <Button onClick={() => setReviewReportsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Compliance Log */}
      {complianceLogOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-xl my-auto animate-in fade-in zoom-in-95 duration-150 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Platform Compliance & Audit Trail
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefreshLogs} 
                  disabled={refreshingLogs}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingLogs ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setComplianceLogOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">System Activity Logs</p>
              <div className="space-y-3">
                {complianceLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{log.action}</span>
                      <span className="text-[10px] text-slate-400">{log.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{log.detail}</p>
                    <p className="text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100 dark:border-white/5">Actor: {log.admin}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end flex-shrink-0">
              <Button onClick={() => setComplianceLogOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: System Settings */}
      {systemSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-500" />
                Platform Parameters & Settings
              </h3>
              <button onClick={() => setSystemSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSettings}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    AI Queries Limit (queries/month)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={settingsForm.queryRateLimit}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, queryRateLimit: parseInt(e.target.value) || 100 }))}
                    className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                  />
                  <p className="text-[10px] text-slate-400">Monthly quota allocation for AI Wealth Advisor interactions.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Platform Commission Transaction Fee (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    required
                    value={settingsForm.platformFeeRate}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, platformFeeRate: parseFloat(e.target.value) || 2.5 }))}
                    className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                  />
                  <p className="text-[10px] text-slate-400">Revenue cut deducted on research reports transactions.</p>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Audit Log Logging</label>
                    <span className="text-[10px] text-slate-400">Write administrative modifications to audit trail.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.auditLogging}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, auditLogging: e.target.checked }))}
                    className="w-4 h-4 text-emerald-500 border-slate-200 dark:border-white/10 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Maintenance Mode</label>
                    <span className="text-[10px] text-slate-400">Render standard 'maintenance' overlay to public.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.maintenanceMode}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-4 h-4 text-emerald-500 border-slate-200 dark:border-white/10 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2 flex-shrink-0">
                <Button type="button" variant="ghost" onClick={() => setSystemSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={settingsSaving}
                  className="gradient-growth text-white border-0 flex items-center gap-1.5"
                >
                  {settingsSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  Save Settings
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
