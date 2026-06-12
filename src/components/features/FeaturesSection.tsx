import { TrendingUp, Briefcase, Zap, Brain, Wallet, Compass, BookOpen, Users, BarChart3, FileText, Building2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const modules = [
  { icon: TrendingUp, title: 'Investment Research', desc: 'Deep-dive stock, ETF, and sector analysis with AI-powered scorecards and financial statement tools.', href: '/dashboard/research', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Briefcase, title: 'Portfolio Management', desc: 'Track performance, analyze allocation, set goals, and receive AI rebalancing recommendations.', href: '/dashboard/portfolio', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Zap, title: 'Startup Intelligence', desc: 'Evaluate startup opportunities with valuation models, market analysis, and founder assessments.', href: '/dashboard/startups', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Brain, title: 'AI Wealth Advisor', desc: 'Personalized financial planning, retirement modeling, tax optimization, and wealth roadmaps.', href: '/dashboard/ai-advisor', color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
  { icon: Wallet, title: 'Personal Finance', desc: 'Income/expense tracking, budget planning, debt management, and net worth dashboard.', href: '/dashboard/finance', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { icon: BookOpen, title: 'Learning Academy', desc: 'Expert-led courses on value investing, financial literacy, portfolio construction, and more.', href: '/learning-academy', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  { icon: Users, title: 'Investor Community', desc: 'Connect with top investors, share ideas, join expert sessions, and grow your network.', href: '/community', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { icon: FileText, title: 'Research Marketplace', desc: 'Access premium analyst reports, expert recommendations, and sector deep-dives.', href: '/research-marketplace', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { icon: Compass, title: 'Opportunity Discovery', desc: 'AI-driven feed of undervalued stocks, emerging sectors, and franchise opportunities.', href: '/dashboard/opportunities', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { icon: BarChart3, title: 'Wealth Analytics', desc: 'Portfolio analytics, risk metrics, goal tracking, and executive performance reports.', href: '/dashboard/analytics', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { icon: Building2, title: 'Business Intelligence', desc: 'Company valuation, competitive analysis, due diligence tools, and M&A screening.', href: '/features', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Shield, title: 'Admin & Security', desc: 'SOC 2 compliant infrastructure with team management, API access, and audit logs.', href: '/dashboard/settings', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
];

export default function FeaturesSection() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-white dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Platform Modules</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            Everything You Need to<br /><span className="text-gradient-emerald">Build Wealth</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            12 integrated modules covering every aspect of wealth creation, from research to execution to optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <button
                key={i}
                onClick={() => navigate(mod.href)}
                className="group text-left p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy hover:border-emerald-500/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl border mb-4 ${mod.bg}`}>
                  <Icon className={`w-5 h-5 ${mod.color}`} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
