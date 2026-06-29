import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, LineChart, Line
} from 'recharts';
import {
  BarChart3, TrendingUp, Download, Calendar, RefreshCw, Search, Filter,
  Shield, ShieldAlert, ShieldCheck, UserCheck, UserMinus, User, Trash2,
  CheckCircle2, AlertTriangle, Users, X, Mail, Plus
} from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import {
  portfolioChartData as defaultPortfolioData,
  netWorthData,
  assetAllocationData as defaultAllocationData,
  adminRevenueData as defaultRevenueData
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getStoredUser, getRoleLabel } from '@/lib/auth';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// ----- static data (unchanged) -----
const riskData = [
  { subject: 'Market Risk', A: 72, fullMark: 100 },
  { subject: 'Liquidity Risk', A: 45, fullMark: 100 },
  { subject: 'Concentration', A: 68, fullMark: 100 },
  { subject: 'Currency Risk', A: 32, fullMark: 100 },
  { subject: 'Credit Risk', A: 28, fullMark: 100 },
  { subject: 'Inflation Risk', A: 55, fullMark: 100 },
];

const sectorData = [
  { name: 'Technology', value: 42, color: '#3B82F6' },
  { name: 'Healthcare', value: 18, color: '#10B981' },
  { name: 'Financials', value: 15, color: '#F59E0B' },
  { name: 'Consumer', value: 12, color: '#8B5CF6' },
  { name: 'Energy', value: 8, color: '#EF4444' },
  { name: 'Other', value: 5, color: '#64748B' },
];

const monthlyPerf = [
  { month: 'Jan', portfolio: 2.1, benchmark: 1.4 },
  { month: 'Feb', portfolio: 3.8, benchmark: 2.1 },
  { month: 'Mar', portfolio: -1.2, benchmark: -2.0 },
  { month: 'Apr', portfolio: 4.2, benchmark: 3.1 },
  { month: 'May', portfolio: 2.8, benchmark: 1.9 },
  { month: 'Jun', portfolio: 1.5, benchmark: 0.8 },
  { month: 'Jul', portfolio: 5.1, benchmark: 3.4 },
  { month: 'Aug', portfolio: 3.3, benchmark: 2.2 },
  { month: 'Sep', portfolio: -0.8, benchmark: -1.5 },
  { month: 'Oct', portfolio: 2.9, benchmark: 2.0 },
  { month: 'Nov', portfolio: 4.1, benchmark: 2.8 },
  { month: 'Dec', portfolio: 3.7, benchmark: 2.4 },
];

const periods = ['1M', '3M', '6M', 'YTD', '1Y', 'All'];

