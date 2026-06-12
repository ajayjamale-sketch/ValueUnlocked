import { useState } from 'react';
import { CheckCircle2, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { pricingPlans } from '@/lib/mockData';

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Pricing</span>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Invest in Your <span className="text-gradient-emerald">Financial Future</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">Start free. Upgrade when you are ready. Cancel anytime.</p>

          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/10 rounded-xl">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}>
              Annual
              <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">Save 25%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.id} className={`relative rounded-2xl p-7 border flex flex-col transition-all duration-300 hover:-translate-y-1 ${
              plan.highlighted
                ? 'gradient-wealth border-emerald-500/30 shadow-glow-emerald text-white'
                : 'bg-white dark:bg-navy border-slate-200 dark:border-white/10 hover:border-emerald-500/30 hover:shadow-lg'
            }`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-glow-emerald">
                    <Star className="w-3 h-3 fill-current" /> {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-slate-400'}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/60' : 'text-slate-400'}`}>/mo</span>
                </div>
                {annual && <p className={`text-xs mt-1 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-500'}`}>Billed annually</p>}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-emerald-300' : 'text-emerald-500'}`} />
                    <span className={plan.highlighted ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate(plan.id === 'enterprise' ? '/contact' : '/register')}
                className={`w-full ${plan.highlighted ? 'bg-white text-emerald-600 hover:bg-emerald-50 border-0' : 'gradient-growth text-white border-0 hover:opacity-90'}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
