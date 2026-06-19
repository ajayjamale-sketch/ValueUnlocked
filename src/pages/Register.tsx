import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { getStoredUser } from '@/lib/auth';

const roles = [
  { value: 'investor', label: 'Individual Investor', desc: 'I invest my own money' },
  { value: 'value_investor', label: 'Value Investor', desc: 'Long-term, fundamentals-based' },
  { value: 'startup_investor', label: 'Startup Investor', desc: 'I invest in early-stage companies' },
  { value: 'advisor', label: 'Wealth Advisor', desc: 'I manage client portfolios' },
  { value: 'entrepreneur', label: 'Entrepreneur', desc: 'I build and invest in startups' },
  { value: 'analyst', label: 'Research Analyst', desc: 'I conduct investment research' },
];

export default function Register() {
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'investor' });
  const { handleRegister, loading } = useAuth();

  const update = (field: string, value: string) => setForm(p => ({ ...p, [field]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    handleRegister(form);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Value<span className="text-emerald-400">Unlocked</span></span>
        </Link>

        <div className="glass rounded-2xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`flex items-center gap-1 ${s < 2 ? 'flex-1' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'gradient-growth text-white' : 'bg-white/10 text-slate-500'}`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`flex-1 h-px transition-all ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {step === 1 ? 'Create your account' : 'Choose your investor type'}
            </h1>
            <p className="text-slate-400 text-sm">
              {step === 1 ? '14-day free trial, no credit card required' : 'We will personalize your experience based on your role'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <Label className="text-slate-300 text-sm mb-2 block">Full name</Label>
                  <Input value={form.name} onChange={e => update('name', e.target.value)} className="bg-white/5 border-white/20 text-white h-11 focus:border-emerald-500" placeholder="Alexander Sterling" required />
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-2 block">Email address</Label>
                  <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="bg-white/5 border-white/20 text-white h-11 focus:border-emerald-500" placeholder="you@example.com" required />
                </div>
                <div>
                  <Label className="text-slate-300 text-sm mb-2 block">Password</Label>
                  <Input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="bg-white/5 border-white/20 text-white h-11 focus:border-emerald-500" placeholder="Min. 8 characters" minLength={8} required />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {roles.map(role => (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => update('role', role.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${form.role === role.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
                  >
                    <p className={`font-medium text-sm ${form.role === role.value ? 'text-emerald-400' : 'text-white'}`}>{role.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full gradient-growth text-white border-0 h-12 text-base font-medium hover:opacity-90 shadow-glow-emerald group">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : step === 1 ? <>Continue <ArrowRight className="ml-2 w-4 h-4" /></> : <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link> and{' '}
          <Link to="/privacy-policy" className="text-slate-400 hover:text-white">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
