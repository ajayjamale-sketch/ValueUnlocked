import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Toggle, Zap, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { pricingPlans } from '@/lib/mockData';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const featureGroups = [
  {
    group: 'Research & Analysis',
    features: [
      { name: 'Stock Screener', starter: 'Basic', pro: 'Advanced', wealth: 'Advanced + AI', enterprise: 'Custom' },
      { name: 'AI Research Reports', starter: '10/mo', pro: '100/mo', wealth: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Watchlists', starter: '5', pro: 'Unlimited', wealth: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Research Marketplace', starter: false, pro: true, wealth: true, enterprise: true },
    ],
  },
  {
    group: 'Portfolio & Analytics',
    features: [
      { name: 'Portfolio Tracking', starter: true, pro: true, wealth: true, enterprise: true },
      { name: 'Advanced Analytics', starter: false, pro: true, wealth: true, enterprise: true },
      { name: 'Risk Analytics', starter: false, pro: true, wealth: true, enterprise: true },
      { name: 'Benchmark Comparison', starter: false, pro: true, wealth: true, enterprise: true },
    ],
  },
  {
    group: 'AI Features',
    features: [
      { name: 'AI Wealth Advisor', starter: '10 queries/mo', pro: '100 queries/mo', wealth: 'Unlimited', enterprise: 'Custom model' },
      { name: 'Opportunity Discovery', starter: false, pro: true, wealth: true, enterprise: true },
      { name: 'AI Insights Feed', starter: false, pro: true, wealth: true, enterprise: true },
    ],
  },
  {
    group: 'Platform Access',
    features: [
      { name: 'Community Access', starter: true, pro: true, wealth: true, enterprise: true },
      { name: 'Learning Academy', starter: '3 free courses', pro: 'All courses', wealth: 'All courses', enterprise: 'All + custom' },
      { name: 'Startup Intelligence', starter: false, pro: false, wealth: true, enterprise: true },
      { name: 'API Access', starter: false, pro: false, wealth: true, enterprise: true },
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const handleGetStarted = (planName: string) => {
    if (planName === 'Enterprise') {
      toast.info('Connecting you with our Enterprise sales team...');
    } else {
      toast.success(`Starting free trial for ${planName} plan!`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">Simple, Transparent <span className="text-emerald-400">Pricing</span></h1>
          <p className="text-xl text-slate-300 mb-8">Start with a 14-day free trial. No credit card required.</p>
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-emerald-500' : 'bg-slate-600'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${annual ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-slate-400'}`}>Annual</span>
            {annual && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Save up to 35%</Badge>}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-20">
            {pricingPlans.map((plan, i) => (
              <div key={plan.id} className={`relative rounded-2xl border p-7 flex flex-col ${plan.highlighted ? 'bg-navy border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105' : 'bg-white dark:bg-navy border-slate-200 dark:border-white/10'}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-growth text-white border-0 text-xs px-3 py-1">{plan.badge}</Badge>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-400'}`}>{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? 'text-slate-300' : 'text-slate-400'}`}>/mo</span>
                  {annual && <p className="text-xs text-emerald-400 mt-1">Billed annually</p>}
                </div>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full ${plan.highlighted ? 'gradient-growth text-white border-0' : 'border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:border-emerald-500/30 bg-transparent'}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Full Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3">Feature</th>
                    {['Starter', 'Investor Pro', 'Wealth Builder', 'Enterprise'].map(p => (
                      <th key={p} className="px-4 py-4 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureGroups.map((group, gi) => (
                    <>
                      <tr key={`g-${gi}`} className="bg-emerald-50 dark:bg-emerald-500/10">
                        <td colSpan={5} className="px-6 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{group.group}</td>
                      </tr>
                      {group.features.map((feature, fi) => (
                        <tr key={`f-${gi}-${fi}`} className="border-t border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-6 py-3.5 text-sm text-slate-600 dark:text-slate-300">{feature.name}</td>
                          {[feature.starter, feature.pro, feature.wealth, feature.enterprise].map((val, vi) => (
                            <td key={vi} className="px-4 py-3.5 text-center">
                              {typeof val === 'boolean' ? (
                                val ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-slate-300 dark:text-slate-600 text-lg">—</span>
                              ) : (
                                <span className="text-sm text-slate-600 dark:text-slate-300">{val}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
