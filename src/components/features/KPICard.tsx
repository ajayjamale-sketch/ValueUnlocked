import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  gradient?: boolean;
  subtitle?: string;
}

export default function KPICard({ label, value, change, positive = true, icon: Icon, iconColor = 'text-emerald-400', gradient = false, subtitle }: Props) {
  return (
    <div className={`rounded-xl p-5 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
      gradient
        ? 'gradient-wealth border-transparent text-white'
        : 'bg-white dark:bg-navy border-slate-200 dark:border-white/10 hover:border-emerald-500/30'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs font-medium uppercase tracking-wider ${gradient ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
          {label}
        </p>
        {Icon && (
          <div className={`p-2 rounded-lg ${gradient ? 'bg-white/10' : 'bg-slate-50 dark:bg-white/5'}`}>
            <Icon className={`w-4 h-4 ${gradient ? 'text-white/80' : iconColor}`} />
          </div>
        )}
      </div>
      <p className={`text-2xl font-bold tracking-tight mb-1 ${gradient ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
        {value}
      </p>
      {(change || subtitle) && (
        <div className="flex items-center gap-1.5">
          {change && (
            <>
              {positive ? (
                <TrendingUp className={`w-3.5 h-3.5 ${gradient ? 'text-white/80' : 'text-emerald-500'}`} />
              ) : (
                <TrendingDown className={`w-3.5 h-3.5 ${gradient ? 'text-white/80' : 'text-red-500'}`} />
              )}
              <span className={`text-xs font-medium ${
                gradient ? 'text-white/80' : positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {change}
              </span>
            </>
          )}
          {subtitle && <span className={`text-xs ${gradient ? 'text-white/60' : 'text-slate-400'}`}>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
