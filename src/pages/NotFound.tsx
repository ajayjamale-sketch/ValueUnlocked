import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Value<span className="text-emerald-400">Unlocked</span></span>
        </div>

        {/* 404 Display */}
        <div className="relative mb-8">
          <p className="text-[140px] font-black text-white/5 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-7xl font-black text-emerald-400 leading-none">404</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved. Let us get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button className="gradient-growth text-white border-0 gap-2 px-6">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-6">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          {[
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
          ].map((link, i) => (
            <Link key={i} to={link.href} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
