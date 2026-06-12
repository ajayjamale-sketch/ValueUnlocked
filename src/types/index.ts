export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'investor' | 'value_investor' | 'startup_investor' | 'advisor' | 'entrepreneur' | 'analyst' | 'admin';
  plan: 'starter' | 'investor_pro' | 'wealth_builder' | 'enterprise';
  joinedAt: string;
  netWorth?: number;
  portfolioValue?: number;
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'crypto' | 'bond' | 'real_estate' | 'startup';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  allocation: number;
}

export interface WealthMetric {
  label: string;
  value: string;
  change: number;
  changePercent: number;
  positive: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'stock' | 'startup' | 'sector' | 'franchise' | 'acquisition';
  score: number;
  risk: 'low' | 'medium' | 'high';
  upside: string;
  description: string;
  tags: string[];
}

export interface ResearchReport {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  date: string;
  summary: string;
  tags: string[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  enrolled: number;
  rating: number;
  price: number;
  image: string;
  progress?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
  cta: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  benchmark?: number;
}

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'action' | 'info';
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

export type DemoUser = {
  role: User['role'];
  label: string;
  description: string;
  color: string;
  icon: string;
  user: User;
};
