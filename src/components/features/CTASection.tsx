import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

export default function CTASection() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <section className="py-24 bg-navy overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-emerald-500/30" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">Start your 14-day free trial — No credit card required</span>
        </div>

        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Start Unlocking<br />
          <span className="text-gradient-emerald">Wealth Opportunities</span> Today
        </h2>

        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 185,000+ investors who use ValueUnlocked to discover alpha, manage risk, and build generational wealth with the power of AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            className="gradient-growth text-white border-0 shadow-glow-emerald hover:opacity-90 text-lg px-10 h-14 group"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/contact')}
            className="border-white/20 text-white hover:bg-white/10 text-lg px-10 h-14 bg-transparent"
          >
            Talk to Sales
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {['SOC 2 Compliant', 'Bank-grade encryption', '99.9% uptime SLA', '14-day free trial'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
