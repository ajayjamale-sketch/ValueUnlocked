import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Briefcase, Brain, Compass, BookOpen, Users, BarChart3, Zap, Wallet, FileText, Shield, Building2, Check, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const modules = [
  {
    icon: TrendingUp, title: 'Investment Research', color: 'from-emerald-500 to-teal-600',
    desc: 'Deep-dive stock analysis, ETF screening, fundamental valuations, and sector intelligence powered by AI.',
    features: ['AI-powered stock screener', 'DCF & comparable analysis', 'Sector heatmaps', 'Earnings calendar & alerts', 'Watchlist management'],
  },
  {
    icon: Briefcase, title: 'Portfolio Management', color: 'from-blue-500 to-indigo-600',
    desc: 'Track, optimize, and rebalance your investments across all asset classes with real-time analytics.',
    features: ['Real-time portfolio tracking', 'Asset allocation analysis', 'Goal-based investing', 'Rebalancing recommendations', 'Dividend tracking'],
  },
  {
    icon: Zap, title: 'Startup Intelligence', color: 'from-purple-500 to-violet-600',
    desc: 'Evaluate startups with AI-powered scoring, market analysis, and investment readiness assessments.',
    features: ['Startup discovery feed', 'AI investment score', 'Founder & team analysis', 'Market sizing tools', 'Deal pipeline management'],
  },
  {
    icon: Brain, title: 'AI Wealth Advisor', color: 'from-rose-500 to-pink-600',
    desc: 'Your personal AI financial advisor available 24/7 for planning, tax optimization, and strategic guidance.',
    features: ['Personalized wealth plans', 'Tax optimization analysis', 'Retirement simulations', 'Risk management advice', 'Goal tracking'],
  },
  {
    icon: Wallet, title: 'Personal Finance', color: 'from-amber-500 to-orange-600',
    desc: 'Complete money management including budgeting, expense tracking, savings goals, and net worth calculation.',
    features: ['Income & expense tracking', 'Smart budget planning', 'Savings goal progress', 'Debt management', 'Net worth dashboard'],
  },
  {
    icon: Compass, title: 'Opportunity Discovery', color: 'from-cyan-500 to-sky-600',
    desc: 'AI-powered discovery engine that surfaces undervalued assets, emerging sectors, and hidden opportunities.',
    features: ['Undervalued asset screening', 'Emerging sector alerts', 'Opportunity scoring', 'Market trend analysis', 'AI discovery feed'],
  },
  {
    icon: FileText, title: 'Research Marketplace', color: 'from-indigo-500 to-blue-600',
    desc: 'Access premium research from verified analysts, or publish your own reports and build a following.',
    features: ['10,000+ research reports', 'Verified analyst profiles', 'Sector-specific reports', 'Investment newsletters', 'Expert recommendations'],
  },
  {
    icon: Users, title: 'Investor Community', color: 'from-green-500 to-emerald-600',
    desc: 'Connect with serious investors, share ideas, and collaborate with top analysts and wealth managers.',
    features: ['Investment discussion forums', 'Portfolio sharing', 'Expert AMA sessions', 'Investment clubs', 'Idea exchange'],
  },
  {
    icon: BookOpen, title: 'Learning Academy', color: 'from-teal-500 to-cyan-600',
    desc: 'World-class financial education covering value investing, portfolio theory, and business strategy.',
    features: ['100+ premium courses', 'Value investing certification', 'Live workshops', 'Progress tracking', 'Achievement badges'],
  },
  {
    icon: BarChart3, title: 'Wealth Analytics', color: 'from-slate-500 to-gray-600',
    desc: 'Executive-grade analytics dashboard with deep-dive reports on portfolio performance and risk metrics.',
    features: ['Sharpe & Sortino ratios', 'Risk radar analytics', 'Benchmark comparison', 'Custom report builder', 'Data export (CSV/PDF)'],
  },
  {
    icon: Building2, title: 'Business Intelligence', color: 'from-orange-500 to-red-500',
    desc: 'Comprehensive business analysis tools for entrepreneurs, M&A advisors, and strategic consultants.',
    features: ['Business valuation models', 'Competitive intelligence', 'Market opportunity sizing', 'Revenue model analysis', 'Due diligence checklists'],
  },
  {
    icon: Shield, title: 'Admin & Compliance', color: 'from-gray-600 to-slate-700',
    desc: 'Enterprise-grade platform governance with user management, compliance monitoring, and advanced security.',
    features: ['User & role management', 'Advisor verification', 'Compliance audit logs', 'SOC 2 compliance', 'Custom permissions'],
  },
];

export default function Features() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6">Platform Features</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Everything You Need to <span className="text-emerald-400">Build Wealth</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">12 integrated modules covering every aspect of investment research, portfolio management, and wealth intelligence.</p>
          <Link to="/register"><Button className="gradient-growth text-white border-0 px-8 py-3 text-lg">Get Full Access <ArrowRight className="w-5 h-5 ml-2 inline" /></Button></Link>
        </div>
      </section>

      {/* Module Navigator */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar list */}
            <div className="space-y-2">
              {modules.map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <button key={i} onClick={() => setSelected(i)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${selected === i ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-transparent'}`}>
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{mod.title}</span>
                    {selected === i && <ArrowRight className="w-4 h-4 ml-auto" />}
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 p-8 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${modules[selected].color} flex items-center justify-center mb-6`}>
                  {(() => { const Icon = modules[selected].icon; return <Icon className="w-8 h-8 text-white" />; })()}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">{modules[selected].title}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-lg">{modules[selected].desc}</p>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {modules[selected].features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register">
                  <Button className="gradient-growth text-white border-0 gap-2">
                    Try {modules[selected].title} <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid overview */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">All 12 Platform Modules</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(i)}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{mod.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
