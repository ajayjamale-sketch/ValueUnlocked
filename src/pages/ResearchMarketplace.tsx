import { useState } from 'react';
import { Star, Download, Filter, Search, Users, BookOpen, FileText, Briefcase } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { researchReports } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = allReports
    .filter(r =>
      (category === 'All' || r.category === category) &&
      (r.title.toLowerCase().includes(query.toLowerCase()) || r.author.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : sortBy === 'price' ? a.price - b.price : b.reviews - a.reviews);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
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
                    <Button className="w-full gradient-growth text-white border-0 text-xs gap-1.5 hover:opacity-90 h-9" onClick={() => toast.success(`Purchased: ${r.title}`)}>
                      <Download className="w-3.5 h-3.5" /> Purchase Report
                    </Button>
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
                    <div key={i} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors" onClick={() => toast.info(`Viewing ${a.name}'s profile...`)}>
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

      <Footer />
    </div>
  );
}
