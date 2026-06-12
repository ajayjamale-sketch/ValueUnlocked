import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      toast.success('Reset link sent! Check your email.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-12 justify-center">
          <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Value<span className="text-emerald-400">Unlocked</span></span>
        </Link>

        <div className="glass rounded-2xl border border-white/10 p-8">
          {!sent ? (
            <>
              <div className="w-14 h-14 gradient-growth rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Enter your email and we will send you a secure link to reset your password.
              </p>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <Label className="text-slate-300 text-sm mb-2 block">Email address</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/5 border-white/20 text-white h-12 focus:border-emerald-500" placeholder="you@example.com" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full gradient-growth text-white border-0 h-12">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>. It expires in 30 minutes.
              </p>
              <Button variant="outline" className="border-white/20 text-slate-300 w-full bg-transparent hover:bg-white/10" onClick={() => setSent(false)}>
                Try a different email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
