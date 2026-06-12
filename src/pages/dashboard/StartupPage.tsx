import { useState } from 'react';
import { Zap, TrendingUp, Users, DollarSign, Star, X, Globe, Building2, BookmarkPlus, BarChart3, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { startupPortfolio } from '@/lib/mockData';
import { getStoredUser } from '@/lib/auth';

const startups = [
  { name: 'NeuralVault AI', stage: 'Series B', sector: 'AI/ML', valuation: '$420M', mrr: '$1.2M', growth: '+340%', team: 85, score: 94, founded: 2021, country: 'USA', investors: 'a16z, Sequoia', description: 'AI-powered enterprise security platform with 97% threat detection accuracy.', raising: '$80M', minTicket: '$250K' },
  { name: 'GreenChain Protocol', stage: 'Series A', sector: 'CleanTech', valuation: '$85M', mrr: '$380K', growth: '+180%', team: 42, score: 82, founded: 2022, country: 'EU', investors: 'Breakthrough, Tiger', description: 'Blockchain-based carbon credit verification and trading protocol.', raising: '$25M', minTicket: '$100K' },
  { name: 'MediCore Diagnostics', stage: 'Seed+', sector: 'HealthTech', valuation: '$28M', mrr: '$95K', growth: '+220%', team: 18, score: 76, founded: 2023, country: 'USA', investors: 'YC, General Catalyst', description: 'Point-of-care diagnostic device with AI-assisted diagnosis for rural healthcare.', raising: '$8M', minTicket: '$25K' },
  { name: 'QuantaLedger Finance', stage: 'Series A', sector: 'FinTech', valuation: '$140M', mrr: '$650K', growth: '+290%', team: 61, score: 89, founded: 2021, country: 'UK', investors: 'Index, Balderton', description: 'Real-time treasury management and FX hedging platform for mid-market companies.', raising: '$40M', minTicket: '$150K' },
  { name: 'AutoNomics', stage: 'Series B', sector: 'AutoTech', valuation: '$310M', mrr: '$2.1M', growth: '+410%', team: 124, score: 91, founded: 2020, country: 'USA', investors: 'Andreessen, GM Ventures', description: 'Autonomous vehicle fleet management software powering 12,000 vehicles.', raising: '$60M', minTicket: '$500K' },
  { name: 'AgroSense', stage: 'Seed', sector: 'AgriTech', valuation: '$18M', mrr: '$45K', growth: '+160%', team: 12, score: 71, founded: 2023, country: 'India', investors: 'Accel India', description: 'IoT-based precision agriculture platform for smallholder farmers.', raising: '$4M', minTicket: '$15K' },
];

const sectorColors: Record<string, string> = {
  'AI/ML': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  'CleanTech': 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'HealthTech': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
  'FinTech': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'AutoTech': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  'AgriTech': 'bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400',
};

const stageColors: Record<string, string> = {
  'Seed': 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300',
  'Seed+': 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300',
  'Series A': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'Series B': 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  'Series C': 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400',
  'Pre-Seed': 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400',
};

export default function StartupPage() {
  const user = getStoredUser();
  const isStartupInvestor = user?.role === 'startup_investor' || user?.role === 'investor';
  const isEntrepreneur = user?.role === 'entrepreneur';

  const [activeTab, setActiveTab] = useState<'discover' | 'portfolio'>(isEntrepreneur ? 'portfolio' : 'discover');
  const [selected, setSelected] = useState<typeof startups[0] | null>(null);
  const [sectorFilter, setSectorFilter] = useState('All');
  const [savedList, setSavedList] = useState<string[]>(['NeuralVault AI']);
  const [query, setQuery] = useState('');

  const [portfolioList, setPortfolioList] = useState(startupPortfolio);
  
  const [businessValuation, setBusinessValuation] = useState('$12.4M');
  const [monthlyRevenue, setMonthlyRevenue] = useState('$142K');
  const [runway, setRunway] = useState('18 months');
  const [burnRate, setBurnRate] = useState('$48K/mo');

  const [showAddInv, setShowAddInv] = useState(false);
  const [newInv, setNewInv] = useState({ name: '', stage: 'Seed', sector: 'AI/ML', invested: '', currentValue: '', ownership: '', status: 'growing' });
  const [addingInv, setAddingInv] = useState(false);

  const [showUpdateMetrics, setShowUpdateMetrics] = useState(false);
  const [metricsForm, setMetricsForm] = useState({ valuation: '12.4', revenue: '142', runway: '18', burn: '48' });

  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [deckSlideIdx, setDeckSlideIdx] = useState<number | null>(null);

  const [showReadiness, setShowReadiness] = useState(false);
  const [readinessAnswers, setReadinessAnswers] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false, 3: false, 4: false });
  const [readinessScore, setReadinessScore] = useState<number | null>(null);

  const [showCoFounders, setShowCoFounders] = useState(false);

  const sectors = ['All', ...Array.from(new Set(startups.map(s => s.sector)))];
  const filtered = startups.filter(s =>
    (sectorFilter === 'All' || s.sector === sectorFilter) &&
    (s.name.toLowerCase().includes(query.toLowerCase()) || s.sector.toLowerCase().includes(query.toLowerCase()))
  );

  const toggleSave = (name: string) => {
    setSavedList(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    toast.success(savedList.includes(name) ? `Removed ${name} from saved` : `Saved ${name} to pipeline`);
  };

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInv.name || !newInv.invested || !newInv.currentValue) {
      return toast.error('Please fill in Name, Invested Capital, and Current Value');
    }
    const investedNum = parseFloat(newInv.invested);
    const currentNum = parseFloat(newInv.currentValue);
    if (isNaN(investedNum) || isNaN(currentNum) || investedNum <= 0 || currentNum <= 0) {
      return toast.error('Please enter valid positive numbers');
    }

    setAddingInv(true);
    setTimeout(() => {
      const returnPct = ((currentNum - investedNum) / investedNum * 100).toFixed(0);
      const added = {
        id: Date.now().toString(),
        name: newInv.name,
        stage: newInv.stage,
        sector: newInv.sector,
        invested: investedNum,
        currentValue: currentNum,
        return: `${parseFloat(returnPct) >= 0 ? '+' : ''}${returnPct}%`,
        ownership: newInv.ownership ? `${newInv.ownership}%` : '1.5%',
        status: newInv.status as any
      };
      setPortfolioList(prev => [added, ...prev]);
      setNewInv({ name: '', stage: 'Seed', sector: 'AI/ML', invested: '', currentValue: '', ownership: '', status: 'growing' });
      setShowAddInv(false);
      setAddingInv(false);
      toast.success(`Registered VC Investment in ${added.name}`);
    }, 800);
  };

  const handleUpdateMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessValuation(`$${parseFloat(metricsForm.valuation).toFixed(1)}M`);
    setMonthlyRevenue(`$${parseFloat(metricsForm.revenue).toFixed(0)}K`);
    setRunway(`${metricsForm.runway} months`);
    setBurnRate(`$${parseFloat(metricsForm.burn).toFixed(0)}K/mo`);
    setShowUpdateMetrics(false);
    toast.success('Business intelligence metrics updated successfully.');
  };

  const handleGeneratePitchDeck = () => {
    setGeneratingDeck(true);
    setTimeout(() => {
      setGeneratingDeck(false);
      setDeckSlideIdx(0);
      toast.success('Investor pitch deck generated!');
    }, 1500);
  };

  const handleReadinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkedCount = Object.values(readinessAnswers).filter(Boolean).length;
    const score = Math.round((checkedCount / 5) * 100);
    setReadinessScore(score);
  };

  const downloadPitchDeckFile = () => {
    const textContent = `ValueUnlocked AI Pitch Deck Outline\nCompany: Rivera Tech Corp\nTarget Raise: $2.5M Series A\n\nSlide 1: Problem & Solution\n- Legacy solutions are slow and unsecure.\n- Rivera Platform reduces processing times by 80%.\n\nSlide 2: Market Size\n- Total Addressable Market (TAM): $45B\n- Serviceable Obtainable Market (SOM): $2.2B\n\nSlide 3: Financial Projections\n- Year 1: $1.2M ARR\n- Year 2: $4.5M ARR\n- Year 3: $14.2M ARR\n\nCreated using ValueUnlocked AI Wealth Platform.`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rivera_tech_pitch_deck_draft.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Pitch deck downloaded successfully!');
  };

  const deckSlides = [
    { title: 'Slide 1: Problem & Solution', bullet1: 'Legacy software platforms are slow and insecure', bullet2: 'Rivera Platform accelerates treasury tasks by 82%', bullet3: 'Zero-trust security protocol guarantees data safety' },
    { title: 'Slide 2: Market Size & Target Focus', bullet1: 'Total Addressable Market (TAM): $45B globally', bullet2: 'Serviceable Addressable Market (SAM): $15B', bullet3: 'Initial Serviceable Obtainable Market (SOM): $2.2B mid-market' },
    { title: 'Slide 3: Financial Projections (3Y Plan)', bullet1: 'Year 1 (Current): $1.2M ARR reached', bullet2: 'Year 2 (Projected): $4.8M ARR (4x growth)', bullet3: 'Year 3 (Projected): $14.5M ARR with positive cashflow' }
  ];

  return (
    <div className="space-y-6">
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{selected.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs border-0 ${sectorColors[selected.sector] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{selected.sector}</Badge>
                  <Badge className={`text-xs border-0 ${stageColors[selected.stage] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{selected.stage}</Badge>
                  <span className="text-xs text-slate-400">{selected.country}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Valuation', value: selected.valuation },
                { label: 'MRR', value: selected.mrr },
                { label: 'YoY Growth', value: selected.growth, color: 'text-emerald-500' },
                { label: 'Team Size', value: `${selected.team} people` },
                { label: 'Founded', value: selected.founded.toString() },
                { label: 'AI Score', value: `${selected.score}/100`, color: 'text-purple-500' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-sm font-bold ${(item as any).color || 'text-slate-800 dark:text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Current Round</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selected.raising}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Min. Ticket</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selected.minTicket}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-medium">Key investors: {selected.investors}</p>
            <div className="flex gap-2">
              <Button className="flex-1 gradient-growth text-white border-0" onClick={() => { toast.success(`Investment interest submitted for ${selected.name}`); setSelected(null); }}>
                Express Interest
              </Button>
              <Button variant="outline" onClick={() => { toggleSave(selected.name); setSelected(null); }}>
                <BookmarkPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Size', value: `${startups.length} startups`, icon: Zap, color: 'text-purple-400' },
          { label: 'Avg. Valuation', value: '$168M', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Avg. Growth Rate', value: '+267% YoY', icon: TrendingUp, color: 'text-blue-400' },
          { label: 'Saved Deals', value: savedList.length.toString(), icon: Star, color: 'text-amber-400' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {[
          { id: 'discover', label: 'Discover Startups' },
          { id: 'portfolio', label: isEntrepreneur ? 'My Business' : 'My Portfolio' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'discover' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Search startups by name or sector..." />
            </div>
            <div className="flex gap-2 flex-wrap">
              {sectors.map(s => (
                <button key={s} onClick={() => setSectorFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${sectorFilter === s ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((s, i) => (
              <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 hover:border-purple-500/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-white">{s.name}</h3>
                      <Badge className={`border-0 text-xs ${stageColors[s.stage] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{s.stage}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`border-0 text-xs ${sectorColors[s.sector] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{s.sector}</Badge>
                      <span className="text-xs text-slate-400">{s.country} · Est. {s.founded}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-purple-500">{s.score}</p>
                    <p className="text-xs text-slate-400">AI Score</p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{s.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{s.valuation}</p>
                    <p className="text-xs text-slate-400">Valuation</p>
                  </div>
                  <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                    <p className="text-sm font-bold text-emerald-500">{s.growth}</p>
                    <p className="text-xs text-slate-400">Growth</p>
                  </div>
                  <div className="text-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-lg">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{s.mrr}</p>
                    <p className="text-xs text-slate-400">MRR</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{s.team} employees · {s.investors}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleSave(s.name)} className={`p-1.5 rounded-lg transition-colors ${savedList.includes(s.name) ? 'text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300 hover:text-amber-400'}`}>
                      <Star className="w-4 h-4" fill={savedList.includes(s.name) ? 'currentColor' : 'none'} />
                    </button>
                    <Button size="sm" className="text-xs gradient-growth text-white border-0 h-8" onClick={() => setSelected(s)}>
                      Deep Dive
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'portfolio' && !isEntrepreneur && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-white">Startup Portfolio</h3>
              <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs gap-1" onClick={() => setShowAddInv(true)}>
                + Add Investment
              </Button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {portfolioList.map((s, i) => (
                <div key={i} className="flex flex-col xl:flex-row justify-between xl:items-center px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className={`text-[10px] border-0 ${stageColors[s.stage] || 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>{s.stage}</Badge>
                        <span className="text-xs text-slate-400">{s.sector}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-between xl:justify-end flex-1 w-full">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Invested</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">${s.invested.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Current Value</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">${s.currentValue.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Return</p>
                      <p className={`text-sm font-bold ${s.return.startsWith('+') ? 'text-emerald-500' : s.return.startsWith('-') ? 'text-red-500' : 'text-slate-400'}`}>{s.return}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-slate-400">Ownership</p>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{s.ownership}</p>
                    </div>
                    <Badge className={`text-xs border-0 ${s.status === 'growing' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : s.status === 'at-risk' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>{s.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-emerald-500" onClick={() => {
                      const found = startups.find(start => start.name === s.name);
                      if (found) setSelected(found as any);
                      else toast.info(`Detailed logs are active for ${s.name}`);
                    }}>View</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && isEntrepreneur && (
        <div className="space-y-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-emerald-400 font-bold mb-1">Your Business Dashboard</h3>
              <p className="text-slate-400 text-sm">Track your business metrics, milestones, and investor readiness.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowReadiness(true)}>Readiness Assessment</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowCoFounders(true)}>Co-Founder Directory</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Business Valuation', value: businessValuation, color: 'text-emerald-400' },
              { label: 'Monthly Revenue', value: monthlyRevenue, color: 'text-blue-400' },
              { label: 'Runway', value: runway, color: 'text-purple-400' },
              { label: 'Burn Rate', value: burnRate, color: 'text-amber-400' }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Update Business Metrics', desc: 'Add latest MRR, team size, runway figures', action: 'Update Now', click: () => setShowUpdateMetrics(true) },
              { title: 'Generate Pitch Deck', desc: 'AI-powered investor pitch deck generator', action: 'Generate', click: handleGeneratePitchDeck },
              { title: 'Investor Readiness Score', desc: 'Get your fundraising readiness assessment', action: 'Assess Now', click: () => setShowReadiness(true) },
              { title: 'Find Co-Founders', desc: 'Connect with experienced entrepreneurs', action: 'Search', click: () => setShowCoFounders(true) },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
                </div>
                <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs w-full sm:w-auto" onClick={item.click} disabled={generatingDeck && item.action === 'Generate'}>
                  {generatingDeck && item.action === 'Generate' ? 'Generating...' : item.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddInv && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Venture Investment</h2>
              <button onClick={() => setShowAddInv(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddInvestment} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Startup Name</label>
                <Input value={newInv.name} onChange={e => setNewInv(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Acme Tech" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Stage</label>
                  <select value={newInv.stage} onChange={e => setNewInv(p => ({ ...p, stage: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                    {['Pre-Seed', 'Seed', 'Seed+', 'Series A', 'Series B', 'Series C'].map(stg => <option key={stg}>{stg}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sector</label>
                  <select value={newInv.sector} onChange={e => setNewInv(p => ({ ...p, sector: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                    {['AI/ML', 'CleanTech', 'HealthTech', 'FinTech', 'AutoTech', 'AgriTech', 'Aerospace'].map(sec => <option key={sec}>{sec}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Invested Capital ($)</label>
                  <Input type="number" value={newInv.invested} onChange={e => setNewInv(p => ({ ...p, invested: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Current Valuation ($)</label>
                  <Input type="number" value={newInv.currentValue} onChange={e => setNewInv(p => ({ ...p, currentValue: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Ownership (%)</label>
                  <Input type="number" step="0.1" value={newInv.ownership} onChange={e => setNewInv(p => ({ ...p, ownership: e.target.value }))} placeholder="e.g. 2.1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Status</label>
                  <select value={newInv.status} onChange={e => setNewInv(p => ({ ...p, status: e.target.value }))} className="w-full text-xs h-10 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-lg px-2 text-slate-700 dark:text-slate-300">
                    {['growing', 'stable', 'at-risk'].map(stat => <option key={stat}>{stat}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setShowAddInv(false)} disabled={addingInv}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit" disabled={addingInv}>
                  {addingInv ? 'Saving...' : 'Add Investment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateMetrics && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Update Business Metrics</h2>
              <button onClick={() => setShowUpdateMetrics(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleUpdateMetrics} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Business Valuation ($M)</label>
                <Input type="number" step="0.1" value={metricsForm.valuation} onChange={e => setMetricsForm(p => ({ ...p, valuation: e.target.value }))} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Monthly MRR ($K)</label>
                <Input type="number" value={metricsForm.revenue} onChange={e => setMetricsForm(p => ({ ...p, revenue: e.target.value }))} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Runway (Months)</label>
                  <Input type="number" value={metricsForm.runway} onChange={e => setMetricsForm(p => ({ ...p, runway: e.target.value }))} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">Burn Rate ($K/Mo)</label>
                  <Input type="number" value={metricsForm.burn} onChange={e => setMetricsForm(p => ({ ...p, burn: e.target.value }))} required />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" type="button" onClick={() => setShowUpdateMetrics(false)}>Cancel</Button>
                <Button className="gradient-growth text-white border-0" type="submit">Update Metrics</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deckSlideIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">AI-Generated Pitch Deck Preview</h2>
              <button onClick={() => setDeckSlideIdx(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="bg-slate-900 border border-white/10 rounded-xl p-8 text-white min-h-60 flex flex-col justify-between mb-4 relative overflow-hidden">
              <div className="absolute top-2 right-3 text-[10px] text-slate-400">Slide {deckSlideIdx + 1} of 3</div>
              <div className="space-y-4">
                <h3 className="text-emerald-400 text-lg font-bold tracking-tight border-b border-white/10 pb-2">{deckSlides[deckSlideIdx].title}</h3>
                <ul className="text-xs space-y-2.5 text-slate-300">
                  <li className="flex items-start gap-1.5"><span>•</span> <span>{deckSlides[deckSlideIdx].bullet1}</span></li>
                  <li className="flex items-start gap-1.5"><span>•</span> <span>{deckSlides[deckSlideIdx].bullet2}</span></li>
                  <li className="flex items-start gap-1.5"><span>•</span> <span>{deckSlides[deckSlideIdx].bullet3}</span></li>
                </ul>
              </div>
              <div className="flex justify-between items-center mt-6 border-t border-white/5 pt-3">
                <Button size="xs" variant="ghost" className="text-xs text-slate-400" onClick={() => setDeckSlideIdx(prev => prev !== null && prev > 0 ? prev - 1 : 0)} disabled={deckSlideIdx === 0}>
                  <ChevronLeft className="w-4 h-4 mr-0.5" /> Back
                </Button>
                <Button size="xs" variant="ghost" className="text-xs text-slate-400" onClick={() => setDeckSlideIdx(prev => prev !== null && prev < 2 ? prev + 1 : 2)} disabled={deckSlideIdx === 2}>
                  Next <ChevronRight className="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-between">
              <Button variant="outline" size="sm" onClick={downloadPitchDeckFile}>Download TXT Outline</Button>
              <Button className="gradient-growth text-white border-0 size-sm" onClick={() => setDeckSlideIdx(null)}>Close Viewer</Button>
            </div>
          </div>
        </div>
      )}

      {showReadiness && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Fundraising Readiness Assessment</h2>
                <p className="text-xs text-slate-400 mt-0.5">Determine how prepared your business is to seek capital</p>
              </div>
              <button onClick={() => { setShowReadiness(false); setReadinessScore(null); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            {readinessScore !== null ? (
              <div className="text-center py-6 space-y-4">
                <div className="inline-block p-4 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl font-extrabold">{readinessScore}%</div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                    {readinessScore >= 80 ? 'Fundraising Ready' : readinessScore >= 60 ? 'Moderate Readiness' : 'Needs Preparation'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    {readinessScore >= 80 ? 'Your business indicators are extremely strong. VCs will highly evaluate your growth, unit economics, and team structure.' : readinessScore >= 60 ? 'You are on the right track, but trimming operations, securing IP, or clarifying channels is advised.' : 'Fundraising is not recommended yet. Prioritize product-market fit, sales channels, and core staff.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Button className="gradient-growth text-white border-0 size-sm" onClick={() => setReadinessScore(null)}>Re-Assess</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReadinessSubmit} className="space-y-4">
                {[
                  'Do you have clear Product-Market Fit with active customers?',
                  'Is monthly churn below 2% (or customer retention high)?',
                  'Is the management team complete (Tech, Product, Sales)?',
                  'Do you own proprietary IP or unique technology barriers?',
                  'Are customer acquisition channels clear and profitable?'
                ].map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 hover:bg-slate-100/50">
                    <input
                      type="checkbox"
                      id={`ready-q-${idx}`}
                      checked={!!readinessAnswers[idx]}
                      onChange={e => setReadinessAnswers(p => ({ ...p, [idx]: e.target.checked }))}
                      className="mt-1 accent-emerald-500 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor={`ready-q-${idx}`} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed cursor-pointer font-medium select-none">{q}</label>
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" type="button" onClick={() => setShowReadiness(false)}>Close</Button>
                  <Button className="gradient-growth text-white border-0" type="submit">Submit Assessment</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showCoFounders && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Co-Founder Matchmaking</h2>
                <p className="text-xs text-slate-400 mt-0.5">Experienced candidates open to joining early stage ventures</p>
              </div>
              <button onClick={() => setShowCoFounders(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[
                { name: 'Alice Johnson', role: 'CTO / AI Engineer', bio: 'Ex-Google Brain, ML team lead. 8+ years building enterprise neural architectures.', skills: ['Python', 'PyTorch', 'TensorFlow', 'Scalability'] },
                { name: 'Siddharth Patel', role: 'CMO / Growth Hacker', bio: 'Ex-Stripe Growth manager. Engineered user acquisition loops from 1M to 10M active.', skills: ['SEO', 'Funnel Optimization', 'Ad Tech', 'B2B Sales'] },
                { name: 'Charles Vance', role: 'CFO / Corporate Structuring', bio: 'Ex-Goldman Sachs M&A partner. Specialized in equity splits, VC negotiation, and debt structures.', skills: ['Valuation', 'M&A', 'Equity Splits', 'SEC Compliance'] }
              ].map((co, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{co.name}</h4>
                      <Badge className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-0 text-[10px]">{co.role}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{co.bio}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {co.skills.map((s, si) => <Badge key={si} variant="outline" className="text-[9px] border-slate-200 dark:border-white/10 px-1 py-0">{s}</Badge>)}
                    </div>
                  </div>
                  <div className="flex justify-end border-t border-slate-100 dark:border-white/5 pt-2">
                    <Button size="xs" className="gradient-growth text-white border-0 text-xs h-7" onClick={() => toast.success(`Invitation message dispatched to ${co.name}!`)}>
                      Contact & Invite
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowCoFounders(false)}>Close Directory</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
