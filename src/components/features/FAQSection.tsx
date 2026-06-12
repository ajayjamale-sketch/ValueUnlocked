import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/lib/mockData';

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-slate-50 dark:bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">FAQ</span>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Frequently Asked <span className="text-gradient-emerald">Questions</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Everything you need to know before you start.</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div key={i} className={`rounded-xl border overflow-hidden transition-all duration-200 ${open === i ? 'border-emerald-500/30 bg-white dark:bg-[#020617]' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-navy/50'}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className={`font-medium text-sm ${open === i ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>{item.q}</span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
