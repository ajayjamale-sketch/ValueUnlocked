import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardOverview from './dashboard/DashboardOverview';
import PortfolioPage from './dashboard/PortfolioPage';
import ResearchPage from './dashboard/ResearchPage';
import AIAdvisorPage from './dashboard/AIAdvisorPage';
import OpportunitiesPage from './dashboard/OpportunitiesPage';
import AnalyticsPage from './dashboard/AnalyticsPage';
import ProfilePage from './dashboard/ProfilePage';
import SettingsPage from './dashboard/SettingsPage';
import StartupPage from './dashboard/StartupPage';
import FinancePage from './dashboard/FinancePage';
import CommunityDashPage from './dashboard/CommunityDashPage';
import LearningDashPage from './dashboard/LearningDashPage';
import ReportsDashPage from './dashboard/ReportsDashPage';

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout title="Overview"><DashboardOverview /></DashboardLayout>} />
      <Route path="/portfolio" element={<DashboardLayout title="Portfolio Management"><PortfolioPage /></DashboardLayout>} />
      <Route path="/research" element={<DashboardLayout title="Investment Research"><ResearchPage /></DashboardLayout>} />
      <Route path="/ai-advisor" element={<DashboardLayout title="AI Wealth Advisor"><AIAdvisorPage /></DashboardLayout>} />
      <Route path="/opportunities" element={<DashboardLayout title="Opportunity Discovery"><OpportunitiesPage /></DashboardLayout>} />
      <Route path="/analytics" element={<DashboardLayout title="Analytics"><AnalyticsPage /></DashboardLayout>} />
      <Route path="/profile" element={<DashboardLayout title="Profile"><ProfilePage /></DashboardLayout>} />
      <Route path="/settings" element={<DashboardLayout title="Settings"><SettingsPage /></DashboardLayout>} />
      <Route path="/startups" element={<DashboardLayout title="Startup Intelligence"><StartupPage /></DashboardLayout>} />
      <Route path="/finance" element={<DashboardLayout title="Personal Finance"><FinancePage /></DashboardLayout>} />
      <Route path="/community" element={<DashboardLayout title="Community"><CommunityDashPage /></DashboardLayout>} />
      <Route path="/learning" element={<DashboardLayout title="Learning Academy"><LearningDashPage /></DashboardLayout>} />
      <Route path="/reports" element={<DashboardLayout title="Research Reports"><ReportsDashPage /></DashboardLayout>} />
    </Routes>
  );
}
