import { TrendingUp, Zap, ArrowRight, Bookmark, Globe, Building2, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Opportunity } from '@/types';
import { toast } from 'sonner';

const riskColors = {
  low: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  medium: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  high: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

const riskLabel = { low: 'Low Risk', medium: 'Moderate', high: 'High Risk' };

const TypeIcon = ({ type }: { type: string }) => {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'stock': return <TrendingUp className={`${cls} text-emerald-500`} />;
    case 'startup': return <Zap className={`${cls} text-purple-500`} />;
    case 'sector': return <Globe className={`${cls} text-blue-500`} />;
    case 'acquisition': return <Building2 className={`${cls} text-amber-500`} />;
    case 'franchise': return <Store className={`${cls} text-orange-500`} />;
    default: return <Zap className={`${cls} text-slate-400`} />;
  }
};

interface Props {
  opportunity: Opportunity;
  compact?: boolean;
  onAction?: () => void;
}

export default function OpportunityCard({ opportunity, compact = false, onAction }: Props) {
  const scoreColor = opportunity.score >= 85 ? 'text-emerald-400' : opportunity.score >= 70 ? 'text-amber-400' : 'text-slate-400';

  return (
    <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-5 hover:border-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
            <TypeIcon type={opportunity.type} />
          </div>
          <div>
            <p className="text-xs text-slate-400 capitalize">{opportunity.type}</p>
            <Badge className={`text-[10px] border-0 mt-0.5 ${riskColors[opportunity.risk]}`}>{riskLabel[opportunity.risk]}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${scoreColor}`}>{opportunity.score}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Score</p>
        </div>
      </div>

      <h3 className="font-semibold text-slate-800 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">
        {opportunity.title}
      </h3>

      {!compact && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
          {opportunity.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1 text-emerald-500">
          <TrendingUp className="w-3.5 h-3.5" />
          <span className="text-sm font-bold">{opportunity.upside} upside</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            onClick={() => toast.success(`${opportunity.title} saved to watchlist!`)}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <Button
            size="sm"
            className="h-7 text-xs gradient-growth text-white border-0 gap-1"
            onClick={onAction ?? (() => toast.success(`Analyzing ${opportunity.title}...`))}
          >
            Analyze <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {opportunity.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
