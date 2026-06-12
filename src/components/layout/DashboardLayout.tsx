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
            <button 
              onClick={() => toast.info('You have 2 new security alerts and 1 research report update.', { 
                action: { 
                  label: 'View Settings', 
                  onClick: () => navigate('/dashboard/settings') 
                } 
              })}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-navy"></span>
            </button>
            
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
