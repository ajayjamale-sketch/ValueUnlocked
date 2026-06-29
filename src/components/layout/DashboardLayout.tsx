import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon, ChevronDown, Command, Menu } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import { getStoredUser, getRoleLabel, logout } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import CommandPalette from '@/components/features/CommandPalette';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Security Alert', message: 'New login detected from unrecognized device.', time: '10m ago', unread: true },
    { id: 2, title: 'Research Update', message: 'New valuation report published for Apple (AAPL).', time: '1h ago', unread: true },
    { id: 3, title: 'Portfolio Rebalanced', message: 'Your portfolio has been successfully rebalanced.', time: '1d ago', unread: false },
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read.');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#020617]`}>
      <DashboardSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(p => !p)} 
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
      <div className={`transition-[margin] duration-300 ml-0 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-navy border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white lg:hidden hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && <h1 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h1>}
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors text-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search anything...</span>
              <kbd className="ml-2 px-1.5 py-0.5 bg-white dark:bg-white/10 rounded text-xs border border-slate-200 dark:border-white/20 flex items-center gap-1">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-navy"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-2 z-50">
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-white/10 mb-1">
                  <span className="text-xs font-semibold text-slate-800 dark:text-white">Notifications</span>
                  {notifications.some(n => n.unread) && (
                    <button onClick={markAllRead} className="text-[10px] text-emerald-500 hover:text-emerald-600 font-medium">Mark all read</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">No notifications.</div>
                  ) : (
                    notifications.map(n => (
                      <DropdownMenuItem
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`flex flex-col items-start gap-1 px-4 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 focus:bg-slate-50 dark:focus:bg-white/5 transition-colors ${n.unread ? 'bg-slate-50/50 dark:bg-white/5' : ''}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-semibold ${n.unread ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-450">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-snug">{n.message}</p>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-emerald-500 text-white text-xs">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-medium text-slate-800 dark:text-white leading-none">{user.name}</p>
                    <Badge variant="secondary" className="text-[10px] h-4 mt-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard/profile')}
                  className="cursor-pointer px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium focus:bg-slate-100 dark:focus:bg-white/5"
                >
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard/settings')}
                  className="cursor-pointer px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium focus:bg-slate-100 dark:focus:bg-white/5"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                <DropdownMenuItem 
                  onClick={() => {
                    logout();
                    toast.success('Signed out successfully.');
                    navigate('/');
                  }}
                  className="cursor-pointer px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors font-medium focus:bg-red-50 dark:focus:bg-red-500/5"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
      {commandOpen && <CommandPalette onClose={() => setCommandOpen(false)} />}
    </div>
  );
}
