import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Tag, Clock, ArrowRight, TrendingUp, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Value Investing', 'Technology', 'Startups', 'Global Markets', 'Personal Finance'];

const allPosts = [
  ...blogPosts,
  { id: '5', title: 'The 4% Rule Is Dead: New Retirement Planning for a High-Inflation Era', excerpt: 'Rethinking retirement withdrawal strategies when traditional assumptions no longer hold.', author: 'Sarah Williams', date: 'Jan 16, 2024', readTime: '9 min', category: 'Personal Finance', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop', tags: ['Retirement', 'Finance', 'Inflation'] },
  { id: '6', title: 'How to Build a Dividend Growth Portfolio from Scratch', excerpt: 'A practical framework for constructing a compounding income machine that grows faster than inflation.', author: 'Marcus Chen', date: 'Jan 12, 2024', readTime: '11 min', category: 'Value Investing', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop', tags: ['Dividend', 'Portfolio', 'Income'] },
];

export default function Blog() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get('search') || '';

  const [query, setQuery] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (searchParam) {
      setQuery(searchParam);
    }
  }, [searchParam]);

  const filtered = allPosts.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (p.title.toLowerCase().includes(query.toLowerCase()) ||
     p.excerpt.toLowerCase().includes(query.toLowerCase()) ||
     p.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Wealth <span className="text-emerald-400">Intelligence</span> Blog</h1>
          <p className="text-slate-300 text-lg mb-8">Expert insights on investing, wealth building, and financial strategy.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-base" placeholder="Search articles..." />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === c ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {filtered.length > 0 && (
            <div className="mb-10 bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-xl transition-all cursor-pointer group" onClick={() => navigate(`/blog/${filtered[0].id}`)}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="w-fit bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 mb-4">{filtered[0].category}</Badge>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 leading-snug">{filtered[0].title}</h2>
                  <p className="text-slate-400 mb-5 leading-relaxed">{filtered[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{filtered[0].author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{filtered[0].readTime}</span>
                    </div>
                    <Button size="sm" className="gradient-growth text-white border-0 gap-1 text-xs">Read <ArrowRight className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(1).map(post => (
              <div key={post.id} className="bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate(`/blog/${post.id}`)}>
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-0">{post.category}</Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-snug line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{post.author} · {post.date}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
