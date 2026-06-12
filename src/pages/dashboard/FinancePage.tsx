import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wallet, TrendingDown, TrendingUp, Target, CreditCard, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const budgetData = [
  { category: 'Housing', budget: 3500, actual: 3500 },
  { category: 'Food', budget: 1200, actual: 980 },
  { category: 'Transport', budget: 600, actual: 720 },
  { category: 'Entertainment', budget: 500, actual: 380 },
  { category: 'Investments', budget: 5000, actual: 5200 },
  { category: 'Healthcare', budget: 400, actual: 290 },
];

const expenseCategories = [
  { name: 'Housing', value: 3500, color: '#10B981' },
  { name: 'Investments', value: 5200, color: '#3B82F6' },
  { name: 'Food', value: 980, color: '#F59E0B' },
  { name: 'Transport', value: 720, color: '#8B5CF6' },
  { name: 'Other', value: 970, color: '#64748B' },
];

const initialTransactions = [
  { id: 1, desc: 'AAPL Stock Purchase', amount: -4750, date: 'Today', category: 'Investment' },
  { id: 2, desc: 'Salary Deposit', amount: 24500, date: 'Yesterday', category: 'Income' },
  { id: 3, desc: 'Monthly Rent', amount: -3500, date: 'Dec 1', category: 'Housing' },
  { id: 4, desc: 'Dividend — BRK.B', amount: 312, date: 'Nov 30', category: 'Dividend' },
  { id: 5, desc: 'Grocery Shopping', amount: -245, date: 'Nov 29', category: 'Food' },
  { id: 6, desc: 'Netflix Subscription', amount: -18, date: 'Nov 28', category: 'Entertainment' },
];

