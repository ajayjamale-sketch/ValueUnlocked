import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff, Loader2, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types';

const demoRoles: { role: User['role']; label: string; desc: string; color: string }[] = [
  { role: 'investor', label: 'Investor', desc: 'Portfolio & wealth tracking', color: 'from-emerald-500 to-teal-600' },
  { role: 'value_investor', label: 'Value Investor', desc: 'Deep value & screening', color: 'from-blue-500 to-indigo-600' },
  { role: 'startup_investor', label: 'Startup Investor', desc: 'Startup portfolio & deals', color: 'from-purple-500 to-violet-600' },
  { role: 'advisor', label: 'Advisor', desc: 'Client management & AUM', color: 'from-amber-500 to-orange-600' },
  { role: 'entrepreneur', label: 'Entrepreneur', desc: 'Business intelligence', color: 'from-pink-500 to-rose-600' },
  { role: 'analyst', label: 'Analyst', desc: 'Research & publishing', color: 'from-cyan-500 to-sky-600' },
  { role: 'admin', label: 'Admin', desc: 'Platform management', color: 'from-red-500 to-rose-700' },
];

export default function Login() {
  const [email, setEmail] = useState('investor@valueunlocked.ai');
  const [password, setPassword] = useState('demo1234');
  const [showPass, setShowPass] = useState(false);
  const { handleLogin, handleQuickLogin, loading } = useAuth();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Value<span className="text-emerald-400">Unlocked</span></span>
          </Link>

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your wealth intelligence dashboard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label className="text-slate-300 text-sm mb-2 block">Email address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 h-12 focus:border-emerald-500" placeholder="you@example.com" required />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300 text-sm">Password</Label>
                <Link to="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 h-12 pr-12 focus:border-emerald-500" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-growth text-white border-0 h-12 text-base font-medium hover:opacity-90 group">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </Button>
          </form>

          <div className="relative flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['Google', 'Apple', 'LinkedIn'].map(p => (
              <Button key={p} variant="outline" className="border-white/20 text-slate-300 hover:text-white hover:bg-white/10 bg-transparent h-11 text-sm" onClick={() => handleQuickLogin('investor')}>
                {p}
              </Button>
            ))}
          </div>

          {/* ── Quick Demo Login ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <p className="text-white text-sm font-semibold">Quick Demo Login</p>
              <span className="ml-auto text-xs text-slate-400">No password needed</span>
            </div>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">Click any role to instantly explore that dashboard experience.</p>
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map(({ role, label, desc, color }) => (
                <button
                  key={role}
                  onClick={() => handleQuickLogin(role)}
                  disabled={loading}
                  className="group relative flex items-start gap-3 p-3 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-200 text-left disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className="text-white text-xs font-bold">{label.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{label}</p>
                    <p className="text-slate-400 text-[11px] truncate">{desc}</p>
                  </div>
                  {loading && <Loader2 className="absolute right-2 top-2 w-3 h-3 animate-spin text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            New to ValueUnlocked?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-navy via-[#0f2d1f] to-[#020617] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="relative text-center max-w-sm">
          <div className="glass rounded-2xl p-8 border border-white/10 mb-6">
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2">Your Wealth Score</p>
            <p className="text-white text-6xl font-bold mb-2">87</p>
            <p className="text-slate-400 text-sm">out of 100 — Excellent</p>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[87%] gradient-growth rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { l: 'Portfolio', v: '+24.7%' },
              { l: 'Opportunities', v: '12 New' },
              { l: 'AI Insights', v: '4 Active' },
              { l: 'Risk Score', v: '6.2/10' },
            ].map((m, i) => (
              <div key={i} className="glass rounded-xl p-3 border border-white/10 text-left">
                <p className="text-emerald-400 text-xs">{m.l}</p>
                <p className="text-white font-bold text-sm mt-0.5">{m.v}</p>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Your financial intelligence awaits</h2>
          <p className="text-slate-400 text-sm leading-relaxed">7 user types. One powerful platform. Unlock wealth intelligence tailored to your role.</p>
        </div>
      </div>
    </div>
  );
}
