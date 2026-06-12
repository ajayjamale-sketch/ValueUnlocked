import { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Star, Hash, ArrowRight, ThumbsUp, Eye, Bookmark, Pin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const threads = [
  { id: 1, category: 'Value Investing', title: 'Is Berkshire still a buy at current prices?', author: 'Marcus C.', replies: 48, views: 1240, upvotes: 124, time: '2h ago', pinned: true },
  { id: 2, category: 'AI & Tech', title: 'NVIDIA at $875 — still room to run or time to take profits?', author: 'Sarah W.', replies: 92, views: 3400, upvotes: 312, time: '4h ago', pinned: false },
  { id: 3, category: 'Startups', title: 'Best frameworks for evaluating Series A startups in 2024', author: 'Raj P.', replies: 36, views: 890, upvotes: 87, time: '6h ago', pinned: false },
  { id: 4, category: 'Personal Finance', title: 'How I paid off $140K debt in 3 years — full breakdown', author: 'Priya K.', replies: 204, views: 8920, upvotes: 891, time: '1d ago', pinned: false },
  { id: 5, category: 'Global Markets', title: 'India vs China: Where are you allocating in 2024?', author: 'Alex S.', replies: 67, views: 2100, upvotes: 203, time: '1d ago', pinned: false },
  { id: 6, category: 'Portfolio', title: 'Share your portfolio allocation — looking for feedback', author: 'Jen W.', replies: 145, views: 4200, upvotes: 445, time: '2d ago', pinned: false },
];

const groups = [
  { name: 'Value Investing Club', members: 8420, posts: 124, color: 'from-emerald-500 to-teal-600' },
  { name: 'Startup Scouts', members: 3200, posts: 89, color: 'from-purple-500 to-violet-600' },
  { name: 'Dividend Investors', members: 5800, posts: 201, color: 'from-amber-500 to-orange-600' },
  { name: 'Tech Sector Forum', members: 12400, posts: 342, color: 'from-blue-500 to-indigo-600' },
];

const categories = ['All', 'Value Investing', 'Startups', 'AI & Tech', 'Global Markets', 'Personal Finance', 'Portfolio'];

export default function CommunityDashPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [newPost, setNewPost] = useState('');

  const filtered = threads.filter(t => activeCategory === 'All' || t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-[#0f2d1f] border border-emerald-500/20 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl">Investor Community</h2>
          <p className="text-slate-400 text-sm mt-1">12,840 members · 342 active today</p>
        </div>
        <Button className="gradient-growth text-white border-0" onClick={() => toast.success('New post dialog opened!')}>
          + New Post
        </Button>
      </div>

      {/* Quick Post */}
      <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-400 text-sm font-bold">Y</span>
        </div>
        <Input
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share an investment idea or start a discussion..."
          className="flex-1 border-0 bg-slate-50 dark:bg-white/5 focus-visible:ring-0"
        />
        <Button size="sm" className="gradient-growth text-white border-0" disabled={!newPost.trim()} onClick={() => { toast.success('Post published!'); setNewPost(''); }}>
          Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Threads */}
          <div className="space-y-3">
            {filtered.map(t => (
              <div key={t.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer" onClick={() => toast.info(`Opening thread: ${t.title}`)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 text-sm font-bold">{t.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0">#{t.category}</Badge>
                      {t.pinned && <Badge className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 flex items-center gap-1"><Pin className="w-2.5 h-2.5" />Pinned</Badge>}
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm leading-snug">{t.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{t.author}</span>
                      <span>·</span>
                      <span>{t.time}</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{t.upvotes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{t.replies}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{t.views.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-amber-400 transition-colors" onClick={e => { e.stopPropagation(); toast.success('Thread bookmarked!'); }}>
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Investment Groups</h3>
            <div className="space-y-3">
              {groups.map((g, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={() => toast.info(`Joining ${g.name}...`)}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.members.toLocaleString()} members</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-500 hover:text-emerald-400 p-0">Join</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {['#NVIDIA', '#ValueInvesting', '#IndiaMarkets', '#AIStocks', '#Dividends', '#SeriesA'].map((tag, i) => (
                <button key={i} onClick={() => toast.info(`Searching ${tag}...`)} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-400 transition-colors w-full text-left py-1">
                  <Hash className="w-3.5 h-3.5" /> {tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
