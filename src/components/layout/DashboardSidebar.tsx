import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Briefcase, Zap, Brain,
  Wallet, Compass, BookOpen, Users, BarChart3,
  FileText, Settings, User, ChevronLeft, ChevronRight, LogOut,
  Building2, Shield, MessageSquare, X
} from 'lucide-react';
import { logout, getRoleLabel } from '@/lib/auth';
import { getStoredUser } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { User as UserType } from '@/types';

// Role-specific sidebar configs
const getSidebarItems = (role: UserType['role']) => {
  const base = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  ];

  const roleItems: Record<UserType['role'], typeof base> = {
    investor: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
      { label: 'Investment Research', href: '/dashboard/research', icon: TrendingUp },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'Personal Finance', href: '/dashboard/finance', icon: Wallet },
      { label: 'Learning Academy', href: '/dashboard/learning', icon: BookOpen },
      { label: 'Community', href: '/dashboard/community', icon: Users },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
    value_investor: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Value Screener', href: '/dashboard/research', icon: TrendingUp },
      { label: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
      { label: 'Research Reports', href: '/dashboard/reports', icon: FileText },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Learning Academy', href: '/dashboard/learning', icon: BookOpen },
    ],
    startup_investor: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Startup Intelligence', href: '/dashboard/startups', icon: Zap },
      { label: 'Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
      { label: 'Research Reports', href: '/dashboard/reports', icon: FileText },
      { label: 'Community', href: '/dashboard/community', icon: Users },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
    advisor: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Client Portfolios', href: '/dashboard/portfolio', icon: Briefcase },
      { label: 'Investment Research', href: '/dashboard/research', icon: TrendingUp },
      { label: 'Publish Research', href: '/dashboard/reports', icon: FileText },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
      { label: 'Community', href: '/dashboard/community', icon: Users },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
    entrepreneur: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Business Intelligence', href: '/dashboard/startups', icon: Building2 },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'Investment Research', href: '/dashboard/research', icon: TrendingUp },
      { label: 'Personal Finance', href: '/dashboard/finance', icon: Wallet },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
      { label: 'Community', href: '/dashboard/community', icon: Users },
      { label: 'Learning Academy', href: '/dashboard/learning', icon: BookOpen },
    ],
    analyst: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Reports', href: '/dashboard/reports', icon: FileText },
      { label: 'Investment Research', href: '/dashboard/research', icon: TrendingUp },
      { label: 'Opportunity Discovery', href: '/dashboard/opportunities', icon: Compass },
      { label: 'Community', href: '/dashboard/community', icon: Users },
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'AI Wealth Advisor', href: '/dashboard/ai-advisor', icon: Brain },
    ],
    admin: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'User Management', href: '/dashboard/analytics?tab=users', icon: Users },
      { label: 'Revenue Analytics', href: '/dashboard/analytics?tab=performance', icon: BarChart3 },
      { label: 'Research Management', href: '/dashboard/reports', icon: FileText },
      { label: 'Platform Intelligence', href: '/dashboard/research', icon: TrendingUp },
      { label: 'Community', href: '/dashboard/community', icon: MessageSquare },
      { label: 'System Settings', href: '/dashboard/settings', icon: Shield },
    ],
  };

  return roleItems[role] ?? roleItems.investor;
};

const roleColors: Record<UserType['role'], string> = {
  investor: 'from-emerald-500 to-teal-600',
  value_investor: 'from-blue-500 to-indigo-600',
  startup_investor: 'from-purple-500 to-violet-600',
  advisor: 'from-amber-500 to-orange-600',
  entrepreneur: 'from-pink-500 to-rose-600',
  analyst: 'from-cyan-500 to-sky-600',
  admin: 'from-red-500 to-rose-700',
};

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const role = user?.role ?? 'investor';
  const sidebarItems = getSidebarItems(role);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  const isActive = (href: string) => {
    const [path, search] = href.split('?');
    const pathMatches = path === '/dashboard' 
      ? location.pathname === '/dashboard' 
      : location.pathname.startsWith(path);
    
    if (!pathMatches) return false;
    if (search) {
      return location.search.includes(search);
    }
    return !location.search || location.search.includes('tab=performance') || !location.search.includes('tab=');
  };

  const bottomItems = [
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-white dark:bg-navy border-r border-slate-200 dark:border-white/10 flex flex-col transition-all duration-300 z-40 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-16 w-64' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 h-16">
        {(!collapsed || mobileOpen) && (
          <span className="text-slate-800 dark:text-white font-bold text-sm">Value<span className="text-emerald-500">Unlocked</span></span>
        )}
        <button onClick={onToggle} className={`hidden lg:block p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${collapsed ? 'mx-auto' : ''}`}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button onClick={onMobileClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && user && (
        <div className={`mx-3 mt-3 p-2.5 rounded-xl bg-gradient-to-r ${roleColors[role]} text-white shadow-sm`}>
          <p className="text-white text-xs font-semibold">{user.name.split(' ')[0]}</p>
          <p className="text-white/80 text-[10px]">{getRoleLabel(role)}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-3">
        <ul className="space-y-0.5 px-2">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  to={item.href}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5 mx-auto' : 'w-4 h-4'}`} />
                  {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-200 dark:border-white/10 p-2 space-y-1">
        {bottomItems.map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} to={item.href} onClick={onMobileClose} title={collapsed ? item.label : undefined} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <Icon className={`flex-shrink-0 ${collapsed ? 'w-5 h-5 mx-auto' : 'w-4 h-4'}`} />
              {(!collapsed || mobileOpen) && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
        <button onClick={handleLogout} title={collapsed ? 'Sign Out' : undefined} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <LogOut className={`flex-shrink-0 ${collapsed ? 'w-5 h-5 mx-auto' : 'w-4 h-4'}`} />
          {(!collapsed || mobileOpen) && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
