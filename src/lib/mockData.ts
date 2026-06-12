import type { User } from '@/types';
import type { PortfolioAsset, WealthMetric, Opportunity, ResearchReport, Course, PricingPlan, ChartDataPoint, AIInsight } from '@/types';

// ─── Demo Users (one per role) ───────────────────────────────────────────────

export const demoUsers: User[] = [
  {
    id: '1',
    name: 'Alexander Sterling',
    email: 'investor@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'investor',
    plan: 'wealth_builder',
    joinedAt: '2023-01-15',
    netWorth: 2847500,
    portfolioValue: 1245830,
  },
  {
    id: '2',
    name: 'Benjamin Graham Jr.',
    email: 'value@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    role: 'value_investor',
    plan: 'investor_pro',
    joinedAt: '2022-08-20',
    netWorth: 4200000,
    portfolioValue: 3100000,
  },
  {
    id: '3',
    name: 'Priya Kapoor',
    email: 'startup@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    role: 'startup_investor',
    plan: 'wealth_builder',
    joinedAt: '2023-03-10',
    netWorth: 1850000,
    portfolioValue: 920000,
  },
  {
    id: '4',
    name: 'Jennifer Walsh',
    email: 'advisor@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    role: 'advisor',
    plan: 'enterprise',
    joinedAt: '2022-11-05',
    netWorth: 850000,
    portfolioValue: 420000,
  },
  {
    id: '5',
    name: 'Marcus Rivera',
    email: 'entrepreneur@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'entrepreneur',
    plan: 'investor_pro',
    joinedAt: '2023-06-18',
    netWorth: 3200000,
    portfolioValue: 280000,
  },
  {
    id: '6',
    name: 'Sophia Chen',
    email: 'analyst@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'analyst',
    plan: 'investor_pro',
    joinedAt: '2023-04-22',
    netWorth: 420000,
    portfolioValue: 180000,
  },
  {
    id: '7',
    name: 'Admin User',
    email: 'admin@valueunlocked.ai',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'admin',
    plan: 'enterprise',
    joinedAt: '2021-01-01',
    netWorth: 0,
    portfolioValue: 0,
  },
];

export const mockUser = demoUsers[0];

// ─── Wealth Metrics ──────────────────────────────────────────────────────────

export const wealthMetrics: WealthMetric[] = [
  { label: 'Total Portfolio Value', value: '$1,245,830', change: 18420, changePercent: 1.5, positive: true },
  { label: 'Net Worth', value: '$2,847,500', change: 42300, changePercent: 1.51, positive: true },
  { label: 'Monthly Returns', value: '$18,420', change: 3200, changePercent: 21.0, positive: true },
  { label: 'Annual Growth', value: '+24.7%', change: 4.2, changePercent: 4.2, positive: true },
  { label: 'Risk Score', value: '6.2 / 10', change: -0.3, changePercent: -4.6, positive: true },
  { label: 'Opportunity Score', value: '87 / 100', change: 5, changePercent: 6.1, positive: true },
];

// ─── Portfolio Assets ─────────────────────────────────────────────────────────

export const portfolioAssets: PortfolioAsset[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', quantity: 150, avgPrice: 145.20, currentPrice: 189.50, value: 28425, gain: 6645, gainPercent: 30.5, allocation: 22.8 },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', quantity: 80, avgPrice: 285.00, currentPrice: 378.90, value: 30312, gain: 7512, gainPercent: 32.9, allocation: 24.3 },
  { id: '3', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock', quantity: 25, avgPrice: 420.00, currentPrice: 875.50, value: 21887, gain: 11387, gainPercent: 108.5, allocation: 17.6 },
  { id: '4', symbol: 'BRK.B', name: 'Berkshire Hathaway', type: 'stock', quantity: 60, avgPrice: 320.00, currentPrice: 358.40, value: 21504, gain: 2304, gainPercent: 12.0, allocation: 17.3 },
  { id: '5', symbol: 'VTI', name: 'Vanguard Total Market ETF', type: 'etf', quantity: 100, avgPrice: 210.00, currentPrice: 238.70, value: 23870, gain: 2870, gainPercent: 13.7, allocation: 19.2 },
];

