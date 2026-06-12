import { useState } from 'react';
import { MessageSquare, Users, Hash, ThumbsUp, Eye, Bookmark, ArrowRight, TrendingUp, Star, Pin, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const threads = [
  { id: 1, category: 'Value Investing', title: 'Is Berkshire still a buy at current prices?', author: 'Marcus C.', avatar: 'MC', replies: 48, views: 1240, upvotes: 124, time: '2h ago', pinned: true, color: 'from-emerald-500 to-teal-600' },
  { id: 2, category: 'AI & Tech', title: 'NVIDIA at $875 — still room to run or time to take profits?', author: 'Sarah W.', avatar: 'SW', replies: 92, views: 3400, upvotes: 312, time: '4h ago', pinned: false, color: 'from-blue-500 to-indigo-600' },
  { id: 3, category: 'Startups', title: 'Best frameworks for evaluating Series A startups in 2024', author: 'Raj P.', avatar: 'RP', replies: 36, views: 890, upvotes: 87, time: '6h ago', pinned: false, color: 'from-purple-500 to-violet-600' },
  { id: 4, category: 'Personal Finance', title: 'How I paid off $140K debt in 3 years — full breakdown', author: 'Priya K.', avatar: 'PK', replies: 204, views: 8920, upvotes: 891, time: '1d ago', pinned: false, color: 'from-amber-500 to-orange-600' },
  { id: 5, category: 'Global Markets', title: 'India vs China: Where are you allocating in 2024?', author: 'Alex S.', avatar: 'AS', replies: 67, views: 2100, upvotes: 203, time: '1d ago', pinned: false, color: 'from-rose-500 to-pink-600' },
  { id: 6, category: 'Portfolio', title: 'Share your portfolio allocation — looking for feedback', author: 'Jen W.', avatar: 'JW', replies: 145, views: 4200, upvotes: 445, time: '2d ago', pinned: false, color: 'from-cyan-500 to-sky-600' },
];

const groups = [
  { name: 'Value Investing Club', members: 8420, posts: 124, color: 'from-emerald-500 to-teal-600' },
  { name: 'Startup Scouts', members: 3200, posts: 89, color: 'from-purple-500 to-violet-600' },
  { name: 'Dividend Investors', members: 5800, posts: 201, color: 'from-amber-500 to-orange-600' },
  { name: 'Tech Sector Forum', members: 12400, posts: 342, color: 'from-blue-500 to-indigo-600' },
  { name: 'Global Markets', members: 6100, posts: 178, color: 'from-rose-500 to-pink-600' },
  { name: 'Options & Derivatives', members: 2800, posts: 95, color: 'from-cyan-500 to-sky-600' },
];

const categories = ['All', 'Value Investing', 'Startups', 'AI & Tech', 'Global Markets', 'Personal Finance', 'Portfolio'];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [newPost, setNewPost] = useState('');
  const [upvoted, setUpvoted] = useState<number[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>(['Value Investing Club']);

  const [activeThreads, setActiveThreads] = useState(threads);
  const [selectedThread, setSelectedThread] = useState<typeof threads[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [repliesMap, setRepliesMap] = useState<Record<number, Array<{ author: string, avatar: string, time: string, content: string }>>>({
    1: [
      { author: 'Sarah W.', avatar: 'SW', time: '1h ago', content: 'Berkshire is a solid long-term compounder. The cash pile gives it massive option value during market downturns.' },
      { author: 'Alex S.', avatar: 'AS', time: '45m ago', content: 'Agreed, but short-term upside might be limited due to its size. It’s more of a wealth preservation tool now.' }
    ],
    2: [
      { author: 'Marcus C.', avatar: 'MC', time: '3h ago', content: 'Valuation is definitely stretched, but the AI growth trajectory is unprecedented. I would hold but not add new money here.' }
    ],
    3: [
      { author: 'Jen W.', avatar: 'JW', time: '5h ago', content: 'Focus on path to profitability and unit economics. Multiples have compressed significantly.' }
    ]
  });

  const filtered = activeThreads.filter(t => activeCategory === 'All' || t.category === activeCategory);

  const toggleUpvote = (id: number) => {
    setUpvoted(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);
  };

  const toggleBookmark = (id: number) => {
    setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
    toast.success(bookmarked.includes(id) ? 'Thread removed from bookmarks' : 'Thread bookmarked!');
  };

  const toggleGroup = (name: string) => {
    setJoinedGroups(prev => prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]);
    toast.success(joinedGroups.includes(name) ? `Left ${name}` : `Joined ${name}!`);
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;
    const newThread = {
      id: activeThreads.length + 1,
      category: activeCategory === 'All' ? 'Value Investing' : activeCategory,
      title: newPost,
      author: 'You',
      avatar: 'U',
      replies: 0,
      views: 1,
      upvotes: 0,
      time: 'Just now',
      pinned: false,
      color: 'from-emerald-500 to-teal-600',
    };
    setActiveThreads([newThread, ...activeThreads]);
    toast.success('Post published!');
    setNewPost('');
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !replyText.trim()) return;

    const newReply = {
      author: 'You',
      avatar: 'U',
      time: 'Just now',
      content: replyText.trim()
    };

    setRepliesMap(prev => ({
      ...prev,
      [selectedThread.id]: [...(prev[selectedThread.id] || []), newReply]
    }));

    // Increment replies count in activeThreads
    setActiveThreads(prev => prev.map(t => {
      if (t.id === selectedThread.id) {
        return { ...t, replies: t.replies + 1 };
      }
      return t;
    }));

    toast.success('Reply submitted!');
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">Investor Community</span>
          <h1 className="text-4xl font-bold text-white mb-4">Connect with <span className="text-emerald-400">Serious Investors</span></h1>
          <p className="text-slate-300 text-lg mb-8">Join 12,840 investors, analysts, and advisors sharing ideas, research, and investment strategies.</p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-8">
            {[{ v: '12,840', l: 'Members' }, { v: '342', l: 'Active Today' }, { v: '8,420', l: 'Posts This Month' }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{s.v}</p>
                <p className="text-slate-400 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
          <Link to="/register"><Button className="gradient-growth text-white border-0 gap-2 px-8">Join the Community <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Post Box */}
            <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-3">
              <div className="w-9 h-9 gradient-growth rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">Y</span>
              </div>
              <Input value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Share an investment idea or start a discussion..." className="flex-1 border-0 bg-slate-50 dark:bg-white/5 focus-visible:ring-0" />
              <Button size="sm" className="gradient-growth text-white border-0" disabled={!newPost.trim()} onClick={handleCreatePost}>Post</Button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>{c}</button>
              ))}
            </div>

            {/* Threads */}
            <div className="space-y-3">
              {filtered.map(t => (
                <div key={t.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 hover:border-emerald-500/30 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs font-bold">{t.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0">#{t.category}</Badge>
                        {t.pinned && <Badge className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-0 flex items-center gap-1"><Pin className="w-2.5 h-2.5" />Pinned</Badge>}
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm leading-snug cursor-pointer hover:text-emerald-500 transition-colors" onClick={() => setSelectedThread(t)}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                        <span>{t.author}</span>
                        <span>·</span>
                        <span>{t.time}</span>
                        <button onClick={() => toggleUpvote(t.id)} className={`flex items-center gap-1 transition-colors ${upvoted.includes(t.id) ? 'text-emerald-500' : 'hover:text-emerald-400'}`}>
                          <ThumbsUp className="w-3 h-3" fill={upvoted.includes(t.id) ? 'currentColor' : 'none'} />
                          {t.upvotes + (upvoted.includes(t.id) ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{t.replies}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{t.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleBookmark(t.id)} className={`transition-colors p-1 rounded flex-shrink-0 ${bookmarked.includes(t.id) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}>
                      <Bookmark className="w-4 h-4" fill={bookmarked.includes(t.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Investment Groups</h3>
              <div className="space-y-3">
                {groups.map((g, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}>
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{g.name}</p>
                      <p className="text-xs text-slate-400">{g.members.toLocaleString()} members</p>
                    </div>
                    <Button variant={joinedGroups.includes(g.name) ? 'default' : 'ghost'} size="sm" className={`h-7 text-xs flex-shrink-0 ${joinedGroups.includes(g.name) ? 'gradient-growth text-white border-0' : 'text-emerald-500 hover:text-emerald-400 p-0'}`} onClick={() => toggleGroup(g.name)}>
                      {joinedGroups.includes(g.name) ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Trending Topics</h3>
              <div className="space-y-2">
                {['#NVIDIA', '#ValueInvesting', '#IndiaMarkets', '#AIStocks', '#Dividends', '#SeriesA', '#RealEstate'].map((tag, i) => (
                  <button key={i} onClick={() => { setActiveCategory('All'); toast.info(`Searching ${tag}...`); }} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-400 transition-colors w-full text-left py-1">
                    <Hash className="w-3.5 h-3.5" /> {tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
              <h4 className="text-emerald-400 font-semibold text-sm mb-2">Upcoming Expert Sessions</h4>
              <div className="space-y-3">
                {[
                  { title: 'Value Investing in 2024', host: 'Sarah Williams', time: 'Feb 15, 3 PM EST' },
                  { title: 'AI Sector Deep Dive', host: 'Marcus Chen', time: 'Feb 18, 2 PM EST' },
                ].map((session, i) => (
                  <div key={i} className="p-2 bg-white/10 rounded-lg">
                    <p className="text-xs font-medium text-white">{session.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">by {session.host} · {session.time}</p>
                    <Button size="sm" className="mt-2 h-6 text-[10px] gradient-growth text-white border-0 w-full" onClick={() => toast.success(`Registered for ${session.title}`)}>
                      Register
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Thread Detail Modal */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedThread(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative my-8 text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 mb-1">#{selectedThread.category}</Badge>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">{selectedThread.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Started by {selectedThread.author}</span>
                  <span>·</span>
                  <span>{selectedThread.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedThread(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Replies section */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-150 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-500">{selectedThread.author}</span>
                  <span className="text-[10px] text-slate-400">Topic Opener</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Let's gather some thoughts and analysis on this topic. What do you think are the core drivers, risk factors, or valuation multiples we should be looking at?
                </p>
              </div>

              {(repliesMap[selectedThread.id] || []).length > 0 ? (
                (repliesMap[selectedThread.id] || []).map((reply, i) => (
                  <div key={i} className="flex gap-3 items-start pl-4 border-l-2 border-slate-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold dark:text-white">{reply.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-700 dark:text-white">{reply.author}</span>
                        <span className="text-[10px] text-slate-400">{reply.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No replies yet. Be the first to answer!</p>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleAddReply} className="border-t border-slate-100 dark:border-white/10 pt-4 flex gap-2">
              <Input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a response..."
                className="flex-1 text-xs"
                required
              />
              <Button type="submit" size="sm" className="gradient-growth text-white border-0 text-xs">
                Reply
              </Button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
