import { demoUsers } from './mockData';
import type { User } from '@/types';

const USER_KEY = 'vu_user';
const THEME_KEY = 'vu_theme';

export const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const storeUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const login = (email: string, _password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if email matches any demo user
      const found = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      const user = found ?? { ...demoUsers[0], email };
      storeUser(user);
      resolve(user);
    }, 1200);
  });
};

export const loginAsRole = (role: User['role']): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = demoUsers.find(u => u.role === role) ?? demoUsers[0];
      storeUser(user);
      resolve(user);
    }, 600);
  });
};

export const register = (data: { name: string; email: string; role: string }): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {
        ...demoUsers[0],
        id: Math.random().toString(36).slice(2),
        name: data.name,
        email: data.email,
        role: data.role as User['role'],
        plan: 'starter',
        joinedAt: new Date().toISOString(),
      };
      storeUser(user);
      resolve(user);
    }, 1500);
  });
};

export const logout = (): void => {
  clearUser();
};

export const getTheme = (): 'light' | 'dark' => {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const initTheme = (): void => {
  const theme = getTheme();
  setTheme(theme);
};

export const formatCurrency = (value: number, compact = false): string => {
  if (compact) {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
};

export const formatPercent = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const getRoleLabel = (role: User['role']): string => {
  const labels: Record<User['role'], string> = {
    investor: 'Individual Investor',
    value_investor: 'Value Investor',
    startup_investor: 'Startup Investor',
    advisor: 'Financial Advisor',
    entrepreneur: 'Entrepreneur',
    analyst: 'Research Analyst',
    admin: 'Platform Admin',
  };
  return labels[role] ?? role;
};