export const valuePortfolioAssets: PortfolioAsset[] = [
  { id: '1', symbol: 'BRK.B', name: 'Berkshire Hathaway', type: 'stock', quantity: 200, avgPrice: 290.00, currentPrice: 358.40, value: 71680, gain: 13680, gainPercent: 23.6, allocation: 28.5 },
  { id: '2', symbol: 'KO', name: 'Coca-Cola Co.', type: 'stock', quantity: 400, avgPrice: 52.00, currentPrice: 61.20, value: 24480, gain: 3680, gainPercent: 17.7, allocation: 9.7 },
  { id: '3', symbol: 'JNJ', name: 'Johnson & Johnson', type: 'stock', quantity: 120, avgPrice: 145.00, currentPrice: 158.90, value: 19068, gain: 1668, gainPercent: 9.6, allocation: 7.6 },
  { id: '4', symbol: 'WMT', name: 'Walmart Inc.', type: 'stock', quantity: 180, avgPrice: 148.00, currentPrice: 173.20, value: 31176, gain: 4536, gainPercent: 17.0, allocation: 12.4 },
  { id: '5', symbol: 'BAC', name: 'Bank of America', type: 'stock', quantity: 500, avgPrice: 28.00, currentPrice: 36.80, value: 18400, gain: 4400, gainPercent: 31.4, allocation: 7.3 },
];

export const startupPortfolio = [
  { id: '1', name: 'NexaAI', stage: 'Series B', sector: 'AI/ML', invested: 250000, currentValue: 820000, return: '+228%', ownership: '2.1%', status: 'growing' },
  { id: '2', name: 'GreenVault', stage: 'Series A', sector: 'CleanTech', invested: 100000, currentValue: 185000, return: '+85%', ownership: '1.8%', status: 'growing' },
  { id: '3', name: 'HealthBridge', stage: 'Seed', sector: 'HealthTech', invested: 50000, currentValue: 38000, return: '-24%', ownership: '3.2%', status: 'at-risk' },
  { id: '4', name: 'FinWave', stage: 'Series C', sector: 'FinTech', invested: 500000, currentValue: 1400000, return: '+180%', ownership: '0.9%', status: 'growing' },
  { id: '5', name: 'SpaceLogix', stage: 'Pre-Seed', sector: 'Aerospace', invested: 25000, currentValue: 25000, return: '0%', ownership: '4.5%', status: 'stable' },
];

// ─── Opportunities ────────────────────────────────────────────────────────────

export const opportunities: Opportunity[] = [
  { id: '1', title: 'TSLA Deep Value Play', type: 'stock', score: 92, risk: 'medium', upside: '+38%', description: 'Tesla trading at significant discount to intrinsic value with EV market tailwinds.', tags: ['EV', 'Growth', 'AI'] },
  { id: '2', title: 'AI Infrastructure Sector', type: 'sector', score: 88, risk: 'medium', upside: '+65%', description: 'Data centers and AI chips positioned for massive multi-year growth cycle.', tags: ['AI', 'Tech', 'Infrastructure'] },
  { id: '3', title: 'CleanTech Startup Bundle', type: 'startup', score: 79, risk: 'high', upside: '+200%', description: 'Series B cleantech startup with patented carbon capture technology.', tags: ['Startup', 'Green', 'Series B'] },
  { id: '4', title: 'Healthcare REITs', type: 'stock', score: 85, risk: 'low', upside: '+22%', description: 'Senior living REITs undervalued post-pandemic with strong demographic tailwinds.', tags: ['REIT', 'Healthcare', 'Dividend'] },
  { id: '5', title: 'Emerging Market India ETF', type: 'sector', score: 81, risk: 'medium', upside: '+45%', description: 'India poised to be fastest-growing major economy through 2030.', tags: ['India', 'EM', 'Growth'] },
  { id: '6', title: 'FinTech Acquisition Target', type: 'acquisition', score: 76, risk: 'high', upside: '+150%', description: 'Profitable B2B payments company with strategic acquirer interest.', tags: ['FinTech', 'M&A', 'B2B'] },
];

