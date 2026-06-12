import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Twitter, Linkedin, Github, Youtube, Mail, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const footerLinks = {
  Platform: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Research Marketplace', href: '/research-marketplace' },
    { label: 'Community', href: '/community' },
    { label: 'Learning Academy', href: '/learning-academy' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Learning Academy', href: '/learning-academy' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Opportunity Discovery', href: '/opportunity-discovery' },
    { label: 'Startup Intelligence', href: '/startup-intelligence' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) return toast.error('Please enter a valid email address');
    toast.success('Subscribed! Welcome to the ValueUnlocked community.');
    setEmail('');
  };

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Value<span className="text-emerald-400">Unlocked</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              AI-powered wealth intelligence for serious investors. Discover hidden opportunities, manage risk, and build lasting wealth.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Youtube, Github].map((Icon, i) => (
                <a key={i} href="#" onClick={e => { e.preventDefault(); toast.info('Opening social link...'); }} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-slate-400">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">Stay ahead of the market</h4>
            <p className="text-slate-400 text-xs">Weekly insights from top analysts. No spam, ever.</p>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-500 w-full lg:w-64"
            />
            <Button onClick={handleSubscribe} className="gradient-growth border-0 text-white hover:opacity-90 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">© 2024 ValueUnlocked Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-emerald-400 text-xs transition-colors">Privacy</Link>
            <Link to="/terms" className="text-slate-500 hover:text-emerald-400 text-xs transition-colors">Terms</Link>
            <Link to="/faq" className="text-slate-500 hover:text-emerald-400 text-xs transition-colors">FAQ</Link>
            <Link to="/contact" className="text-slate-500 hover:text-emerald-400 text-xs transition-colors">Contact</Link>
          </div>
          <p className="text-slate-600 text-xs text-center">
            Investment research for informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
