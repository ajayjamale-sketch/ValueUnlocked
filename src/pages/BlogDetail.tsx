import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Twitter, Linkedin, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { blogPosts } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getStoredUser } from '@/lib/auth';

const allPosts = [
  ...blogPosts,
  { id: '5', title: 'The 4% Rule Is Dead: New Retirement Planning for a High-Inflation Era', excerpt: 'Rethinking retirement withdrawal strategies when traditional assumptions no longer hold.', author: 'Sarah Williams', date: 'Jan 16, 2024', readTime: '9 min', category: 'Personal Finance', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop', tags: ['Retirement', 'Finance', 'Inflation'] },
  { id: '6', title: 'How to Build a Dividend Growth Portfolio from Scratch', excerpt: 'A practical framework for constructing a compounding income machine that grows faster than inflation.', author: 'Marcus Chen', date: 'Jan 12, 2024', readTime: '11 min', category: 'Value Investing', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop', tags: ['Dividend', 'Portfolio', 'Income'] },
];

const blogContent: Record<string, string[]> = {
  default: [
    "The investment landscape is constantly evolving, and staying ahead requires more than just following the conventional wisdom. The most successful investors we know share one trait: they do their own research, form their own opinions, and stick to a disciplined process.",
    "When we look at the data across thousands of portfolios, a clear pattern emerges. Investors who use systematic frameworks — whether quantitative screeners, fundamental checklists, or AI-assisted analysis — consistently outperform those who rely on intuition alone.",
    "The key is building what we call an 'edge stack': multiple layers of analytical advantage that compound over time. This means combining deep fundamental research with sector-level awareness, macro understanding, and sentiment analysis.",
    "Consider how institutional investors approach opportunity identification. They rarely rely on a single signal. Instead, they triangulate across multiple data sources: management quality, competitive positioning, balance sheet strength, and valuation relative to intrinsic value.",
    "The good news is that individual investors — armed with the right tools — can replicate much of this institutional-grade analysis. That is precisely why platforms like ValueUnlocked were built: to level the playing field.",
    "The most important thing to remember is that great investing is ultimately a discipline, not a talent. It can be learned, practiced, and improved. Every research process you complete, every thesis you write and test, makes you a better investor.",
  ],
};

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const post = allPosts.find(p => p.id === id) || allPosts[0];
  const related = allPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);
  const content = blogContent[id || 'default'] || blogContent.default;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
          <Badge className="mb-3 bg-emerald-500/80 text-white border-0">{post.category}</Badge>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Meta */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 gradient-growth rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{post.author.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">{post.author}</p>
              <p className="text-xs text-slate-400">{post.date} · {post.readTime} read</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast.success('Shared on Twitter!')} className="p-2 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-500/30 transition-colors">
              <Twitter className="w-4 h-4" />
            </button>
            <button onClick={() => toast.success('Shared on LinkedIn!')} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors">
              <Linkedin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-8 font-light">{post.excerpt}</p>
          {content.map((para, i) => (
            <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5 text-base">{para}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-3 flex-wrap mb-10 pb-10 border-b border-slate-200 dark:border-white/10">
          <Tag className="w-4 h-4 text-slate-400" />
          {post.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors" onClick={() => navigate(`/blog?search=${tag}`)}>#{tag}</Badge>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-navy rounded-2xl p-8 mb-10 text-center">
          <h3 className="text-white font-bold text-xl mb-2">Want AI-Powered Investment Research?</h3>
          <p className="text-slate-300 text-sm mb-5">Get institutional-grade analysis, opportunity discovery, and a personal AI wealth advisor — all in one platform.</p>
          <Button onClick={() => navigate(user ? '/dashboard' : '/register')} className="gradient-growth text-white border-0 gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <Button variant="ghost" onClick={() => navigate('/blog')} className="gap-2 text-slate-500">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Button>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {related.map(rp => (
                <div key={rp.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate(`/blog/${rp.id}`)}>
                  <div className="h-36 overflow-hidden">
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm mb-1 line-clamp-2">{rp.title}</p>
                    <p className="text-xs text-slate-400">{rp.author} · {rp.readTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
