import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { faqItems } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const categories = [
  { label: 'All Topics', count: faqItems.length },
  { label: 'AI & Features', count: faqItems.filter(item => (item as any).category === 'AI & Features').length },
  { label: 'Security', count: faqItems.filter(item => (item as any).category === 'Security').length },
  { label: 'Pricing', count: faqItems.filter(item => (item as any).category === 'Pricing').length },
  { label: 'Integrations', count: faqItems.filter(item => (item as any).category === 'Integrations').length },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Topics');

  const filtered = faqItems.filter(item => {
    const categoryMatch = activeCategory === 'All Topics' || (item as any).category === activeCategory;
    const queryMatch = item.q.toLowerCase().includes(query.toLowerCase()) ||
                       item.a.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked <span className="text-emerald-400">Questions</span></h1>
          <p className="text-slate-300 mb-8">Everything you need to know about ValueUnlocked.</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-base" placeholder="Search questions..." />
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map(c => (
              <button key={c.label} onClick={() => setActiveCategory(c.label)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === c.label ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                {c.label} <span className="ml-1 text-xs opacity-70">({c.count})</span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((item, i) => (
              <div key={i} className={`border rounded-xl overflow-hidden transition-all ${openIndex === i ? 'border-emerald-500/50 shadow-md shadow-emerald-500/10' : 'border-slate-200 dark:border-white/10'}`}>
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className={`font-semibold text-sm leading-relaxed pr-4 ${openIndex === i ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{item.q}</span>
                  {openIndex === i
                    ? <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  }
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5 bg-white dark:bg-navy">
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No questions match your search. Try different keywords.</p>
            </div>
          )}

          <div className="mt-12 bg-navy rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">Still have questions?</h3>
            <p className="text-slate-300 text-sm mb-5">Our support team is available 24/7 to help you.</p>
            <Link to="/contact"><Button className="gradient-growth text-white border-0">Contact Support</Button></Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
