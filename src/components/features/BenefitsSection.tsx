import { CheckCircle2, User, BarChart2, Rocket, Target } from 'lucide-react';

const benefitGroups = [
  {
    role: 'Individual Investors',
    Icon: User,
    color: 'emerald',
    metrics: ['+24.7% avg. annual return', '73% opportunity accuracy', '3.2x vs. S&P benchmark'],
    benefits: ['AI-curated watchlists updated daily', 'Plain-language financial analysis', 'Goal-based portfolio tracking', 'Tax-loss harvesting alerts'],
  },
  {
    role: 'Value Investors',
    Icon: BarChart2,
    color: 'blue',
    metrics: ['Graham Number calculator', 'Deep value screener', 'FCF yield analysis'],
    benefits: ['Intrinsic value calculations', 'Margin of safety scoring', 'Financial health X-ray', 'Management quality ratings'],
  },
  {
    role: 'Startup Investors',
    Icon: Rocket,
    color: 'purple',
    metrics: ['2 unicorns identified pre-C', '156% avg. VC portfolio ROI', 'Deal flow of 500+/month'],
    benefits: ['Investment readiness scoring', 'Comparable exit multiples', 'Founder track record analysis', 'Market TAM modeling'],
  },
  {
    role: 'Advisors & Analysts',
    Icon: Target,
    color: 'gold',
    metrics: ['20+ hrs saved weekly', '94% client satisfaction', '$500K+ new AUM sourced'],
    benefits: ['White-label report generation', 'Multi-client portfolio view', 'Research collaboration tools', 'Compliance-ready outputs'],
  },
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5',
  blue: 'border-blue-500/30 bg-blue-50 dark:bg-blue-500/5',
  purple: 'border-purple-500/30 bg-purple-50 dark:bg-purple-500/5',
  gold: 'border-gold-500/30 bg-gold-50 dark:bg-gold-500/5',
};

const textMap: Record<string, string> = {
  emerald: 'text-emerald-600 dark:text-emerald-400',
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  gold: 'text-gold-600 dark:text-gold-400',
};

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Built For You</span>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Proven Results for Every <span className="text-gradient-emerald">Investor Type</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you are a first-time investor or a seasoned wealth manager, ValueUnlocked delivers measurable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefitGroups.map((group, i) => {
            const GroupIcon = group.Icon;
            return (
              <div key={i} className={`rounded-2xl border p-8 ${colorMap[group.color]}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${group.color === 'emerald' ? 'bg-emerald-500/20' : group.color === 'blue' ? 'bg-blue-500/20' : group.color === 'purple' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}>
                    <GroupIcon className={`w-6 h-6 ${textMap[group.color]}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${textMap[group.color]}`}>{group.role}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.metrics.map((m, j) => (
                        <span key={j} className="text-xs font-semibold bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {group.benefits.map((b, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${textMap[group.color]}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
