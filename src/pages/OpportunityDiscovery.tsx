import { useState } from 'react';
import { Compass, TrendingUp, Zap, Building2, Globe, Filter, Star, BookmarkPlus, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { opportunities } from '@/lib/mockData';
import OpportunityCard from '@/components/features/OpportunityCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const trendingThemes = [
  { name: 'AI Infrastructure', change: '+65%', icon: Zap, color: 'from-purple-500 to-violet-600' },
  { name: 'India Markets', change: '+45%', icon: Globe, color: 'from-emerald-500 to-teal-600' },
  { name: 'Healthcare REITs', change: '+22%', icon: Building2, color: 'from-red-500 to-rose-600' },
  { name: 'Dividend Growth', change: '+18%', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
];

const types = ['All', 'Stock', 'Sector', 'Startup', 'Acquisition', 'Franchise'];
const risks = ['All Risks', 'Low', 'Medium', 'High'];

export default function OpportunityDiscovery() {
  const [type, setType] = useState('All');
  const [risk, setRisk] = useState('All Risks');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  const filtered = opportunities.filter(o => {
    const typeMatch = type === 'All' || o.type.toLowerCase() === type.toLowerCase();
    const riskMatch = risk === 'All Risks' || o.risk.toLowerCase() === risk.toLowerCase();
    const queryMatch = !query || o.title.toLowerCase().includes(query.toLowerCase());
    return typeMatch && riskMatch && queryMatch;
  });

  const handleSave = (id: string, title: string) => {
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    toast.success(saved.includes(id) ? `Removed from saved` : `${title} saved to watchlist`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">Opportunity Discovery</span>
          <h1 className="text-4xl font-bold text-white mb-4">Find <span className="text-emerald-400">Hidden Value</span> Before the Market</h1>
          <p className="text-slate-300 text-lg mb-8">Our AI screens 50,000+ assets daily to surface undervalued opportunities, emerging sectors, and high-conviction investment ideas.</p>
          <div className="relative max-w-xl mx-auto">
            <Compass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-base" placeholder="Search opportunities..." />
          </div>
        </div>
      </section>

      {/* Trending Themes */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-white mb-5">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Trending Themes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingThemes.map((theme, i) => {
              const Icon = theme.icon;
              return (
                <div key={i} className={`bg-gradient-to-br ${theme.color} rounded-xl p-5 cursor-pointer hover:scale-105 transition-transform`} onClick={() => { setType('Sector'); toast.info(`Filtering by ${theme.name}`); }}>
                  <Icon className="w-6 h-6 text-white mb-3" />
                  <p className="text-white font-bold text-sm">{theme.name}</p>
                  <p className="text-white/80 text-xs mt-1">Potential: {theme.change}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <div className="flex gap-2 flex-wrap">
              {types.map(t => (
                <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${type === t ? 'gradient-growth text-white' : 'bg-white dark:bg-navy border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              {risks.map(r => (
                <button key={r} onClick={() => setRisk(r)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${risk === r ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-800' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(opp => (
              <div key={opp.id} className="relative group">
                <OpportunityCard opportunity={opp} onAction={() => toast.success(`Added ${opp.title} to watchlist!`)} />
                <button
                  onClick={() => handleSave(opp.id, opp.title)}
                  className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${saved.includes(opp.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300 opacity-0 group-hover:opacity-100 hover:text-amber-400 bg-white dark:bg-navy shadow-sm'}`}
                >
                  <Star className="w-4 h-4" fill={saved.includes(opp.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No opportunities match your filters.</p>
            </div>
          )}

          <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">Unlock Full AI Opportunity Discovery</h3>
            <p className="text-slate-300 text-sm mb-5">Get access to 500+ opportunities, real-time AI scoring, and portfolio integration.</p>
            <Link to="/register"><Button className="gradient-growth text-white border-0 gap-2">Start Free Trial <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
