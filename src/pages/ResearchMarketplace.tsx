import { useState } from 'react';
import { Star, Download, Filter, Search, Users, BookOpen, FileText, Briefcase, X, CreditCard, Lock, ShieldCheck, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { researchReports } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

const categories = ['All', 'Technology', 'Value Investing', 'Global Markets', 'Healthcare', 'Energy', 'Startups'];

const extraReports = [
  { id: '4', title: 'Healthcare REITs: Overlooked Income in Aging Demographics', author: 'David Kim', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', category: 'Healthcare', price: 179, rating: 4.6, reviews: 128, date: '2024-01-05', summary: 'Senior living REIT deep dive with demographic catalysts and valuation scenarios.', tags: ['REIT', 'Healthcare', 'Dividend'] },
  { id: '5', title: 'EV Battery Supply Chain: Winners and Losers', author: 'Marcus Chen', authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', category: 'Technology', price: 249, rating: 4.8, reviews: 201, date: '2024-01-03', summary: 'Comprehensive analysis of the EV battery supply chain from mining to manufacturing.', tags: ['EV', 'Supply Chain', 'Metals'] },
  { id: '6', title: 'Fintech Banking-as-a-Service: Market Map 2024', author: 'Aisha Johnson', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face', category: 'Technology', price: 199, rating: 4.7, reviews: 156, date: '2023-12-28', summary: 'Complete market map of BaaS providers with competitive moat analysis and M&A targets.', tags: ['FinTech', 'BaaS', 'M&A'] },
];

const allReports = [...researchReports, ...extraReports];

const featuredAnalysts = [
  { name: 'Marcus Chen', specialty: 'Technology & AI', reports: 24, followers: 8420, accuracy: '76%', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face' },
  { name: 'Sarah Williams', specialty: 'Value Investing', reports: 31, followers: 12400, accuracy: '81%', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { name: 'Raj Patel', specialty: 'Emerging Markets', reports: 18, followers: 5200, accuracy: '73%', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
];

export default function ResearchMarketplace() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  // Checkout states
  const [checkoutReport, setCheckoutReport] = useState<typeof allReports[0] | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Analyst details states
  const [selectedAnalyst, setSelectedAnalyst] = useState<typeof featuredAnalysts[0] | null>(null);
  const [followedAnalysts, setFollowedAnalysts] = useState<string[]>(() => {
    const stored = localStorage.getItem('vu_followed_analysts');
    return stored ? JSON.parse(stored) : [];
  });

  // Purchased reports list
  const [purchasedReports, setPurchasedReports] = useState<string[]>(() => {
    const stored = localStorage.getItem('vu_purchased_reports');
    return stored ? JSON.parse(stored) : [];
  });

  const filtered = allReports
    .filter(r =>
      (category === 'All' || r.category === category) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) || r.author.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : sortBy === 'price' ? a.price - b.price : b.reviews - a.reviews);

  const handleOpenCheckout = (report: typeof allReports[0]) => {
    if (!user) {
      toast.info('Please sign in to purchase reports.');
      navigate('/login');
      return;
    }
    setCheckoutReport(report);
    setCardDetails({ number: '', expiry: '', cvc: '', name: user.name || '' });
    setCheckoutProcessing(false);
    setCheckoutSuccess(false);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutReport) return;
    if (!cardDetails.number.trim() || !cardDetails.expiry.trim() || !cardDetails.cvc.trim() || !cardDetails.name.trim()) {
      toast.error('Please fill in all card details.');
      return;
    }
    
    const plainCardNumber = cardDetails.number.replace(/\s/g, '');
    if (plainCardNumber.length < 16 || isNaN(Number(plainCardNumber))) {
      toast.error('Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardDetails.expiry.includes('/') || cardDetails.expiry.length < 5) {
      toast.error('Please enter expiry in MM/YY format.');
      return;
    }
    if (cardDetails.cvc.length < 3 || isNaN(Number(cardDetails.cvc))) {
      toast.error('Please enter a valid 3-digit CVC.');
      return;
    }

    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutSuccess(true);

      const updated = [...purchasedReports, checkoutReport.id];
      setPurchasedReports(updated);
      localStorage.setItem('vu_purchased_reports', JSON.stringify(updated));

      toast.success(`Purchase successful: ${checkoutReport.title}`);
    }, 1500);
  };

  const handleDownloadReport = (report: typeof allReports[0]) => {
    const content = `VALUEUNLOCKED PREMIUM INVESTMENT RESEARCH REPORT
=========================================================
Report Title: ${report.title}
Author: ${report.author}
Category: ${report.category}
Date Published: ${report.date}
Rating: ${report.rating} / 5.0 (${report.reviews} reviews)

SUMMARY ANALYSIS:
${report.summary}

INVESTMENT THESIS & OUTLOOK:
1. Competitive Moat Analysis: Strong institutional backlog and pricing power.
2. Financial Projections: Valuation model suggests highly asymmetric risk-reward ratio (+40% projected upside).
3. Risk Factors: Competitive entry, supply chain consolidation, and monetary policy exposure.

=========================================================
For information purposes only. © 2026 ValueUnlocked Inc.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Download started!');
  };

  const handleFollowAnalyst = (name: string) => {
    let updated: string[];
    if (followedAnalysts.includes(name)) {
      updated = followedAnalysts.filter(a => a !== name);
      toast.success(`Unfollowed ${name}`);
    } else {
      updated = [...followedAnalysts, name];
      toast.success(`Following ${name}`);
    }
    setFollowedAnalysts(updated);
    localStorage.setItem('vu_followed_analysts', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">Research Marketplace</span>
          <h1 className="text-4xl font-bold text-white mb-4">Premium Investment <span className="text-emerald-400">Research</span></h1>
          <p className="text-slate-300 text-lg mb-8">Access expert research from verified analysts, fund managers, and investment specialists.</p>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[{ value: '2,400+', label: 'Research Reports' }, { value: '380+', label: 'Verified Analysts' }, { value: '4.8/5', label: 'Average Rating' }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-10" placeholder="Search reports, analysts, topics..." />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-sm">
              <option value="rating">Sort: Highest Rated</option>
              <option value="price">Sort: Lowest Price</option>
              <option value="reviews">Sort: Most Reviewed</option>
            </select>
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Reports Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(r => (
                  <div key={r.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0 text-xs">{r.category}</Badge>
                      <p className="text-xl font-bold text-emerald-500">${r.price}</p>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-sm leading-snug line-clamp-2 flex-1">{r.title}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{r.summary}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <img src={r.authorAvatar} alt={r.author} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-1 truncate">{r.author}</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{r.rating}</span>
                        <span className="text-xs text-slate-400">({r.reviews})</span>
                      </span>
                    </div>
                    {purchasedReports.includes(r.id) ? (
                      <Button className="w-full bg-emerald-550 dark:bg-emerald-650 hover:opacity-90 text-white border-0 text-xs gap-1.5 h-9" onClick={() => handleDownloadReport(r)}>
                        <Download className="w-3.5 h-3.5" /> Download PDF Report
                      </Button>
                    ) : (
                      <Button className="w-full gradient-growth text-white border-0 text-xs gap-1.5 hover:opacity-90 h-9" onClick={() => handleOpenCheckout(r)}>
                        <Download className="w-3.5 h-3.5" /> Purchase Report
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" /> Top Analysts
                </h3>
                <div className="space-y-4">
                  {featuredAnalysts.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors" onClick={() => setSelectedAnalyst(a)}>
                      <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{a.name}</p>
                        <p className="text-xs text-slate-400">{a.specialty}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span>{a.reports} reports</span>
                          <span>·</span>
                          <span className="text-emerald-500 font-medium">{a.accuracy} accuracy</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                <h4 className="font-semibold text-emerald-400 text-sm mb-2">Are you an analyst?</h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">Publish your research and earn revenue from our 185,000+ user community.</p>
                <Link to="/register">
                  <Button size="sm" className="w-full gradient-growth text-white border-0 h-8 text-xs">Apply as Analyst</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Report Checkout Modal */}
      {checkoutReport && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Purchase Research Report
              </h3>
              <button onClick={() => setCheckoutReport(null)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white" disabled={checkoutProcessing}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 gradient-growth rounded-2xl flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-base">Purchase Confirmed!</h4>
                <p className="text-xs text-slate-400">Your premium report has been unlocked. Click the button below to download the research.</p>
                <div className="flex gap-2 justify-center pt-2">
                  <Button className="gradient-growth text-white border-0 text-xs gap-1.5" onClick={() => handleDownloadReport(checkoutReport)}>
                    <Download className="w-3.5 h-3.5" /> Download Report
                  </Button>
                  <Button variant="ghost" className="text-xs" onClick={() => setCheckoutReport(null)}>Close</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPurchase}>
                <div className="p-6 space-y-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Research Report</span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">{checkoutReport.title}</h4>
                    <p className="text-xs text-emerald-500 font-bold mt-1">Total: ${checkoutReport.price}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cardholder Name</label>
                    <Input
                      type="text"
                      required
                      placeholder="Alexander Sterling"
                      value={cardDetails.name}
                      onChange={e => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardDetails(prev => ({ ...prev, number: val }));
                        }}
                        className="pl-9 text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Expiration Date</label>
                      <Input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={e => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 2) {
                            val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          }
                          setCardDetails(prev => ({ ...prev, expiry: val }));
                        }}
                        className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">CVC</label>
                      <Input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={4}
                        value={cardDetails.cvc}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          setCardDetails(prev => ({ ...prev, cvc: val }));
                        }}
                        className="text-xs text-slate-850 dark:text-white bg-white dark:bg-navy"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    <span className="text-[10px] text-slate-405">Secure SSL payment. This is a simulated transaction.</span>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                  <Button type="button" variant="ghost" disabled={checkoutProcessing} onClick={() => setCheckoutReport(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={checkoutProcessing} className="gradient-growth text-white border-0 flex items-center gap-1.5">
                    {checkoutProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Pay ${checkoutReport.price}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Analyst Profile Modal */}
      {selectedAnalyst && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedAnalyst(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-md shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={selectedAnalyst.avatar} alt={selectedAnalyst.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
                    {selectedAnalyst.name}
                    {followedAnalysts.includes(selectedAnalyst.name) && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 text-[9px] flex items-center gap-0.5"><UserCheck className="w-2.5 h-2.5" /> Following</Badge>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedAnalyst.specialty}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAnalyst(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Verified analyst at ValueUnlocked Research. Specializes in producing institutional-grade equity reports, sector valuations, and competitive analysis benchmarks.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5">
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedAnalyst.reports}</p>
                <p className="text-[10px] text-slate-400">Reports</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5">
                <p className="text-sm font-bold text-emerald-500">{selectedAnalyst.accuracy}</p>
                <p className="text-[10px] text-slate-400">Accuracy</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-2.5">
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {(selectedAnalyst.followers + (followedAnalysts.includes(selectedAnalyst.name) ? 1 : 0)).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400">Followers</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 gradient-growth text-white border-0 text-xs" onClick={() => handleFollowAnalyst(selectedAnalyst.name)}>
                {followedAnalysts.includes(selectedAnalyst.name) ? 'Unfollow Analyst' : 'Follow Analyst'}
              </Button>
              <Button variant="outline" className="text-xs" onClick={() => { setSelectedAnalyst(null); toast.info(`Viewing reports filtered by ${selectedAnalyst.name}`); setQuery(selectedAnalyst.name); }}>
                Filter Reports
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