const initialGoals = [
  { id: 1, name: 'Emergency Fund', target: 50000, current: 42000, color: 'bg-emerald-500' },
  { id: 2, name: 'Down Payment', target: 200000, current: 145000, color: 'bg-blue-500' },
  { id: 3, name: 'College Fund', target: 100000, current: 38000, color: 'bg-purple-500' },
  { id: 4, name: 'Vacation', target: 15000, current: 9500, color: 'bg-amber-500' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'goals' | 'budget'>('overview');
  const [transactions, setTransactions] = useState(initialTransactions);
  const [goals, setGoals] = useState(initialGoals);
  const [showAddTx, setShowAddTx] = useState(false);
  const [newTx, setNewTx] = useState({ desc: '', amount: '', category: 'Other', type: 'expense' });
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', current: '' });
  const [goalContrib, setGoalContrib] = useState<Record<number, string>>({});

  const addTransaction = () => {
    if (!newTx.desc || !newTx.amount) return toast.error('Please fill in all fields');
    const amount = parseFloat(newTx.amount) * (newTx.type === 'expense' ? -1 : 1);
    setTransactions(prev => [{ id: Date.now(), desc: newTx.desc, amount, date: 'Today', category: newTx.category }, ...prev]);
    setNewTx({ desc: '', amount: '', category: 'Other', type: 'expense' });
    setShowAddTx(false);
    toast.success('Transaction added successfully');
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction removed');
  };

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) return toast.error('Please fill in all fields');
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500'];
    setGoals(prev => [...prev, {
      id: Date.now(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      color: colors[prev.length % colors.length],
    }]);
    setNewGoal({ name: '', target: '', current: '' });
    setShowAddGoal(false);
    toast.success('Savings goal created!');
  };

  const contributeToGoal = (goalId: number) => {
    const amount = parseFloat(goalContrib[goalId] || '0');
    if (!amount || isNaN(amount)) return toast.error('Enter a valid amount');
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, current: Math.min(g.current + amount, g.target) } : g));
    setGoalContrib(prev => ({ ...prev, [goalId]: '' }));
    toast.success(`Added $${amount.toLocaleString()} to goal!`);
  };

  const income = transactions.filter(t => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((a, t) => a + t.amount, 0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Monthly Income" value={`$${income.toLocaleString()}`} change="+8.2% vs last month" positive icon={TrendingUp} iconColor="text-emerald-400" />
        <KPICard label="Monthly Expenses" value={`$${expenses.toLocaleString()}`} change="-3.1% vs last month" positive icon={TrendingDown} iconColor="text-blue-400" />
        <KPICard label="Savings Rate" value={`${income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0}%`} change="Excellent" positive icon={Wallet} iconColor="text-purple-400" />
        <KPICard label="Net Cashflow" value={`$${(income - expenses).toLocaleString()}`} change="This month" positive={income > expenses} icon={CreditCard} iconColor="text-gold-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {(['overview', 'transactions', 'goals', 'budget'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Budget vs. Actual Spending</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={budgetData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="actual" fill="#10B981" radius={[4, 4, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Expense Breakdown</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <PieChart width={140} height={140}>
                <Pie data={expenseCategories} cx={65} cy={65} innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                  {expenseCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="flex-1 space-y-2">
                {expenseCategories.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500 dark:text-slate-400 text-xs">{item.name}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white">All Transactions</h3>
            <Button size="sm" className="gradient-growth text-white border-0 gap-1 h-8 text-xs" onClick={() => setShowAddTx(!showAddTx)}>
              <Plus className="w-3.5 h-3.5" /> Add Transaction
            </Button>
          </div>

          {showAddTx && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">New Transaction</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Description" value={newTx.desc} onChange={e => setNewTx(p => ({ ...p, desc: e.target.value }))} className="h-9 text-sm" />
                <Input placeholder="Amount" type="number" value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))} className="h-9 text-sm" />
                <select value={newTx.type} onChange={e => setNewTx(p => ({ ...p, type: e.target.value }))} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy text-slate-700 dark:text-slate-300 text-sm">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <select value={newTx.category} onChange={e => setNewTx(p => ({ ...p, category: e.target.value }))} className="h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy text-slate-700 dark:text-slate-300 text-sm">
                  {['Housing', 'Food', 'Transport', 'Investment', 'Income', 'Entertainment', 'Healthcare', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs" onClick={addTransaction}>Add</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowAddTx(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {transactions.map(t => (
                <div key={t.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${t.amount > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                      {t.category.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{t.desc}</p>
                      <p className="text-xs text-slate-400">{t.date} · {t.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${t.amount > 0 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toLocaleString()}
                    </span>
                    <button onClick={() => deleteTransaction(t.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 dark:text-white">Savings Goals</h3>
            <Button size="sm" className="gradient-growth text-white border-0 gap-1 h-8 text-xs" onClick={() => setShowAddGoal(!showAddGoal)}>
              <Plus className="w-3.5 h-3.5" /> New Goal
            </Button>
          </div>

          {showAddGoal && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400">Create New Goal</h4>
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="Goal name" value={newGoal.name} onChange={e => setNewGoal(p => ({ ...p, name: e.target.value }))} className="h-9 text-sm" />
                <Input placeholder="Target amount" type="number" value={newGoal.target} onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))} className="h-9 text-sm" />
                <Input placeholder="Current savings" type="number" value={newGoal.current} onChange={e => setNewGoal(p => ({ ...p, current: e.target.value }))} className="h-9 text-sm" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs" onClick={addGoal}>Create Goal</Button>
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowAddGoal(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map(g => {
              const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
              return (
                <div key={g.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{g.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">${g.current.toLocaleString()} / ${g.target.toLocaleString()}</p>
                    </div>
                    {pct >= 100 ? (
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 text-xs gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Achieved!
                      </Badge>
                    ) : (
                      <span className="text-2xl font-bold text-emerald-500">{pct}%</span>
                    )}
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${g.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mb-3">${(g.target - g.current).toLocaleString()} remaining</p>
                  {pct < 100 && (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Add amount"
                        value={goalContrib[g.id] || ''}
                        onChange={e => setGoalContrib(p => ({ ...p, [g.id]: e.target.value }))}
                        className="h-8 text-xs flex-1"
                      />
                      <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs px-3" onClick={() => contributeToGoal(g.id)}>
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Monthly Budget Tracker</h3>
            <div className="space-y-4">
              {budgetData.map((item, i) => {
                const pct = (item.actual / item.budget) * 100;
                const over = pct > 100;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">Budget: ${item.budget.toLocaleString()}</span>
                        <span className={`text-sm font-bold ${over ? 'text-red-500' : 'text-emerald-500'}`}>
                          ${item.actual.toLocaleString()} {over ? '⚠️' : '✓'}
                        </span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{pct.toFixed(0)}% of budget used</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">AI Budget Recommendation</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">You are over budget in Transport by $120. Reduce rideshare usage or explore monthly transit pass. Surplus in Food ($220) can be redirected to your Emergency Fund goal.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
