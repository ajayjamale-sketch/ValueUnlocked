import { User, Search, BarChart2, DollarSign, Activity, Settings2, TrendingUp } from 'lucide-react';

const steps = [
  { icon: User, label: 'Create Profile', desc: 'Set your risk tolerance, goals, and investment style', color: 'bg-emerald-500' },
  { icon: Search, label: 'Research', desc: 'Analyze stocks, sectors, startups, and opportunities', color: 'bg-blue-500' },
  { icon: BarChart2, label: 'Analyze', desc: 'Deep-dive with AI-powered financial intelligence', color: 'bg-purple-500' },
  { icon: DollarSign, label: 'Invest', desc: 'Execute decisions with confidence and conviction', color: 'bg-gold-500' },
  { icon: Activity, label: 'Track', desc: 'Monitor performance vs. benchmarks in real-time', color: 'bg-rose-500' },
  { icon: Settings2, label: 'Optimize', desc: 'Rebalance, reduce risk, and maximize returns', color: 'bg-teal-500' },
  { icon: TrendingUp, label: 'Grow Wealth', desc: 'Compound returns and achieve financial freedom', color: 'gradient-wealth' },
];

export default function WorkflowSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Your Journey</span>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            From Research to <span className="text-gradient-emerald">Lasting Wealth</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">A proven 7-step framework followed by top investors worldwide.</p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-12 left-[7%] right-[7%] h-0.5 bg-gradient-to-r from-emerald-500 via-purple-500 to-gold-500 opacity-30" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-800 dark:bg-[#020617] border-2 border-white dark:border-navy flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1.5">{step.label}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