// ----- helper: generate random variation -----
const randomVariation = (base: number, range: number) =>
  +(base + (Math.random() - 0.5) * range).toFixed(2);

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function AnalyticsPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === 'admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // ----- state for dynamic data -----
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [revenueData, setRevenueData] = useState(defaultRevenueData);
  const [allocationData, setAllocationData] = useState(defaultAllocationData);

  // ----- UI state -----
  const [activePeriod, setActivePeriod] = useState('1Y');
  const [activeView, setActiveView] = useState<'performance' | 'risk' | 'allocation' | 'reports' | 'users'>(
    (tabParam === 'users' && isAdmin) ? 'users' : 'performance'
  );

  // ----- user management state -----
  const [userList, setUserList] = useState([
    { id: '1', name: 'Aarav Singh', email: 'aarav@example.com', role: 'investor', plan: 'investor_pro', joined: '2024-01-28', status: 'active', verified: false },
    { id: '2', name: 'Claire Dubois', email: 'claire@example.com', role: 'advisor', plan: 'enterprise', joined: '2024-01-28', status: 'active', verified: true },
    { id: '3', name: 'James Okafor', email: 'james@example.com', role: 'analyst', plan: 'investor_pro', joined: '2024-01-27', status: 'pending', verified: false },
    { id: '4', name: 'Yuki Tanaka', email: 'yuki@example.com', role: 'entrepreneur', plan: 'starter', joined: '2024-01-27', status: 'active', verified: false },
    { id: '5', name: 'Sofia Romano', email: 'sofia@example.com', role: 'value_investor', plan: 'wealth_builder', joined: '2024-01-26', status: 'active', verified: false },
    { id: '6', name: 'Marcus Sterling', email: 'marcus@valueunlocked.ai', role: 'advisor', plan: 'wealth_builder', joined: '2024-01-25', status: 'active', verified: false },
    { id: '7', name: 'Warren Buffett Jr.', email: 'buffett@example.com', role: 'value_investor', plan: 'enterprise', joined: '2024-01-20', status: 'active', verified: true },
    { id: '8', name: 'John Doe', email: 'john@example.com', role: 'investor', plan: 'starter', joined: '2024-01-18', status: 'suspended', verified: false },
    { id: '9', name: 'Dr. Jane Watson', email: 'jane@example.com', role: 'analyst', plan: 'investor_pro', joined: '2024-01-15', status: 'active', verified: true },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ----- logs modal state -----
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<typeof userList[0] | null>(null);
  const [mockLogs, setMockLogs] = useState<{ timestamp: string; action: string }[]>([]);

  // ----- invite modal state -----
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('investor');

  // ----- refresh data (simulate API call) -----
  const refreshData = () => {
    // Randomise revenue data
    const newRevenue = defaultRevenueData.map(item => ({
      ...item,
      mrr: randomVariation(item.mrr, 5000),
      users: randomInt(Math.round(item.users * 0.95), Math.round(item.users * 1.05)),
      churn: randomVariation(item.churn, 0.3),
    }));
    setRevenueData(newRevenue);

    // Randomise portfolio chart
    const newPortfolio = defaultPortfolioData.map(item => ({
      ...item,
      value: randomVariation(item.value, 2000),
      benchmark: randomVariation(item.benchmark, 1500),
    }));
    setPortfolioData(newPortfolio);

    // Randomise asset allocation (ensure sum = 100)
    const allocCopy = defaultAllocationData.map(a => ({ ...a }));
    let total = allocCopy.reduce((s, a) => s + a.value, 0);
    const targetTotal = 100;
    // adjust randomly
    allocCopy.forEach(a => {
      a.value = Math.max(1, randomVariation(a.value, 5));
    });
    let newTotal = allocCopy.reduce((s, a) => s + a.value, 0);
    // Normalize to 100
    const ratio = targetTotal / newTotal;
    allocCopy.forEach(a => {
      a.value = Math.round(a.value * ratio);
    });
    // fix rounding
    let sum = allocCopy.reduce((s, a) => s + a.value, 0);
    if (sum !== 100) {
      allocCopy[0].value += (100 - sum);
    }
    setAllocationData(allocCopy);

    toast.success('Data refreshed with new simulated values');
  };

  // ----- export CSV -----
  const exportCSV = () => {
    let dataToExport: any[] = [];
    let fileName = 'analytics_export.csv';

    if (activeView === 'users' && isAdmin) {
      dataToExport = filteredUsers.map(u => ({
        Name: u.name,
        Email: u.email,
        Role: getRoleLabel(u.role as any),
        Plan: u.plan,
        Verified: u.verified ? 'Yes' : 'No',
        Joined: u.joined,
        Status: u.status,
      }));
      fileName = 'user_list.csv';
    } else if (activeView === 'performance') {
      dataToExport = isAdmin ? revenueData : portfolioData;
      fileName = 'performance_data.csv';
    } else if (activeView === 'allocation') {
      dataToExport = allocationData;
      fileName = 'allocation_data.csv';
    } else {
      toast.info('No exportable data for this view');
      return;
    }

    if (!dataToExport.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const rows = dataToExport.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${fileName}`);
  };

  // ----- rebalance -----
  const handleRebalance = () => {
    // Apply target allocations
    const newAlloc = allocationData.map(item => {
      let target = 0;
      switch (item.name) {
        case 'Stocks': target = 45; break;
        case 'Bonds': target = 30; break;
        case 'Real Estate': target = 15; break;
        case 'Cash': target = 5; break;
        case 'Commodities': target = 5; break;
        default: target = item.value;
      }
      return { ...item, value: target };
    });
    // ensure sum 100
    let sum = newAlloc.reduce((s, a) => s + a.value, 0);
    if (sum !== 100) newAlloc[0].value += (100 - sum);
    setAllocationData(newAlloc);
    toast.success('Portfolio rebalanced to target allocations');
  };

  // ----- invite user -----
  const handleInviteUser = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    // check duplicate
    if (userList.some(u => u.email === inviteEmail.trim())) {
      toast.error('User with this email already exists');
      return;
    }
    const newUser = {
      id: (userList.length + 1).toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      plan: 'starter',
      joined: new Date().toISOString().slice(0, 10),
      status: 'active',
      verified: false,
    };
    setUserList(prev => [...prev, newUser]);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteRole('investor');
    setInviteModalOpen(false);
  };

  // ----- logs -----
  const viewLogs = (user: typeof userList[0]) => {
    setSelectedUserForLogs(user);
    // generate mock logs
    const actions = ['Logged in', 'Viewed portfolio', 'Updated profile', 'Downloaded report', 'Changed plan', 'Logged out'];
    const logs = Array.from({ length: randomInt(3, 8) }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      action: actions[randomInt(0, actions.length - 1)],
    }));
    setMockLogs(logs);
    setLogsModalOpen(true);
  };

  // ----- sync tab from URL -----
  useEffect(() => {
    if (tabParam === 'users' && isAdmin) {
      setActiveView('users');
    } else if (tabParam === 'performance') {
      setActiveView('performance');
    }
  }, [tabParam, isAdmin]);

  const handleViewChange = (view: 'performance' | 'risk' | 'allocation' | 'reports' | 'users') => {
    setActiveView(view);
    if (isAdmin) {
      if (view === 'users') {
        setSearchParams({ tab: 'users' });
      } else if (view === 'performance') {
        setSearchParams({ tab: 'performance' });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('tab');
        setSearchParams(newParams);
      }
    }
  };

  // ----- user management handlers -----
  const handleToggleVerification = (id: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const nextVerified = !u.verified;
        toast.success(`${u.name} verification status updated to ${nextVerified ? 'Verified' : 'Unverified'}`);
        return { ...u, verified: nextVerified };
      }
      return u;
    }));
  };

  const handleChangePlan = (id: string, newPlan: any) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        toast.success(`${u.name} plan updated to ${newPlan.replace('_', ' ')}`);
        return { ...u, plan: newPlan };
      }
      return u;
    }));
  };

  const handleToggleStatus = (id: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        toast.success(`${u.name} is now ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const filteredUsers = userList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesPlan && matchesStatus;
  });

  // KPI values dynamic
  const totalUsers = userList.length;
  const verifiedExperts = userList.filter(u => u.verified).length;
  const suspended = userList.filter(u => u.status === 'suspended').length;
  const premium = userList.filter(u => u.plan !== 'starter').length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
          {(['performance', 'risk', 'allocation', ...(isAdmin ? ['reports', 'users'] : [])] as const).map(v => (
            <button
              key={v}
              onClick={() => handleViewChange(v as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                activeView === v
                  ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {v === 'users' ? 'User Management' : v}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => {
                  setActivePeriod(p);
                  refreshData(); // also refresh when period changes
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activePeriod === p
                    ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={refreshData}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button
            size="sm"
            className="gradient-growth text-white border-0 gap-1.5 h-8 text-xs"
            onClick={exportCSV}
          >
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards - dynamic based on view */}
      {activeView !== 'users' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label={isAdmin ? "Total MRR" : "Portfolio Alpha"}
            value={isAdmin ? `$${Math.round(revenueData.reduce((s, r) => s + r.mrr, 0) / 1000)}K` : "+13.5%"}
            change={isAdmin ? "+12.4% this month" : "vs S&P 500 baseline"}
            positive={true}
            icon={TrendingUp}
            gradient
          />
          <KPICard
            label={isAdmin ? "User Count" : "Sharpe Ratio"}
            value={isAdmin ? totalUsers.toLocaleString() : "1.84"}
            change={isAdmin ? "+2,340 this week" : "Excellent risk-adj. return"}
            positive={true}
            icon={BarChart3}
            iconColor="text-blue-400"
          />
          <KPICard
            label={isAdmin ? "Churn Rate" : "Max Drawdown"}
            value={isAdmin ? `${(revenueData.reduce((s, r) => s + r.churn, 0) / revenueData.length).toFixed(1)}%` : "-8.2%"}
            subtitle={isAdmin ? "-0.2% improved" : "12-month low"}
            icon={BarChart3}
            iconColor="text-emerald-400"
          />
          <KPICard
            label={isAdmin ? "Active Subs" : "Sortino Ratio"}
            value={isAdmin ? userList.filter(u => u.status === 'active').length.toLocaleString() : "2.31"}
            change={isAdmin ? "+890 this week" : "Top quartile"}
            positive={true}
            icon={TrendingUp}
            iconColor="text-purple-400"
          />
        </div>
      )}

      {/* ===== PERFORMANCE VIEW ===== */}
      {activeView === 'performance' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-white">
                {isAdmin ? 'Revenue Growth (MRR)' : 'Portfolio Performance vs Benchmark'}
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> {isAdmin ? 'MRR' : 'Portfolio'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block rounded border-dashed" /> {isAdmin ? 'Users' : 'S&P 500'}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={isAdmin ? revenueData : portfolioData}>
                <defs>
                  <linearGradient id="an1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey={isAdmin ? 'month' : 'date'} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey={isAdmin ? 'mrr' : 'value'} stroke="#10B981" strokeWidth={2.5} fill="url(#an1)" dot={false} />
                {!isAdmin && <Area type="monotone" dataKey="benchmark" stroke="#F59E0B" strokeWidth={1.5} fill="none" strokeDasharray="5 5" dot={false} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Returns vs Benchmark (%)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyPerf} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, '']} />
                <Bar dataKey="portfolio" fill="#10B981" radius={[4, 4, 0, 0]} name="Portfolio" />
                <Bar dataKey="benchmark" fill="#F59E0B" radius={[4, 4, 0, 0]} fillOpacity={0.7} name="S&P 500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ===== RISK VIEW ===== */}
      {activeView === 'risk' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Risk Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={riskData}>
                <PolarGrid stroke="rgba(0,0,0,0.08)" className="dark:stroke-white/10" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Radar name="Risk" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Risk Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Portfolio Beta', value: '0.76', desc: 'Less volatile than market', color: 'text-emerald-500', pct: 76 },
                { label: 'Volatility (σ)', value: '12.4%', desc: 'Annualized standard deviation', color: 'text-blue-500', pct: 45 },
                { label: 'Value at Risk (95%)', value: '-$24,800', desc: '1-day 95% confidence', color: 'text-red-500', pct: 65 },
                { label: 'Max Drawdown', value: '-8.2%', desc: '12-month trailing', color: 'text-amber-500', pct: 35 },
                { label: 'Correlation (S&P)', value: '0.72', desc: 'Portfolio vs benchmark', color: 'text-purple-500', pct: 72 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color.replace('text-', '').includes('emerald') ? '#10B981' : item.color.includes('blue') ? '#3B82F6' : item.color.includes('red') ? '#EF4444' : item.color.includes('amber') ? '#F59E0B' : '#8B5CF6' }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">AI Risk Assessment</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Overall risk score: <strong>6.2/10</strong> — Well-managed. Consider reducing tech concentration to below 50% to further improve the Sharpe ratio.</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== ALLOCATION VIEW ===== */}
      {activeView === 'allocation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Asset Class Allocation</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <PieChart width={180} height={180}>
                <Pie
                  data={allocationData}
                  cx={85}
                  cy={85}
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {allocationData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Sector Exposure</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <PieChart width={180} height={180}>
                <Pie data={sectorData} cx={85} cy={85} innerRadius={45} outerRadius={80} paddingAngle={2} dataKey="value">
                  {sectorData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {sectorData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-500 dark:text-slate-400">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Rebalancing Recommendations</h3>
              <Button
                size="sm"
                className="gradient-growth text-white border-0 h-8 text-xs"
                onClick={handleRebalance}
              >
                Execute Rebalance
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { asset: 'Technology (AAPL, MSFT, NVDA)', current: 42, target: 35, action: 'Reduce', delta: -7 },
                { asset: 'Healthcare ETF (XLV)', current: 5, target: 12, action: 'Increase', delta: 7 },
                { asset: 'International (VXUS)', current: 8, target: 15, action: 'Increase', delta: 7 },
                { asset: 'Cash / Money Market', current: 5, target: 5, action: 'Hold', delta: 0 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.asset}</p>
                    <p className="text-xs text-slate-400">Current: {item.current}% → Target: {item.target}%</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    item.action === 'Reduce'
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                      : item.action === 'Increase'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                  }`}>
                    {item.action} {item.delta !== 0 ? `${item.delta > 0 ? '+' : ''}${item.delta}%` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== USER MANAGEMENT VIEW ===== */}
      {activeView === 'users' && isAdmin && (
        <div className="space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Total User Accounts" value={totalUsers.toString()} subtitle="Registered users" icon={Users} gradient />
            <KPICard label="Verified Experts" value={verifiedExperts.toString()} subtitle="Advisors & Analysts" icon={ShieldCheck} iconColor="text-emerald-500" />
            <KPICard label="Suspended Accounts" value={suspended.toString()} subtitle="Security holds" icon={ShieldAlert} iconColor="text-red-500" />
            <KPICard label="Premium Subscribers" value={premium.toString()} subtitle="Active MRR contracts" icon={TrendingUp} iconColor="text-purple-500" />
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users by name, email..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center w-full md:w-auto">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="text-xs bg-transparent border-0 text-slate-700 dark:text-slate-300 w-full focus:outline-none py-0.5"
                  >
                    <option value="all">All Roles</option>
                    <option value="investor">Individual Investor</option>
                    <option value="value_investor">Value Investor</option>
                    <option value="startup_investor">Startup Investor</option>
                    <option value="advisor">Wealth Advisor</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="analyst">Research Analyst</option>
                  </select>
                </div>

                <select
                  value={planFilter}
                  onChange={e => setPlanFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 w-full sm:w-auto focus:outline-none"
                >
                  <option value="all">All Plans</option>
                  <option value="starter">Starter</option>
                  <option value="investor_pro">Investor Pro</option>
                  <option value="wealth_builder">Wealth Builder</option>
                  <option value="enterprise">Enterprise</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 w-full sm:w-auto focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>

                {(searchQuery || roleFilter !== 'all' || planFilter !== 'all' || statusFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-8 text-red-500 hover:text-red-400 p-2 w-full sm:w-auto"
                    onClick={() => {
                      setSearchQuery('');
                      setRoleFilter('all');
                      setPlanFilter('all');
                      setStatusFilter('all');
                      toast.info('Filters cleared');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-white">Registered Accounts ({filteredUsers.length})</h3>
              <Button
                size="sm"
                className="gradient-growth text-white border-0 text-xs"
                onClick={() => setInviteModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Invite User
              </Button>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <UserMinus className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">No users match your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 text-left">
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expert Verification</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined Date</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center font-bold text-emerald-500">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white text-sm">{u.name}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                          <Badge variant="secondary" className="capitalize bg-slate-100 dark:bg-white/15 text-slate-700 dark:text-slate-200 border-0 text-[10px]">
                            {getRoleLabel(u.role as any)}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <select
                            value={u.plan}
                            onChange={e => handleChangePlan(u.id, e.target.value)}
                            className="text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none"
                          >
                            <option value="starter">Starter</option>
                            <option value="investor_pro">Pro</option>
                            <option value="wealth_builder">Builder</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          {(u.role === 'advisor' || u.role === 'analyst') ? (
                            <div className="flex items-center gap-2">
                              {u.verified ? (
                                <>
                                  <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 text-[10px] flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified Expert
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] text-red-500 hover:text-red-400 p-0"
                                    onClick={() => handleToggleVerification(u.id)}
                                  >
                                    Revoke
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Badge className="bg-slate-100 dark:bg-white/10 text-slate-400 border-0 text-[10px]">
                                    Unverified
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] text-emerald-500 hover:text-emerald-400 p-0"
                                    onClick={() => handleToggleVerification(u.id)}
                                  >
                                    Verify
                                  </Button>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-400">
                          {u.joined}
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <Badge className={`text-[10px] border-0 ${
                            u.status === 'active'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : u.status === 'pending'
                                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}>
                            {u.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right text-xs">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`h-7 text-[10px] ${
                                u.status === 'active'
                                  ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-500/30'
                                  : 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-emerald-500/30'
                              }`}
                              onClick={() => handleToggleStatus(u.id)}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px]"
                              onClick={() => viewLogs(u)}
                            >
                              Logs
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== REPORTS VIEW ===== */}
      {activeView === 'reports' && isAdmin && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Platform Revenue Analytics</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={2.5} dot={false} name="MRR" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#F59E0B" strokeWidth={2} dot={false} name="Users" />
                <Line yAxisId="left" type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={2} dot={false} name="Churn %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ===== INVITE MODAL ===== */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Invite New User</h3>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full mt-1 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="investor">Individual Investor</option>
                  <option value="value_investor">Value Investor</option>
                  <option value="startup_investor">Startup Investor</option>
                  <option value="advisor">Wealth Advisor</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="analyst">Research Analyst</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
                <Button size="sm" className="gradient-growth text-white border-0" onClick={handleInviteUser}>
                  <Mail className="w-3.5 h-3.5 mr-1" /> Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== LOGS MODAL ===== */}
      {logsModalOpen && selectedUserForLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white">Activity Logs - {selectedUserForLogs.name}</h3>
              <button onClick={() => setLogsModalOpen(false)} className="text-slate-400 hover:text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {mockLogs.length === 0 ? (
                <p className="text-sm text-slate-400">No logs available.</p>
              ) : (
                mockLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between text-xs border-b border-slate-100 dark:border-white/5 py-1.5">
                    <span className="text-slate-500 dark:text-slate-400">{log.timestamp}</span>
                    <span className="text-slate-700 dark:text-slate-300">{log.action}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setLogsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}