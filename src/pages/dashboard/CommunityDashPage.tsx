import { useState } from 'react';
import { MessageSquare, Users, TrendingUp, Star, Hash, ArrowRight, ThumbsUp, Eye, Bookmark, Pin, X, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useDashboard } from '@/context/DashboardContext';

const categories = ['All', 'Value Investing', 'Startups', 'AI & Tech', 'Global Markets', 'Personal Finance', 'Portfolio'];

export default function CommunityDashPage() {
  const {
    threads,
    comments,
    groups,
    watchlist,
    addThread,
    addComment,
    toggleJoinGroup,
    toggleWatchlist,
    upvoteThread
  } = useDashboard();

  const [activeCategory, setActiveCategory] = useState('All');
  const [quickPostText, setQuickPostText] = useState('');
  
  // Modals state
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Forms state
  const [newThread, setNewThread] = useState({ title: '', category: 'Value Investing', content: '' });
  const [newComment, setNewComment] = useState('');

  const filtered = threads.filter(t => activeCategory === 'All' || t.category === activeCategory);
  const selectedThread = threads.find(t => t.id === selectedThreadId) || null;
  const threadComments = selectedThread ? (comments[selectedThread.id] || []) : [];

  const handleQuickPost = () => {
    if (!quickPostText.trim()) return;
    addThread(quickPostText, 'Value Investing', 'Quick discussion post.');
    setQuickPostText('');
  };

  const handleCreateThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    addThread(newThread.title, newThread.category, newThread.content);
    setNewThread({ title: '', category: 'Value Investing', content: '' });
    setShowCreateModal(false);
  };

  const handleSendComment = () => {
    if (!selectedThread || !newComment.trim()) return;
    addComment(selectedThread.id, newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-[#0f2d1f] border border-emerald-500/20 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-xl">Investor Community</h2>
          <p className="text-slate-400 text-sm mt-1">12,840 members · 342 active today</p>
        </div>
        <Button className="gradient-growth text-white border-0" onClick={() => setShowCreateModal(true)}>
          + New Post
        </Button>
      </div>

      {/* Quick Post */}
      <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-emerald-400 text-sm font-bold">Y</span>
        </div>
        <Input
          value={quickPostText}
          onChange={e => setQuickPostText(e.target.value)}
          placeholder="Share an investment idea or start a discussion..."
          className="flex-1 border-0 bg-slate-50 dark:bg-white/5 focus-visible:ring-0"
          onKeyDown={e => e.key === 'Enter' && handleQuickPost()}
        />
        <Button size="sm" className="gradient-growth text-white border-0" disabled={!quickPostText.trim()} onClick={handleQuickPost}>
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
            {filtered.map(t => {
              const repliesCount = comments[t.id]?.length ?? t.replies;
              const isBookmarked = watchlist.includes(t.title);
              return (
                <div key={t.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-4 hover:border-emerald-500/30 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedThreadId(t.id)}>
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
                        <button
                          className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                          onClick={e => { e.stopPropagation(); upvoteThread(t.id); }}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {t.upvotes}
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                          onClick={e => { e.stopPropagation(); setSelectedThreadId(t.id); }}
                        >
                          <MessageSquare className="w-3 h-3" />
                          {repliesCount}
                        </button>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{t.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <button className={`transition-colors ${isBookmarked ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`} onClick={e => { e.stopPropagation(); toggleWatchlist(t.title); }}>
                      <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">Investment Groups</h3>
            <div className="space-y-3">
              {groups.map((g, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded-lg transition-colors" onClick={() => toggleJoinGroup(g.name)}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center flex-shrink-0`}>
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.members.toLocaleString()} members</p>
                  </div>
                  <Button variant="ghost" size="sm" className={`h-7 text-xs p-0 font-medium ${g.joined ? 'text-slate-400 hover:text-slate-300' : 'text-emerald-500 hover:text-emerald-400'}`}>
                    {g.joined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {[
                { tag: '#NVIDIA', category: 'AI & Tech' },
                { tag: '#ValueInvesting', category: 'Value Investing' },
                { tag: '#IndiaMarkets', category: 'Global Markets' },
                { tag: '#AIStocks', category: 'AI & Tech' },
                { tag: '#Dividends', category: 'Value Investing' },
                { tag: '#SeriesA', category: 'Startups' },
              ].map((item, i) => (
                <button key={i} onClick={() => { setActiveCategory(item.category); toast.success(`Filtered by ${item.category}`); }} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-400 transition-colors w-full text-left py-1">
                  <Hash className="w-3.5 h-3.5" /> {item.tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 pt-24 pb-8 overflow-y-auto" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Create New Discussion</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Category</label>
                <select
                  value={newThread.category}
                  onChange={e => setNewThread(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Discussion Title</label>
                <Input
                  value={newThread.title}
                  onChange={e => setNewThread(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Is it time to hedge tech sector exposure?"
                  className="text-sm h-10"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Content Details</label>
                <textarea
                  value={newThread.content}
                  onChange={e => setNewThread(p => ({ ...p, content: e.target.value }))}
                  placeholder="Elaborate on your thesis, ask questions, or link research reports..."
                  rows={4}
                  className="w-full text-sm bg-transparent border border-slate-200 dark:border-white/10 rounded-lg p-3 text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button size="sm" className="gradient-growth text-white border-0" onClick={handleCreateThread}>Publish Post</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thread Detail Modal */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 pt-24 pb-8 overflow-y-auto" onClick={() => setSelectedThreadId(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-2xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <Badge className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 mb-2">#{selectedThread.category}</Badge>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-snug">{selectedThread.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center font-bold text-emerald-500 text-[10px]">
                    {selectedThread.author.charAt(0)}
                  </div>
                  <span>{selectedThread.author}</span>
                  <span>·</span>
                  <span>{selectedThread.time}</span>
                </div>
              </div>
              <button onClick={() => setSelectedThreadId(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Content Thread Body */}
            <div className="space-y-6">
              <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-100 dark:border-white/5">
                {selectedThread.content || 'Discussion text details.'}
              </div>

              {/* Replies Section */}
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Replies ({threadComments.length})</h4>
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
                  {threadComments.map(comment => (
                    <div key={comment.id} className="flex gap-3 text-xs leading-relaxed items-start">
                      <div className="w-6 h-6 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[9px] flex-shrink-0 mt-0.5">
                        {comment.author.charAt(0)}
                      </div>
                      <div className="flex-1 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{comment.author}</span>
                          <span className="text-[10px] text-slate-400">{comment.time}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {threadComments.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No replies yet. Be the first to share your thoughts!</p>
                  )}
                </div>
              </div>

              {/* Write Reply Form */}
              <div className="flex gap-2 border-t border-slate-100 dark:border-white/10 pt-4">
                <Input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 text-xs h-9 bg-slate-50 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500"
                  onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                />
                <Button size="sm" className="gradient-growth text-white border-0 h-9 px-3.5" onClick={handleSendComment} disabled={!newComment.trim()}>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
