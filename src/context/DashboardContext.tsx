import React, { createContext, useContext, useState, useEffect } from 'react';
import type { PortfolioAsset, Course, Opportunity } from '@/types';
import { portfolioAssets as initialPortfolioAssets, courses as initialCourses } from '@/lib/mockData';
import { toast } from 'sonner';

// Types not defined in src/types/index.ts
export interface Transaction {
  id: number;
  desc: string;
  amount: number;
  date: string;
  category: string;
}

export interface SavingsGoal {
  id: number;
  name: string;
  target: number;
  current: number;
  color: string;
}

export interface ThreadComment {
  id: number;
  author: string;
  content: string;
  time: string;
}

export interface CommunityThread {
  id: number;
  category: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  upvotes: number;
  time: string;
  pinned: boolean;
  content?: string;
}

export interface CommunityGroup {
  name: string;
  members: number;
  posts: number;
  color: string;
  joined?: boolean;
}

interface DashboardContextType {
  portfolioAssets: PortfolioAsset[];
  watchlist: string[];
  transactions: Transaction[];
  goals: SavingsGoal[];
  threads: CommunityThread[];
  comments: Record<number, ThreadComment[]>;
  groups: CommunityGroup[];
  courses: Course[];
  
  // Handlers
  addPosition: (symbol: string, name: string, type: PortfolioAsset['type'], quantity: number, avgPrice: number) => void;
  removePosition: (id: string) => void;
  executeRebalance: () => Promise<void>;
  toggleWatchlist: (symbol: string) => void;
  addTransaction: (desc: string, amount: number, category: string, type: 'expense' | 'income') => void;
  deleteTransaction: (id: number) => void;
  addGoal: (name: string, target: number, current: number) => void;
  contributeToGoal: (goalId: number, amount: number) => void;
  addThread: (title: string, category: string, content: string, author?: string) => void;
  addComment: (threadId: number, content: string, author?: string) => void;
  toggleJoinGroup: (groupName: string) => void;
  enrollInCourse: (courseId: string) => void;
  updateCourseProgress: (courseId: string, increment: number) => void;
  upvoteThread: (threadId: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Initial Data templates
const defaultTransactions: Transaction[] = [
  { id: 1, desc: 'AAPL Stock Purchase', amount: -4750, date: 'Today', category: 'Investment' },
  { id: 2, desc: 'Salary Deposit', amount: 24500, date: 'Yesterday', category: 'Income' },
  { id: 3, desc: 'Monthly Rent', amount: -3500, date: 'Dec 1', category: 'Housing' },
  { id: 4, desc: 'Dividend — BRK.B', amount: 312, date: 'Nov 30', category: 'Dividend' },
  { id: 5, desc: 'Grocery Shopping', amount: -245, date: 'Nov 29', category: 'Food' },
  { id: 6, desc: 'Netflix Subscription', amount: -18, date: 'Nov 28', category: 'Entertainment' },
];

const defaultGoals: SavingsGoal[] = [
  { id: 1, name: 'Emergency Fund', target: 50000, current: 42000, color: 'bg-emerald-500' },
  { id: 2, name: 'Down Payment', target: 200000, current: 145000, color: 'bg-blue-500' },
  { id: 3, name: 'College Fund', target: 100000, current: 38000, color: 'bg-purple-500' },
  { id: 4, name: 'Vacation', target: 15000, current: 9500, color: 'bg-amber-500' },
];

const defaultThreads: CommunityThread[] = [
  { id: 1, category: 'Value Investing', title: 'Is Berkshire still a buy at current prices?', author: 'Marcus C.', replies: 4, views: 1240, upvotes: 124, time: '2h ago', pinned: true, content: 'With the cash pile exceeding $150B, Berkshire seems positioned to capitalize on market drawdowns, but is it a buy at 1.5x book value? Interested in fundamental analyst perspectives.' },
  { id: 2, category: 'AI & Tech', title: 'NVIDIA at $875 — still room to run or time to take profits?', author: 'Sarah W.', replies: 3, views: 3400, upvotes: 312, time: '4h ago', pinned: false, content: 'B100 announcements look revolutionary, but valuations are starting to discount a lot of future growth. Are we taking chips off the table or letting it ride?' },
  { id: 3, category: 'Startups', title: 'Best frameworks for evaluating Series A startups in 2024', author: 'Raj P.', replies: 2, views: 890, upvotes: 87, time: '6h ago', pinned: false, content: 'How do you weight founder quality vs early PMF and cohort retention in a high-rate environment?' },
  { id: 4, category: 'Personal Finance', title: 'How I paid off $140K debt in 3 years — full breakdown', author: 'Priya K.', replies: 1, views: 8920, upvotes: 891, time: '1d ago', pinned: false, content: 'Sharing my spreadsheet and breakdown of the debt avalanche method combined with aggressive side hustles.' },
  { id: 5, category: 'Global Markets', title: 'India vs China: Where are you allocating in 2024?', author: 'Alex S.', replies: 2, views: 2100, upvotes: 203, time: '1d ago', pinned: false, content: 'Structural reforms in India look solid, but valuations are high. China is cheap but carries regulatory risk. What is your EM strategy?' },
];

const defaultComments: Record<number, ThreadComment[]> = {
  1: [
    { id: 1, author: 'Benjamin G.', content: 'It remains a solid defensive play. Book value is high, but the operating businesses are rock solid.', time: '1h ago' },
    { id: 2, author: 'Sophia C.', content: 'Agreed, and the share repurchase program provides a floor under the price.', time: '45m ago' },
    { id: 3, author: 'Warren Fan', content: 'Never bet against the American tailwind, nor the cash compounder.', time: '30m ago' },
    { id: 4, author: 'Alexander S.', content: 'I am holding my position but allocating new funds elsewhere right now.', time: '10m ago' },
  ],
  2: [
    { id: 1, author: 'TechBull', content: 'Let it ride! The chip demand is far outstripping supply for the next 4 quarters minimum.', time: '3h ago' },
    { id: 2, author: 'RiskManager', content: 'Trimmed 20% today. It is prudent portfolio hygiene, concentration was getting too high.', time: '2h ago' },
    { id: 3, author: 'QuantTrader', content: 'Chart shows short-term consolidation but structural trend remains firmly bullish.', time: '1h ago' },
  ],
  3: [
    { id: 1, author: 'VCPartner', content: 'Product-market fit metrics are key. Founder quality matters, but retention is the ultimate truth.', time: '5h ago' },
    { id: 2, author: 'NexaFounder', content: 'Net revenue retention (NRR) above 120% is our primary filter right now.', time: '4h ago' },
  ],
  4: [
    { id: 1, author: 'DebtFree', content: 'Incredible journey! The discipline required to do this is inspiring.', time: '12h ago' },
  ],
  5: [
    { id: 1, author: 'EM_Bull', content: 'Overweight India. Demographic trends are undeniable for the next decade.', time: '18h ago' },
    { id: 2, author: 'ValueSeeker', content: 'China offers massive valuation support. High risk but asymmetrical reward.', time: '15h ago' },
  ],
};

const defaultGroups: CommunityGroup[] = [
  { name: 'Value Investing Club', members: 8420, posts: 124, color: 'from-emerald-500 to-teal-600', joined: false },
  { name: 'Startup Scouts', members: 3200, posts: 89, color: 'from-purple-500 to-violet-600', joined: false },
  { name: 'Dividend Investors', members: 5800, posts: 201, color: 'from-amber-500 to-orange-600', joined: false },
  { name: 'Tech Sector Forum', members: 12400, posts: 342, color: 'from-blue-500 to-indigo-600', joined: false },
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>(() => {
    const stored = localStorage.getItem('vu_portfolio_assets');
    return stored ? JSON.parse(stored) : initialPortfolioAssets;
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const stored = localStorage.getItem('vu_watchlist');
    return stored ? JSON.parse(stored) : ['AAPL', 'NVDA'];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('vu_transactions');
    return stored ? JSON.parse(stored) : defaultTransactions;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const stored = localStorage.getItem('vu_goals');
    return stored ? JSON.parse(stored) : defaultGoals;
  });

  const [threads, setThreads] = useState<CommunityThread[]>(() => {
    const stored = localStorage.getItem('vu_threads');
    return stored ? JSON.parse(stored) : defaultThreads;
  });

  const [comments, setComments] = useState<Record<number, ThreadComment[]>>(() => {
    const stored = localStorage.getItem('vu_comments');
    return stored ? JSON.parse(stored) : defaultComments;
  });

  const [groups, setGroups] = useState<CommunityGroup[]>(() => {
    const stored = localStorage.getItem('vu_groups');
    return stored ? JSON.parse(stored) : defaultGroups;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = localStorage.getItem('vu_courses');
    return stored ? JSON.parse(stored) : initialCourses;
  });

  // Save changes to local storage
  useEffect(() => { localStorage.setItem('vu_portfolio_assets', JSON.stringify(portfolioAssets)); }, [portfolioAssets]);
  useEffect(() => { localStorage.setItem('vu_watchlist', JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem('vu_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('vu_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('vu_threads', JSON.stringify(threads)); }, [threads]);
  useEffect(() => { localStorage.setItem('vu_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('vu_groups', JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem('vu_courses', JSON.stringify(courses)); }, [courses]);

  // Handlers
  const addPosition = (symbol: string, name: string, type: PortfolioAsset['type'], quantity: number, avgPrice: number) => {
    const currentPrice = avgPrice * (1 + (Math.random() * 0.2 - 0.05)); // simulate a small price deviation
    const value = quantity * currentPrice;
    const gain = (currentPrice - avgPrice) * quantity;
    const gainPercent = ((currentPrice - avgPrice) / avgPrice) * 100;
    
    // Check if asset already exists
    const existingIndex = portfolioAssets.findIndex(a => a.symbol.toUpperCase() === symbol.toUpperCase());
    let newAssets = [...portfolioAssets];

    if (existingIndex > -1) {
      const existing = portfolioAssets[existingIndex];
      const newQty = existing.quantity + quantity;
      const newAvgPrice = ((existing.quantity * existing.avgPrice) + (quantity * avgPrice)) / newQty;
      const newValue = newQty * currentPrice;
      const newGain = (currentPrice - newAvgPrice) * newQty;
      const newGainPercent = ((currentPrice - newAvgPrice) / newAvgPrice) * 100;
      
      newAssets[existingIndex] = {
        ...existing,
        quantity: newQty,
        avgPrice: parseFloat(newAvgPrice.toFixed(2)),
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        value: parseFloat(newValue.toFixed(0)),
        gain: parseFloat(newGain.toFixed(0)),
        gainPercent: parseFloat(newGainPercent.toFixed(1)),
      };
    } else {
      newAssets.push({
        id: Date.now().toString(),
        symbol: symbol.toUpperCase(),
        name: name || symbol.toUpperCase(),
        type,
        quantity,
        avgPrice,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
        value: parseFloat(value.toFixed(0)),
        gain: parseFloat(gain.toFixed(0)),
        gainPercent: parseFloat(gainPercent.toFixed(1)),
        allocation: 0 // Will recalculate below
      });
    }

    const totalVal = newAssets.reduce((acc, a) => acc + a.value, 0);
    newAssets = newAssets.map(a => ({
      ...a,
      allocation: parseFloat(((a.value / totalVal) * 100).toFixed(1))
    }));

    setPortfolioAssets(newAssets);
    toast.success(`${symbol.toUpperCase()} successfully added to your portfolio!`);
  };

  const removePosition = (id: string) => {
    const item = portfolioAssets.find(a => a.id === id);
    const updated = portfolioAssets.filter(a => a.id !== id);
    const totalVal = updated.reduce((acc, a) => acc + a.value, 0);
    const finalAssets = updated.map(a => ({
      ...a,
      allocation: totalVal > 0 ? parseFloat(((a.value / totalVal) * 100).toFixed(1)) : 0
    }));
    
    setPortfolioAssets(finalAssets);
    if (item) {
      toast.success(`Removed ${item.symbol} from your portfolio.`);
    }
  };

  const executeRebalance = (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let newAssets = portfolioAssets.map(a => {
          if (a.symbol === 'NVDA') {
            const newQty = Math.max(1, Math.round(a.quantity * 0.8));
            const newValue = newQty * a.currentPrice;
            const newGain = (a.currentPrice - a.avgPrice) * newQty;
            return {
              ...a,
              quantity: newQty,
              value: parseFloat(newValue.toFixed(0)),
              gain: parseFloat(newGain.toFixed(0)),
            };
          }
          if (a.symbol === 'AAPL') {
            const newQty = Math.max(1, Math.round(a.quantity * 0.9));
            const newValue = newQty * a.currentPrice;
            const newGain = (a.currentPrice - a.avgPrice) * newQty;
            return {
              ...a,
              quantity: newQty,
              value: parseFloat(newValue.toFixed(0)),
              gain: parseFloat(newGain.toFixed(0)),
            };
          }
          return a;
        });

        const xlvPrice = 140.00;
        const xlvInvested = 7000;
        const xlvQty = Math.round(xlvInvested / xlvPrice);
        const existingXLV = newAssets.find(a => a.symbol === 'XLV');
        
        if (existingXLV) {
          const newQty = existingXLV.quantity + xlvQty;
          const newValue = newQty * existingXLV.currentPrice;
          const newGain = (existingXLV.currentPrice - existingXLV.avgPrice) * newQty;
          newAssets = newAssets.map(a => a.symbol === 'XLV' ? {
            ...a,
            quantity: newQty,
            value: parseFloat(newValue.toFixed(0)),
            gain: parseFloat(newGain.toFixed(0)),
          } : a);
        } else {
          newAssets.push({
            id: 'xlv-rebalance',
            symbol: 'XLV',
            name: 'Healthcare Select Sector SPDR',
            type: 'etf',
            quantity: xlvQty,
            avgPrice: xlvPrice,
            currentPrice: xlvPrice,
            value: xlvInvested,
            gain: 0,
            gainPercent: 0,
            allocation: 0,
          });
        }
        
        const totalVal = newAssets.reduce((acc, a) => acc + a.value, 0);
        const finalAssets = newAssets.map(a => ({
          ...a,
          allocation: parseFloat(((a.value / totalVal) * 100).toFixed(1))
        }));

        setPortfolioAssets(finalAssets);
        toast.success('Portfolio successfully rebalanced: Trimmed Tech, added XLV.');
        resolve();
      }, 1000);
    });
  };

  const toggleWatchlist = (symbol: string) => {
    const cleanSym = symbol.toUpperCase();
    if (watchlist.includes(cleanSym)) {
      setWatchlist(prev => prev.filter(s => s !== cleanSym));
      toast.success(`Removed ${cleanSym} from your watchlist.`);
    } else {
      setWatchlist(prev => [...prev, cleanSym]);
      toast.success(`Added ${cleanSym} to your watchlist.`);
    }
  };

  const addTransaction = (desc: string, amount: number, category: string, type: 'expense' | 'income') => {
    const finalAmount = amount * (type === 'expense' ? -1 : 1);
    const newTx: Transaction = {
      id: Date.now(),
      desc,
      amount: finalAmount,
      date: 'Today',
      category,
    };
    setTransactions(prev => [newTx, ...prev]);
    toast.success('Transaction logged successfully.');
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast.success('Transaction removed.');
  };

  const addGoal = (name: string, target: number, current: number) => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-red-500'];
    const newG: SavingsGoal = {
      id: Date.now(),
      name,
      target,
      current: current || 0,
      color: colors[goals.length % colors.length],
    };
    setGoals(prev => [...prev, newG]);
    toast.success(`Savings Goal "${name}" created!`);
  };

  const contributeToGoal = (goalId: number, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const newAmt = Math.min(g.current + amount, g.target);
        toast.success(`Added $${amount.toLocaleString()} to "${g.name}".`);
        return { ...g, current: newAmt };
      }
      return g;
    }));
  };

  const addThread = (title: string, category: string, content: string, author = 'Alexander S.') => {
    const newT: CommunityThread = {
      id: Date.now(),
      title,
      category,
      author,
      replies: 0,
      views: 1,
      upvotes: 1,
      time: 'Just now',
      pinned: false,
      content,
    };
    setThreads(prev => [newT, ...prev]);
    setComments(prev => ({ ...prev, [newT.id]: [] }));
    toast.success('Discussion post published to the community!');
  };

  const addComment = (threadId: number, content: string, author = 'Alexander S.') => {
    const newComment: ThreadComment = {
      id: Date.now(),
      author,
      content,
      time: 'Just now'
    };
    setComments(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newComment]
    }));
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { ...t, replies: t.replies + 1 };
      }
      return t;
    }));
    toast.success('Comment posted successfully.');
  };

  const toggleJoinGroup = (groupName: string) => {
    setGroups(prev => prev.map(g => {
      if (g.name === groupName) {
        const nextJoined = !g.joined;
        const membersDelta = nextJoined ? 1 : -1;
        toast.success(nextJoined ? `Joined ${g.name}!` : `Left ${g.name}.`);
        return { ...g, joined: nextJoined, members: g.members + membersDelta };
      }
      return g;
    }));
  };

  const enrollInCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        toast.success(`Successfully enrolled in "${c.title}"!`);
        return { ...c, progress: 0 };
      }
      return c;
    }));
  };

  const updateCourseProgress = (courseId: string, increment: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const currentProgress = c.progress ?? 0;
        const newProgress = Math.min(currentProgress + increment, 100);
        if (newProgress === 100 && currentProgress < 100) {
          toast.success(`🎉 Congratulations! You have completed "${c.title}"!`);
        } else {
          toast.success(`Completed lesson in "${c.title}"!`);
        }
        return { ...c, progress: newProgress };
      }
      return c;
    }));
  };

  const upvoteThread = (threadId: number) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        toast.success(`Upvoted discussion: ${t.title}`);
        return { ...t, upvotes: t.upvotes + 1 };
      }
      return t;
    }));
  };

  return (
    <DashboardContext.Provider value={{
      portfolioAssets,
      watchlist,
      transactions,
      goals,
      threads,
      comments,
      groups,
      courses,
      
      addPosition,
      removePosition,
      executeRebalance,
      toggleWatchlist,
      addTransaction,
      deleteTransaction,
      addGoal,
      contributeToGoal,
      addThread,
      addComment,
      toggleJoinGroup,
      enrollInCourse,
      updateCourseProgress,
      upvoteThread
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
