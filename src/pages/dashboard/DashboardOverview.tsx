import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Briefcase, Target, Zap, DollarSign, Brain, Activity, Shield, BookOpen, Users, Star, Compass } from 'lucide-react';
import KPICard from '@/components/features/KPICard';
import OpportunityCard from '@/components/features/OpportunityCard';
import { portfolioChartData, assetAllocationData, aiInsights, opportunities, portfolioAssets } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

// Per-role overview imports
import InvestorOverview from './overview/InvestorOverview';
import ValueInvestorOverview from './overview/ValueInvestorOverview';
import StartupInvestorOverview from './overview/StartupInvestorOverview';
import AdvisorOverview from './overview/AdvisorOverview';
import EntrepreneurOverview from './overview/EntrepreneurOverview';
import AnalystOverview from './overview/AnalystOverview';
import AdminOverview from './overview/AdminOverview';

export default function DashboardOverview() {
  const user = getStoredUser();
  const role = user?.role ?? 'investor';

  if (role === 'value_investor') return <ValueInvestorOverview />;
  if (role === 'startup_investor') return <StartupInvestorOverview />;
  if (role === 'advisor') return <AdvisorOverview />;
  if (role === 'entrepreneur') return <EntrepreneurOverview />;
  if (role === 'analyst') return <AnalystOverview />;
  if (role === 'admin') return <AdminOverview />;
  return <InvestorOverview />;
}
