import { useState, useRef, useEffect } from 'react';
import { Send, Brain, Sparkles, TrendingUp, Target, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStoredUser } from '@/lib/auth';

interface Message { role: 'user' | 'ai'; content: string; timestamp: string; }

const suggestions = [
  "How should I rebalance my portfolio?",
  "What's my retirement readiness score?",
  "Analyze my tax optimization opportunities",
  "What sectors should I overweight now?",
];

const aiResponses: Record<string, string> = {
  default: "Based on your current portfolio and risk profile, I recommend focusing on your existing positions while gradually diversifying into emerging market ETFs. Your Sharpe ratio of 1.84 is excellent — the goal is to maintain this while reducing single-stock concentration risk in technology (currently 68%).",
  rebalance: "Your portfolio drift analysis shows: Tech sector at 68% vs. target 50% (18% overweight). I recommend gradually trimming NVDA and AAPL positions and deploying into Healthcare REITs (WELL, VTR) and Consumer Staples ETF (XLP). This would reduce volatility by an estimated 12% while maintaining return expectations.",
  retirement: "Based on your current net worth of $2.85M and 7% annual growth projection, you are on track to achieve a $5M+ retirement corpus by age 55. Monthly contribution needed to maintain this trajectory: $4,200. Current retirement readiness score: 78/100 — Ahead of Schedule.",
  tax: "I have identified 3 tax-loss harvesting opportunities: AMZN unrealized loss of $2,840 can offset your NVDA gains. Consider Roth conversion of $50K this year given your marginal bracket. Qualified Opportunity Zone investments could defer $85K in capital gains through 2026.",
};

export default function AIAdvisorPage() {
  const user = getStoredUser();
  const firstName = user?.name?.split(' ')[0] ?? 'Investor';
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello, ${firstName}. I am your AI Wealth Advisor. I have analyzed your portfolio and financial profile. Your overall wealth score is 87/100 — excellent position. How can I help you optimize your financial strategy today?`, timestamp: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text, timestamp: 'Just now' };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);
    const key = text.toLowerCase().includes('rebalanc') ? 'rebalance' : text.toLowerCase().includes('retire') ? 'retirement' : text.toLowerCase().includes('tax') ? 'tax' : 'default';
    setTimeout(() => {
      setMessages(p => [...p, { role: 'ai', content: aiResponses[key], timestamp: 'Just now' }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[calc(100vh-160px)]">
      {/* Chat */}
      <div className="xl:col-span-2 flex flex-col bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden h-[500px] xl:h-full">
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-xl"><Brain className="w-5 h-5 text-purple-500" /></div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">AI Wealth Advisor</h3>
            <p className="text-xs text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Online · GPT-5 Powered</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'gradient-growth text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10'}`}>
                {msg.role === 'ai' && <Sparkles className="w-3.5 h-3.5 text-purple-400 mb-1.5" />}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-slate-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-white/10">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-slate-200 dark:border-white/10 text-left">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage(input)} placeholder="Ask your AI Wealth Advisor..." className="flex-1" />
            <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} className="gradient-growth text-white border-0 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="space-y-4">
        {[
          { icon: TrendingUp, title: 'Investment Plan', value: 'On Track', sub: '+$18,420/mo avg.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { icon: Target, title: 'Goal Progress', value: '78%', sub: 'Retirement by 55', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { icon: Shield, title: 'Risk Management', value: 'Balanced', sub: 'Beta 0.76 vs mkt', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${item.bg}`}><Icon className={`w-4 h-4 ${item.color}`} /></div>
                <div>
                  <p className="text-xs text-slate-400">{item.title}</p>
                  <p className={`font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{item.sub}</p>
            </div>
          );
        })}

        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5">
          <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-3">Quick Actions</h4>
          <div className="space-y-2">
            {['Generate Wealth Report', 'Run Retirement Simulation', 'Tax Optimization Scan', 'Rebalancing Proposal'].map((action, i) => (
              <button key={i} onClick={() => sendMessage(action)} className="w-full text-left text-xs px-3 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
