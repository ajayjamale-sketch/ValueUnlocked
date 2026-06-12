import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Briefcase, Brain, Compass, BarChart3, Settings, User, X, BookOpen, Users } from 'lucide-react';

const commands = [
  { label: 'Dashboard Overview', href: '/dashboard', icon: BarChart3, category: 'Navigation' },
  { label: 'Portfolio Management', href: '/dashboard/portfolio', icon: Briefcase, category: 'Navigation' },
  { label: 'Investment Research', href: '/dashboard/research', icon: TrendingUp, category: 'Navigation' },
  { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain, category: 'Navigation' },
  { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass, category: 'Navigation' },
  { label: 'Analytics Dashboard', href: '/dashboard/analytics', icon: BarChart3, category: 'Navigation' },
  { label: 'Startup Intelligence', href: '/dashboard/startups', icon: TrendingUp, category: 'Navigation' },
  { label: 'Personal Finance', href: '/dashboard/finance', icon: TrendingUp, category: 'Navigation' },
  { label: 'Community', href: '/dashboard/community', icon: Users, category: 'Navigation' },
  { label: 'Learning Academy', href: '/dashboard/learning', icon: BookOpen, category: 'Navigation' },
  { label: 'Research Reports', href: '/dashboard/reports', icon: TrendingUp, category: 'Navigation' },
  { label: 'Profile Settings', href: '/dashboard/profile', icon: User, category: 'Account' },
  { label: 'App Settings', href: '/dashboard/settings', icon: Settings, category: 'Account' },
];

interface Props { onClose: () => void; }

export default function CommandPalette({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-navy rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, features, or settings..."
            className="flex-1 bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 outline-none text-sm"
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No results found</p>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(cmd.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 group transition-colors text-left"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">{cmd.label}</p>
                    <p className="text-xs text-slate-400">{cmd.category}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