// ─── Chart Data ───────────────────────────────────────────────────────────────

export const portfolioChartData: ChartDataPoint[] = [
  { date: 'Jan', value: 980000, benchmark: 920000 },
  { date: 'Feb', value: 1020000, benchmark: 935000 },
  { date: 'Mar', value: 995000, benchmark: 910000 },
  { date: 'Apr', value: 1080000, benchmark: 965000 },
  { date: 'May', value: 1120000, benchmark: 990000 },
  { date: 'Jun', value: 1095000, benchmark: 985000 },
  { date: 'Jul', value: 1180000, benchmark: 1020000 },
  { date: 'Aug', value: 1145000, benchmark: 1010000 },
  { date: 'Sep', value: 1210000, benchmark: 1045000 },
  { date: 'Oct', value: 1190000, benchmark: 1050000 },
  { date: 'Nov', value: 1240000, benchmark: 1075000 },
  { date: 'Dec', value: 1245830, benchmark: 1080000 },
];

export const netWorthData: ChartDataPoint[] = [
  { date: 'Jan', value: 2200000 },
  { date: 'Feb', value: 2280000 },
  { date: 'Mar', value: 2350000 },
  { date: 'Apr', value: 2410000 },
  { date: 'May', value: 2480000 },
  { date: 'Jun', value: 2520000 },
  { date: 'Jul', value: 2590000 },
  { date: 'Aug', value: 2650000 },
  { date: 'Sep', value: 2710000 },
  { date: 'Oct', value: 2760000 },
  { date: 'Nov', value: 2810000 },
  { date: 'Dec', value: 2847500 },
];

export const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
  { month: 'Feb', revenue: 48000, expenses: 30000, profit: 18000 },
  { month: 'Mar', revenue: 52000, expenses: 31000, profit: 21000 },
  { month: 'Apr', revenue: 61000, expenses: 34000, profit: 27000 },
  { month: 'May', revenue: 58000, expenses: 32000, profit: 26000 },
  { month: 'Jun', revenue: 72000, expenses: 38000, profit: 34000 },
];

export const adminRevenueData = [
  { month: 'Jan', mrr: 48200, users: 8400, churn: 2.1 },
  { month: 'Feb', mrr: 52800, users: 9200, churn: 1.9 },
  { month: 'Mar', mrr: 58400, users: 10100, churn: 1.7 },
  { month: 'Apr', mrr: 65200, users: 11300, churn: 1.6 },
  { month: 'May', mrr: 71800, users: 12400, churn: 1.5 },
  { month: 'Jun', mrr: 78500, users: 13800, churn: 1.4 },
];

export const assetAllocationData = [
  { name: 'US Stocks', value: 45, color: '#10B981' },
  { name: 'International', value: 20, color: '#F59E0B' },
  { name: 'ETFs', value: 15, color: '#3B82F6' },
  { name: 'Real Estate', value: 12, color: '#8B5CF6' },
  { name: 'Cash', value: 5, color: '#64748B' },
  { name: 'Startups', value: 3, color: '#EF4444' },
];

// ─── Research Reports ─────────────────────────────────────────────────────────

