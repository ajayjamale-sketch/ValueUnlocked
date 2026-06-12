import { Star, BadgeCheck } from 'lucide-react';
import { testimonials } from '@/lib/mockData';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Success Stories</span>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Trusted by Serious <span className="text-gradient-emerald">Investors Worldwide</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">
            Join 185,000+ investors who have transformed their wealth-building with ValueUnlocked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${i === 0 ? 'gradient-wealth text-white border-transparent' : 'bg-white dark:bg-navy border-slate-200 dark:border-white/10'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className={`font-semibold text-sm ${i === 0 ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{t.name}</p>
                      <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className={`text-xs ${i === 0 ? 'text-white/70' : 'text-slate-400'}`}>{t.role}</p>
                    <p className={`text-xs font-medium ${i === 0 ? 'text-emerald-300' : 'text-emerald-500'}`}>{t.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${i === 0 ? 'text-white' : 'text-emerald-500'}`}>{t.portfolioGrowth}</p>
                  <p className={`text-xs ${i === 0 ? 'text-white/60' : 'text-slate-400'}`}>Portfolio Growth</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className={`w-4 h-4 fill-current ${i === 0 ? 'text-white' : 'text-gold-400'}`} />
                ))}
              </div>

              <p className={`text-sm leading-relaxed italic ${i === 0 ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200 dark:border-white/10 pt-12">
          {[
            { label: 'Customer Rating', value: '4.9/5', sub: 'Based on 12,000+ reviews' },
            { label: 'Uptime SLA', value: '99.9%', sub: 'Enterprise reliability' },
            { label: 'Data Points', value: '50M+', sub: 'Across global markets' },
            { label: 'Research Reports', value: '10,000+', sub: 'Premium analyst content' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-emerald-500 mb-1">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
