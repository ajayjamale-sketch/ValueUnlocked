import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Award, Target, BarChart3, Users, Globe, Zap, ChevronRight, Mail, Phone, MapPin, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const team = [
  { name: 'Alexandra Sterling', role: 'CEO & Co-Founder', bg: 'from-emerald-500 to-teal-600', bio: 'Former Goldman Sachs MD. 15+ years in wealth management and fintech.' },
  { name: 'Marcus Chen', role: 'CTO & Co-Founder', bg: 'from-blue-500 to-indigo-600', bio: 'Ex-Google DeepMind. Led AI research for financial markets at Citadel.' },
  { name: 'Priya Kapoor', role: 'Head of AI Research', bg: 'from-purple-500 to-violet-600', bio: 'PhD in Quantitative Finance from MIT. Published 40+ research papers.' },
  { name: 'James Okafor', role: 'Head of Product', bg: 'from-amber-500 to-orange-600', bio: 'Former Bloomberg Terminal product lead. Built tools for 500K+ analysts.' },
  { name: 'Sarah Williams', role: 'Chief Investment Officer', bg: 'from-rose-500 to-pink-600', bio: 'Former Chief Strategist at Fidelity Investments. CFA charterholder.' },
  { name: 'David Park', role: 'VP of Engineering', bg: 'from-cyan-500 to-sky-600', bio: 'Former Staff Engineer at Stripe. Built payment infrastructure at scale.' },
];

const values = [
  { icon: Shield, title: 'Integrity First', desc: 'We provide objective, unbiased intelligence. No conflicts of interest, no hidden agendas. Our insights are for your benefit only.' },
  { icon: Zap, title: 'AI-Powered Precision', desc: 'We harness cutting-edge AI and machine learning to surface opportunities that traditional analysis misses.' },
  { icon: Users, title: 'Community Driven', desc: 'Our platform is shaped by the collective intelligence of thousands of investors, advisors, and analysts.' },
  { icon: Globe, title: 'Global Perspective', desc: 'We analyze opportunities across all asset classes and geographies, from US equities to emerging market startups.' },
];

const milestones = [
  { year: '2020', event: 'Founded by former Goldman Sachs and Google engineers with a shared vision for democratizing institutional-grade research.' },
  { year: '2021', event: 'Launched beta with 500 early-access investors. Raised $8M seed round led by Sequoia Capital.' },
  { year: '2022', event: 'Reached 50,000 users. Launched AI Wealth Advisor. Raised $45M Series A from Andreessen Horowitz.' },
  { year: '2023', event: 'Crossed 100,000 active subscribers. Launched Research Marketplace with 2,000+ expert analysts.' },
  { year: '2024', event: 'Reached 185,000+ users across 42 countries. Processing $12B in portfolio analytics daily. Series B in progress.' },
];

const stats = [
  { value: '185,000+', label: 'Active Users', icon: Users },
  { value: '$12B+', label: 'Assets Analyzed Daily', icon: BarChart3 },
  { value: '73%', label: 'AI Prediction Accuracy', icon: Target },
  { value: '42', label: 'Countries Served', icon: Globe },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0f2d1f] to-navy opacity-80" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6">Our Mission</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Democratizing <span className="text-emerald-400">Institutional-Grade</span> Investment Intelligence
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl mx-auto">
            We believe every investor — from individual savers to family offices — deserves access to the same powerful research tools and AI-driven insights that have historically only been available to the ultra-wealthy.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register"><Button className="gradient-growth text-white border-0 px-8 py-3 text-lg">Join ValueUnlocked</Button></Link>
            <Link to="/contact"><Button variant="outline" className="bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white px-8 py-3 text-lg">Contact Us</Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="text-center p-6 bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="w-12 h-12 gradient-growth rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The principles that guide every decision we make and every feature we build.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="p-6 bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 gradient-growth rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Our Journey</h2>
          </div>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-20 flex-shrink-0 text-right">
                  <span className="text-emerald-500 font-bold text-lg">{m.year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  {i < milestones.length - 1 && <div className="w-0.5 h-full bg-emerald-500/20 mt-1" style={{ minHeight: '40px' }} />}
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Meet the Team</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">World-class expertise from finance, technology, and artificial intelligence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="p-6 bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/30 hover:shadow-lg transition-all text-center">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-2xl font-bold">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-1">{member.name}</h3>
                <p className="text-emerald-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Unlock Your Wealth Potential?</h2>
          <p className="text-slate-300 mb-8">Join 185,000+ investors, advisors, and entrepreneurs who trust ValueUnlocked.</p>
          <Link to="/register">
            <Button className="gradient-growth text-white border-0 px-10 py-4 text-lg">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
