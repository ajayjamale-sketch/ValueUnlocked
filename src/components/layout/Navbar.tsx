import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, TrendingUp, Sun, Moon, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStoredUser, logout } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Research', href: '/research-marketplace' },
  { label: 'Community', href: '/community' },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const user = getStoredUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On landing page: always dark navbar (transparent → solid navy on scroll)
  // On other pages: dark navbar in dark mode, white navbar in light mode
  const isAlwaysDark = isLandingPage;

  const navBg = isAlwaysDark
    ? scrolled
      ? 'bg-navy shadow-lg shadow-navy/20 border-b border-white/10'
      : 'bg-transparent'
    : theme === 'dark'
      ? 'bg-navy border-b border-white/10 shadow-lg shadow-navy/20'
      : 'bg-white border-b border-slate-200 shadow-sm';

  const logoTextColor = isAlwaysDark || theme === 'dark' ? 'text-white' : 'text-slate-800';
  const linkColor = isAlwaysDark || theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const iconColor = isAlwaysDark || theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800';
  const signInColor = isAlwaysDark || theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const profileBtnColor = isAlwaysDark || theme === 'dark' ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  const mobileBg = theme === 'dark' ? 'bg-navy border-t border-white/10' : 'bg-white border-t border-slate-200';
  const mobileLinkColor = theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight ${logoTextColor}`}>
              Value<span className="text-emerald-500">Unlocked</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative group ${linkColor}`}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 transition-colors rounded-lg ${iconColor} ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors focus:outline-none ${profileBtnColor}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-emerald-500 text-white text-xs font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-1.5 z-50">
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium focus:bg-slate-100 dark:focus:bg-white/5 flex items-center gap-2"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard/profile')}
                    className="cursor-pointer px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium focus:bg-slate-100 dark:focus:bg-white/5 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/dashboard/settings')}
                    className="cursor-pointer px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium focus:bg-slate-100 dark:focus:bg-white/5 flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5 my-1" />
                  <DropdownMenuItem 
                    onClick={() => {
                      logout();
                      toast.success('Signed out successfully.');
                      navigate('/');
                    }}
                    className="cursor-pointer px-4 py-2.5 text-xs text-red-650 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors font-medium focus:bg-red-50 dark:focus:bg-red-500/5 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className={signInColor}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="gradient-growth text-white border-0 hover:opacity-90"
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 transition-colors ${iconColor}`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden px-4 py-4 space-y-2 ${mobileBg}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`block py-2 text-sm font-medium transition-colors ${mobileLinkColor}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button
              onClick={() => { toggleTheme(); }}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors ${mobileLinkColor}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                  className={`w-full justify-start ${mobileLinkColor} flex items-center gap-2`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigate('/dashboard/profile'); setIsOpen(false); }}
                  className={`w-full justify-start ${mobileLinkColor} flex items-center gap-2`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigate('/dashboard/settings'); setIsOpen(false); }}
                  className={`w-full justify-start ${mobileLinkColor} flex items-center gap-2`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    toast.success('Signed out successfully.');
                    navigate('/');
                    setIsOpen(false);
                  }}
                  className="w-full justify-start text-red-650 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  className={`w-full justify-start ${mobileLinkColor}`}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => { navigate('/register'); setIsOpen(false); }}
                  className="gradient-growth text-white border-0 w-full"
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