export const researchReports: ResearchReport[] = [
  { id: '1', title: 'Deep Dive: AI Infrastructure Supercycle 2024–2030', author: 'Marcus Chen', authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', category: 'Technology', price: 299, rating: 4.9, reviews: 342, date: '2024-01-15', summary: 'Comprehensive analysis of AI infrastructure investment opportunities across the value chain.', tags: ['AI', 'Tech', 'Infrastructure'] },
  { id: '2', title: 'Value Traps vs Value Opportunities: A Framework', author: 'Sarah Williams', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face', category: 'Value Investing', price: 149, rating: 4.8, reviews: 891, date: '2024-01-10', summary: 'How to distinguish genuine undervaluation from structural decline using quantitative filters.', tags: ['Value', 'Framework', 'Analysis'] },
  { id: '3', title: 'Emerging Markets 2024: India & Southeast Asia', author: 'Raj Patel', authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', category: 'Global Markets', price: 199, rating: 4.7, reviews: 256, date: '2024-01-08', summary: 'In-depth analysis of high-growth emerging market opportunities in Asia-Pacific region.', tags: ['EM', 'India', 'ASEAN'] },
];

export const analystReports = [
  { id: '1', title: 'AAPL Q4 2024 Deep Dive: Buy Below $185', status: 'published', views: 2840, purchases: 142, revenue: 21300, date: '2024-01-20' },
  { id: '2', title: 'India Banking Sector: Hidden Champions', status: 'published', views: 1920, purchases: 89, revenue: 13350, date: '2024-01-15' },
  { id: '3', title: 'Biotech Small-Cap Screener Q1 2024', status: 'draft', views: 0, purchases: 0, revenue: 0, date: '2024-01-25' },
];

// ─── Courses ──────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  { id: '1', title: 'Value Investing Masterclass', instructor: 'Warren-style Analysis', category: 'Investing', level: 'intermediate', duration: '24h', enrolled: 12450, rating: 4.9, price: 299, image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop', progress: 65 },
  { id: '2', title: 'Portfolio Construction & Risk Management', instructor: 'Quantitative Methods', category: 'Portfolio', level: 'advanced', duration: '18h', enrolled: 8920, rating: 4.8, price: 249, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop', progress: 30 },
  { id: '3', title: 'Financial Statement Analysis', instructor: 'CFA Curriculum', category: 'Fundamentals', level: 'beginner', duration: '12h', enrolled: 21300, rating: 4.7, price: 149, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop' },
  { id: '4', title: 'Startup Valuation & VC Investing', instructor: 'VC Partner Series', category: 'Startup', level: 'advanced', duration: '20h', enrolled: 5670, rating: 4.9, price: 399, image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop' },
];

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const pricingPlans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', price: { monthly: 29, annual: 19 }, description: 'Perfect for individual investors getting started.', features: ['5 Portfolio Watchlists', 'Basic Stock Screener', 'Market News Feed', '10 AI Queries/month', 'Community Access', 'Mobile App'], highlighted: false, cta: 'Start Free Trial' },
  { id: 'investor_pro', name: 'Investor Pro', price: { monthly: 79, annual: 59 }, description: 'For serious investors who want deeper analysis.', features: ['Unlimited Watchlists', 'Advanced Stock Screener', 'AI Wealth Advisor (100/mo)', 'Portfolio Analytics', 'Research Marketplace Access', 'Opportunity Discovery', 'Priority Support'], highlighted: true, badge: 'Most Popular', cta: 'Start Free Trial' },
  { id: 'wealth_builder', name: 'Wealth Builder', price: { monthly: 149, annual: 109 }, description: 'For wealth managers and active investors.', features: ['Everything in Pro', 'Unlimited AI Advisor', 'Startup Intelligence Module', 'Custom Research Reports', 'Advanced Analytics', 'API Access', 'White-glove Onboarding'], highlighted: false, cta: 'Start Free Trial' },
  { id: 'enterprise', name: 'Enterprise', price: { monthly: 499, annual: 399 }, description: 'For family offices and institutional investors.', features: ['Everything in Wealth Builder', 'Dedicated Account Manager', 'Custom Integrations', 'Team Collaboration (25 seats)', 'SOC 2 Compliance', 'SLA Guarantee', 'Custom AI Models'], highlighted: false, cta: 'Contact Sales' },
];

// ─── AI Insights ──────────────────────────────────────────────────────────────

export const aiInsights: AIInsight[] = [
  { id: '1', type: 'opportunity', title: 'NVDA shows oversold RSI signal', description: 'NVIDIA has entered oversold territory on daily charts. Historical data suggests 78% probability of 15%+ recovery within 30 days.', confidence: 82, timestamp: '2 hours ago' },
  { id: '2', type: 'risk', title: 'Portfolio concentration risk detected', description: 'Tech sector now represents 68% of your equity portfolio. Consider rebalancing to reduce sector-specific risk exposure.', confidence: 95, timestamp: '4 hours ago' },
  { id: '3', type: 'action', title: 'Rebalancing opportunity identified', description: 'Your target allocation drift has exceeded 5% threshold. Rebalancing now could improve Sharpe ratio by an estimated 0.3.', confidence: 88, timestamp: '1 day ago' },
  { id: '4', type: 'info', title: 'Earnings season alert: 8 holdings reporting', description: 'AAPL, MSFT, NVDA among 8 of your holdings reporting earnings in the next 14 days. Historical beat rate: 87%.', confidence: 100, timestamp: '1 day ago' },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = [
  { name: 'Robert Finch', role: 'Family Office Director', company: 'Finch Capital Partners', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face', quote: 'ValueUnlocked has transformed how we conduct investment research. The AI insights are remarkably accurate and save our team 20+ hours per week.', rating: 5, portfolioGrowth: '+34.2%' },
  { name: 'Jennifer Walsh', role: 'Independent Wealth Advisor', company: 'Walsh Financial Group', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face', quote: 'My clients have seen exceptional returns since I started using the opportunity discovery module. It finds gems that traditional research misses entirely.', rating: 5, portfolioGrowth: '+28.7%' },
  { name: 'David Kim', role: 'Value Investor', company: 'Private Investor', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', quote: 'The startup intelligence module helped me identify two unicorns before their Series C. The ROI on my subscription is over 1000x.', rating: 5, portfolioGrowth: '+156%' },
  { name: 'Priya Sharma', role: 'Hedge Fund Analyst', company: 'Meridian Capital', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', quote: 'Bloomberg is great for data, but ValueUnlocked actually interprets it with intelligence. The AI recommendations have been consistently alpha-generating.', rating: 5, portfolioGrowth: '+41.5%' },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = [
  { id: '1', title: 'The Hidden Value in Overlooked Small-Cap Stocks', excerpt: 'How systematic screening can uncover 10-baggers before institutional investors notice them.', author: 'Marcus Chen', date: 'Jan 28, 2024', readTime: '8 min', category: 'Value Investing', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop', tags: ['Value', 'Small-Cap', 'Alpha'] },
  { id: '2', title: 'AI-Powered Portfolio Management: The Future Is Now', excerpt: 'How machine learning models are beating traditional portfolio managers and what this means for investors.', author: 'Sarah Williams', date: 'Jan 25, 2024', readTime: '12 min', category: 'Technology', image: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&h=400&fit=crop', tags: ['AI', 'Portfolio', 'Technology'] },
  { id: '3', title: 'Startup Valuation in 2024: What Actually Matters', excerpt: 'Beyond the metrics: the qualitative factors that separate unicorns from value traps in early-stage investing.', author: 'Raj Patel', date: 'Jan 22, 2024', readTime: '10 min', category: 'Startups', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop', tags: ['Startup', 'Valuation', 'VC'] },
  { id: '4', title: 'The Emerging Market Opportunity Nobody Is Talking About', excerpt: "India's financial sector transformation is creating generational wealth-building opportunities for early investors.", author: 'Aisha Johnson', date: 'Jan 19, 2024', readTime: '7 min', category: 'Global Markets', image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=400&fit=crop', tags: ['India', 'EM', 'Finance'] },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqItems = [
  { category: 'AI & Features', q: 'How does the AI Wealth Advisor work?', a: 'Our AI Wealth Advisor uses advanced machine learning models trained on decades of market data, combining fundamental analysis, technical signals, macroeconomic indicators, and alternative data to provide personalized investment recommendations tailored to your risk profile and goals.' },
  { category: 'Security', q: 'Is my financial data secure?', a: 'Absolutely. We use bank-grade 256-bit AES encryption for all data at rest and in transit. We are SOC 2 Type II certified and comply with all applicable financial data regulations including GDPR and CCPA. We never sell your data.' },
  { category: 'AI & Features', q: 'How accurate are the opportunity scores?', a: 'Our Opportunity Scoring algorithm has been backtested across 15 years of market data and achieves a 73% directional accuracy rate over a 90-day horizon. Scores above 80 have historically delivered 2.1x the market return on average.' },
  { category: 'Integrations', q: 'Can I connect my existing brokerage accounts?', a: 'Yes, we support direct integration with 50+ brokerages including Schwab, Fidelity, Interactive Brokers, TD Ameritrade, and Robinhood via secure read-only API connections. Your account credentials are never stored on our servers.' },
  { category: 'AI & Features', q: 'What is the Research Marketplace?', a: 'The Research Marketplace is a curated platform where top analysts, fund managers, and investment researchers publish their best ideas and reports. All analysts are vetted for track record. You can purchase individual reports or subscribe for unlimited access.' },
  { category: 'Pricing', q: 'Do you offer a free trial?', a: 'Yes, all paid plans include a 14-day free trial with full feature access and no credit card required. We also offer a free Starter tier with limited features for users who want to explore the platform.' },
  { category: 'AI & Features', q: 'How does portfolio benchmarking work?', a: 'Your portfolio is automatically benchmarked against relevant indices (S&P 500, Russell 2000, MSCI World, etc.) based on your asset allocation. Risk-adjusted returns (Sharpe ratio, Sortino ratio) are calculated daily and displayed in your analytics dashboard.' },
  { category: 'AI & Features', q: 'Can I use ValueUnlocked for business analysis?', a: 'Yes, our Business Intelligence module supports company valuation, competitive analysis, market sizing, and due diligence workflows. It is particularly popular with M&A advisors, PE analysts, and strategic consultants.' },
];

// ─── Advisor / Entrepreneur / Analyst ────────────────────────────────────────

export const advisorClients = [
  { id: '1', name: 'Robert Finch', aum: '$4.2M', portfolio: '+18.4%', risk: 'Moderate', nextReview: 'Feb 15', status: 'active' },
  { id: '2', name: 'Linda Park', aum: '$2.8M', portfolio: '+22.1%', risk: 'Aggressive', nextReview: 'Feb 20', status: 'active' },
  { id: '3', name: 'Thomas Berg', aum: '$8.1M', portfolio: '+14.8%', risk: 'Conservative', nextReview: 'Mar 01', status: 'review' },
  { id: '4', name: 'Mia Johnson', aum: '$1.2M', portfolio: '+9.3%', risk: 'Moderate', nextReview: 'Mar 10', status: 'active' },
];

export const entrepreneurMetrics = [
  { label: 'Business Valuation', value: '$12.4M', change: '+8.2%', positive: true },
  { label: 'Monthly Revenue', value: '$142K', change: '+15.3%', positive: true },
  { label: 'Runway', value: '18 months', change: '+3 months', positive: true },
  { label: 'Burn Rate', value: '$48K/mo', change: '-5.1%', positive: true },
];

export const adminStats = [
  { label: 'Total Users', value: '185,420', change: '+2,340 this week', positive: true },
  { label: 'Monthly MRR', value: '$782,400', change: '+12.4%', positive: true },
  { label: 'Active Subscriptions', value: '42,180', change: '+890 this week', positive: true },
  { label: 'Churn Rate', value: '1.4%', change: '-0.2%', positive: true },
];

export const recentUsers = [
  { id: '1', name: 'Aarav Singh', email: 'aarav@example.com', role: 'investor', plan: 'investor_pro', joined: '2 hours ago', status: 'active' },
  { id: '2', name: 'Claire Dubois', email: 'claire@example.com', role: 'advisor', plan: 'enterprise', joined: '4 hours ago', status: 'active' },
  { id: '3', name: 'James Okafor', email: 'james@example.com', role: 'analyst', plan: 'investor_pro', joined: '6 hours ago', status: 'pending' },
  { id: '4', name: 'Yuki Tanaka', email: 'yuki@example.com', role: 'entrepreneur', plan: 'starter', joined: '8 hours ago', status: 'active' },
  { id: '5', name: 'Sofia Romano', email: 'sofia@example.com', role: 'value_investor', plan: 'wealth_builder', joined: '12 hours ago', status: 'active' },
];
