import { useState } from 'react';
import { Zap, TrendingUp, Users, DollarSign, Star, Globe, Search, BookmarkPlus, BarChart3, X, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

const allStartups = [
  { id: '1', name: 'NeuralVault AI', stage: 'Series B', sector: 'AI/ML', valuation: '$420M', mrr: '$1.2M', growth: '+340%', team: 85, score: 94, founded: 2021, country: 'USA', investors: 'a16z, Sequoia', description: 'AI-powered enterprise security platform with 97% threat detection accuracy.', raising: '$80M' },
  { id: '2', name: 'GreenChain Protocol', stage: 'Series A', sector: 'CleanTech', valuation: '$85M', mrr: '$380K', growth: '+180%', team: 42, score: 82, founded: 2022, country: 'EU', investors: 'Breakthrough, Tiger', description: 'Blockchain-based carbon credit verification and trading protocol.', raising: '$25M' },
  { id: '3', name: 'MediCore Diagnostics', stage: 'Seed+', sector: 'HealthTech', valuation: '$28M', mrr: '$95K', growth: '+220%', team: 18, score: 76, founded: 2023, country: 'USA', investors: 'YC, General Catalyst', description: 'Point-of-care AI diagnostics for rural healthcare.', raising: '$8M' },
  { id: '4', name: 'QuantaLedger Finance', stage: 'Series A', sector: 'FinTech', valuation: '$140M', mrr: '$650K', growth: '+290%', team: 61, score: 89, founded: 2021, country: 'UK', investors: 'Index, Balderton', description: 'Real-time treasury management and FX hedging for mid-market companies.', raising: '$40M' },
  { id: '5', name: 'AutoNomics', stage: 'Series B', sector: 'AutoTech', valuation: '$310M', mrr: '$2.1M', growth: '+410%', team: 124, score: 91, founded: 2020, country: 'USA', investors: 'Andreessen, GM Ventures', description: 'Autonomous vehicle fleet management software.', raising: '$60M' },
  { id: '6', name: 'AgroSense', stage: 'Seed', sector: 'AgriTech', valuation: '$18M', mrr: '$45K', growth: '+160%', team: 12, score: 71, founded: 2023, country: 'India', investors: 'Accel India', description: 'IoT precision agriculture for smallholder farmers.', raising: '$4M' },
  { id: '7', name: 'CyberShield Pro', stage: 'Series A', sector: 'CyberSec', valuation: '$95M', mrr: '$420K', growth: '+250%', team: 38, score: 85, founded: 2022, country: 'Israel', investors: 'Team8, Sequoia', description: 'Zero-trust security platform for remote-first enterprises.', raising: '$30M' },
  { id: '8', name: 'SpaceCargo', stage: 'Series B', sector: 'Aerospace', valuation: '$280M', mrr: '$890K', growth: '+380%', team: 96, score: 88, founded: 2020, country: 'USA', investors: 'Lux Capital, SpaceX Alumni Fund', description: 'Last-mile logistics optimization using satellite imagery and AI routing.', raising: '$55M' },
];

const sectors = ['All', 'AI/ML', 'FinTech', 'HealthTech', 'CleanTech', 'AutoTech', 'AgriTech', 'CyberSec', 'Aerospace'];
const stages = ['All Stages', 'Seed', 'Seed+', 'Series A', 'Series B', 'Series C'];

const sectorColors: Record<string, string> = {
  'AI/ML': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  'CleanTech': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'HealthTech': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  'FinTech': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'AutoTech': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  'AgriTech': 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400',
  'CyberSec': 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400',
  'Aerospace': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400',
};

export default function StartupIntelligence() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [stage, setStage] = useState('All Stages');
  const [saved, setSaved] = useState<string[]>(['1']);
  const [selected, setSelected] = useState<typeof allStartups[0] | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'valuation' | 'growth'>('score');

  // Express Interest Form States
  const [expressingInterest, setExpressingInterest] = useState(false);
  const [interestSubmitting, setInterestSubmitting] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [interestForm, setInterestForm] = useState({ name: '', email: '', amount: '$50k - $250k', message: '' });

  const handleOpenDetail = (startup: typeof allStartups[0]) => {
    const user = getStoredUser();
    if (!user) {
      toast.info('Please sign in to view deep dive details.');
      navigate('/login');
      return;
    }
    setSelected(startup);
    setExpressingInterest(false);
    setInterestSubmitted(false);
    setInterestSubmitting(false);
    setInterestForm({
      name: user.name || '',
      email: user.email || '',
      amount: '$50k - $250k',
      message: `I am interested in learning more about ${startup.name}’s ${startup.stage} round.`
    });
  };

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestForm.name || !interestForm.email) {
      toast.error('Please fill in required fields.');
      return;
    }
    setInterestSubmitting(true);
    setTimeout(() => {
      setInterestSubmitting(false);
      setInterestSubmitted(true);
      toast.success(`Expression of interest submitted for ${selected?.name}!`);
    }, 1200);
  };

  const filtered = allStartups
    .filter(s =>
      (sector === 'All' || s.sector === sector) &&
      (stage === 'All Stages' || s.stage === stage) &&
      (!query || s.name.toLowerCase().includes(query.toLowerCase()) || s.sector.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'growth') return parseInt(b.growth) - parseInt(a.growth);
      return parseInt(b.valuation.replace(/[^0-9]/g, '')) - parseInt(a.valuation.replace(/[^0-9]/g, ''));
    });

  const toggleSave = (id: string, name: string) => {
    const user = getStoredUser();
    if (!user) {
      toast.info('Please sign in to save deals to your pipeline.');
      navigate('/login');
      return;
    }
    setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    toast.success(saved.includes(id) ? `Removed ${name} from saved` : `${name} saved to pipeline`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 text-left" onClick={e => e.stopPropagation()}>
            
            {expressingInterest ? (
              interestSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 gradient-growth rounded-2xl flex items-center justify-center mb-4 text-white">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Interest Expressed!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
                    Your request has been securely logged. The founding team of {selected.name} and your assigned ValueUnlocked representative will reach out to you within 24 hours.
                  </p>
                  <Button className="gradient-growth text-white border-0 text-sm px-6" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitInterest} className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Express Interest: {selected.name}</h3>
                    <button type="button" onClick={() => setExpressingInterest(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Full Name</label>
                    <Input
                      type="text"
                      required
                      value={interestForm.name}
                      onChange={e => setInterestForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                      className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address</label>
                    <Input
                      type="email"
                      required
                      value={interestForm.email}
                      onChange={e => setInterestForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Planned Allocation</label>
                    <select
                      value={interestForm.amount}
                      onChange={e => setInterestForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-xs"
                    >
                      <option>$10k - $50k</option>
                      <option>$50k - $250k</option>
                      <option>$250k - $1M</option>
                      <option>$1M+</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Investment Thesis / Questions</label>
                    <textarea
                      value={interestForm.message}
                      onChange={e => setInterestForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-xs resize-none focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-3">
                    <Button type="button" variant="ghost" disabled={interestSubmitting} onClick={() => setExpressingInterest(false)} className="text-xs">
                      Back
                    </Button>
                    <Button type="submit" disabled={interestSubmitting} className="gradient-growth text-white border-0 text-xs flex items-center gap-1.5">
                      {interestSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Expression'
                      )}
                    </Button>
                  </div>
                </form>
              )
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selected.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs border-0 ${sectorColors[selected.sector] || 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>{selected.sector}</Badge>
                      <span className="text-xs text-slate-400">{selected.stage} · {selected.country}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selected.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Valuation', value: selected.valuation },
                    { label: 'MRR', value: selected.mrr },
                    { label: 'Growth', value: selected.growth, color: 'text-emerald-500' },
                    { label: 'Team', value: `${selected.team}` },
                    { label: 'Founded', value: selected.founded.toString() },
                    { label: 'AI Score', value: `${selected.score}/100`, color: 'text-emerald-500' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                      <p className={`text-sm font-bold ${(item as any).color || 'text-slate-800 dark:text-white'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Current Round</p>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selected.raising}</p>
                    </div>
                    <p className="text-xs text-slate-400">Investors: {selected.investors}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gradient-growth text-white border-0 text-sm" onClick={() => setExpressingInterest(true)}>
                    Express Interest
                  </Button>
                  <Button variant="outline" className="text-sm" onClick={() => { toggleSave(selected.id, selected.name); setSelected(null); }}>
                    {saved.includes(selected.id) ? 'Unsave' : 'Save Deal'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <section className="bg-navy pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0f2d1f] to-navy opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5 animate-pulse-slow">Startup Intelligence</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Discover the Next <span className="text-gradient-emerald">Unicorn</span></h1>
          <p className="text-slate-300 text-lg mb-8">AI-powered startup discovery and evaluation platform. Access 10,000+ vetted startups with investment readiness scores.</p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[{ v: '10,000+', l: 'Startups Tracked' }, { v: '$2.4B', l: 'Deals Facilitated' }, { v: '68%', l: 'Success Rate' }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{s.v}</p>
                <p className="text-slate-400 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Search startups..." />
              </div>
              <select value={stage} onChange={e => setStage(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-sm">
                {stages.map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-sm">
                <option value="score">Sort: AI Score</option>
                <option value="growth">Sort: Growth Rate</option>
                <option value="valuation">Sort: Valuation</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap">
              {sectors.map(s => (
                <button key={s} onClick={() => setSector(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sector === s ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-slate-400">{filtered.length} startups found · {saved.length} saved</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map(s => (
              <div key={s.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 hover:border-emerald-500/30 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-white">{s.name}</h3>
                      <Badge className={`text-xs border-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400`}>{s.stage}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs border-0 ${sectorColors[s.sector] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{s.sector}</Badge>
                      <span className="text-xs text-slate-400">{s.country} · Est. {s.founded}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-emerald-500">{s.score}</p>
                    <p className="text-xs text-slate-400">AI Score</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{s.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[{ label: 'Valuation', value: s.valuation }, { label: 'Growth', value: s.growth, color: 'text-emerald-500' }, { label: 'MRR', value: s.mrr }].map((m, i) => (
                    <div key={i} className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                      <p className={`text-sm font-bold ${(m as any).color || 'text-slate-800 dark:text-white'}`}>{m.value}</p>
                      <p className="text-xs text-slate-400">{m.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{s.team} people · {s.investors}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleSave(s.id, s.name)} className={`p-1.5 rounded-lg transition-colors ${saved.includes(s.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300 hover:text-amber-400'}`}>
                      <Star className="w-4 h-4" fill={saved.includes(s.id) ? 'currentColor' : 'none'} />
                    </button>
                    <Button size="sm" className="text-xs gradient-growth text-white border-0 h-8" onClick={() => handleOpenDetail(s)}>
                      Deep Dive
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No startups match your filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
