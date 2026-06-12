import { useState } from 'react';
import { BookOpen, Play, CheckCircle2, Clock, Star, Award, TrendingUp, Lock, GraduationCap, Flame, MessageSquare, BarChart2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { courses } from '@/lib/mockData';
import { toast } from 'sonner';

const certifications = [
  { name: 'Certified Value Investor', progress: 68, total: 8, completed: 5, color: 'from-emerald-500 to-teal-600' },
  { name: 'Portfolio Risk Manager', progress: 35, total: 6, completed: 2, color: 'from-blue-500 to-indigo-600' },
  { name: 'Startup Valuation Expert', progress: 0, total: 5, completed: 0, color: 'from-purple-500 to-violet-600', locked: true },
];

const achievements = [
  { label: 'First Course Completed', Icon: GraduationCap, earned: true },
  { label: 'Value Investing Streak — 30 days', Icon: Flame, earned: true },
  { label: 'Community Contributor', Icon: MessageSquare, earned: true },
  { label: 'Portfolio Pro', Icon: BarChart2, earned: false },
];

export default function LearningDashPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'certs' | 'achievements'>('courses');

  return (
    <div className="space-y-6">
      {/* Header Progress */}
      <div className="bg-gradient-to-r from-navy to-[#0f2d1f] border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-xl">Learning Academy</h2>
            <p className="text-slate-400 text-sm mt-1">Continue your financial education journey</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-emerald-400">68%</p>
            <p className="text-slate-400 text-xs">Course completion</p>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[68%] gradient-growth rounded-full transition-all duration-1000" />
        </div>
        <p className="text-slate-400 text-xs mt-2">5 of 8 courses completed · 2 certifications in progress</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-0">
        {(['courses', 'certs', 'achievements'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-lg transition-all group">
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center" onClick={() => toast.success(`Starting: ${course.title}`)}>
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </button>
                </div>
                {course.progress !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div className="h-full gradient-growth" style={{ width: `${course.progress}%` }} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] border-0 ${course.level === 'beginner' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : course.level === 'intermediate' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'}`}>{course.level}</Badge>
                  <span className="text-xs text-slate-400">{course.category}</span>
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">{course.title}</h3>
                <p className="text-xs text-slate-400 mb-3">{course.instructor}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" />{course.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  </div>
                  {course.progress !== undefined ? (
                    <Button size="sm" className="h-7 text-xs gradient-growth text-white border-0" onClick={() => toast.success(`Resuming: ${course.title}`)}>
                      Resume {course.progress}%
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Enrolled in: ${course.title}`)}>
                      Enroll ${course.price}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'certs' && (
        <div className="space-y-4">
          {certifications.map((cert, i) => (
            <div key={i} className={`bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 ${cert.locked ? 'opacity-60' : ''}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0`}>
                  {cert.locked ? <Lock className="w-6 h-6 text-white" /> : <Award className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 dark:text-white">{cert.name}</h3>
                    {cert.locked && <Badge className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-500 border-0">Locked</Badge>}
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{cert.completed}/{cert.total} modules completed</p>
                  <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cert.color} rounded-full`} style={{ width: `${cert.progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{cert.progress}% complete</p>
                </div>
                <Button disabled={cert.locked} className="gradient-growth text-white border-0 text-xs h-9 w-full sm:w-auto justify-center" onClick={() => toast.success(`Continuing ${cert.name}`)}>
                  {cert.locked ? 'Locked' : 'Continue'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((a, i) => {
            const AchIcon = a.Icon;
            return (
              <div key={i} className={`bg-white dark:bg-navy rounded-xl border p-5 text-center transition-all ${a.earned ? 'border-emerald-500/30 shadow-md' : 'border-slate-200 dark:border-white/10 opacity-50'}`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${a.earned ? 'bg-emerald-500/20' : 'bg-slate-100 dark:bg-white/10'}`}>
                  <AchIcon className={`w-7 h-7 ${a.earned ? 'text-emerald-500' : 'text-slate-400'}`} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-white">{a.label}</p>
                {a.earned && (
                  <p className="text-xs text-emerald-500 mt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Earned
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
