import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-dashboard.jpg';

const stats = [
  { label: 'AUM Tracked', value: '$2.4T', suffix: '' },
  { label: 'Active Investors', value: '185K', suffix: '+' },
  { label: 'Avg. Alpha Generated', value: '18.7', suffix: '%' },
  { label: 'Opportunities Discovered', value: '24K', suffix: '+' },
];

const floatingCards = [
  { title: 'Portfolio Value', value: '+$18,420', change: '+1.5%', color: 'text-emerald-400', icon: TrendingUp },
  { title: 'Opportunity Score', value: '87/100', change: 'High Conviction', color: 'text-gold-400', icon: Zap },
  { title: 'Risk Score', value: '6.2/10', change: 'Balanced', color: 'text-blue-400', icon: Shield },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Wealth Intelligence Dashboard" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)', backgroundSize: '60px 60px'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow" />
              <span className="text-emerald-400 text-xs font-medium">AI-Powered Wealth Intelligence Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Unlock Hidden{' '}
              <span className="text-gradient-emerald">Opportunities.</span>
              <br />
              Build Lasting{' '}
              <span className="text-gradient-gold">Wealth.</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-lg">
              AI-powered investment research, portfolio intelligence, startup analysis, wealth planning, and opportunity discovery — all in one executive-grade platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                onClick={() => navigate('/register')}
                size="lg"
                className="gradient-growth text-white border-0 shadow-glow-emerald hover:opacity-90 text-base px-8 h-12 group"
              >
                Start Investing Smarter
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/features')}
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 text-base px-8 h-12 bg-transparent"
              >
                <Play className="mr-2 w-4 h-4" />
                Explore Opportunities
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}<span className="text-emerald-400">{stat.suffix}</span></p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Portfolio Performance</p>
                  <p className="text-white text-2xl font-bold mt-0.5">$1,245,830</p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <span className="text-emerald-400 text-sm font-semibold">+24.7% YTD</span>
                </div>
              </div>
              <div className="h-32 flex items-end gap-1.5">
                {[40,55,48,62,58,72,65,80,75,88,82,95].map((h,i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{height:`${h}%`, background:`linear-gradient(to top, #10B981, #34d399)`, opacity: i === 11 ? 1 : 0.6 + (i/11)*0.4}} />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 text-center">12-Month Wealth Growth Trajectory</p>
            </div>

            <div className="mt-4 space-y-3">
              {floatingCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className={`glass rounded-xl p-4 border border-white/10 animate-float`} style={{animationDelay: `${i * 0.5}s`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${card.color}`} />
                        <span className="text-slate-300 text-sm">{card.title}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${card.color}`}>{card.value}</p>
                        <p className="text-xs text-slate-400">{card.change}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
