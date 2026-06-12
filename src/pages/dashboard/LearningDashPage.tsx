import { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle2, Clock, Star, Award, TrendingUp, Lock, GraduationCap, Flame, MessageSquare, BarChart2, X, ChevronRight, Pause, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDashboard } from '@/context/DashboardContext';
import { useLocation } from 'react-router-dom';

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
  const { courses, enrollInCourse, updateCourseProgress } = useDashboard();
  const [activeTab, setActiveTab] = useState<'courses' | 'certs' | 'achievements'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const location = useLocation();
  
  // Video player controls state
  const [isPlaying, setIsPlaying] = useState(true);

  // Automatically open classroom modal if openCourseId is passed in location state
  useEffect(() => {
    if (location.state?.openCourseId) {
      setSelectedCourseId(location.state.openCourseId);
      setIsPlaying(true);
      // Clear location state to prevent modal reopening on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || null;

  const handleOpenCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    if (course.progress === undefined) {
      // If not enrolled, show details first and confirm enrollment
      const confirmEnroll = window.confirm(`Would you like to enroll in "${course.title}" for $${course.price}?`);
      if (confirmEnroll) {
        enrollInCourse(courseId);
        setSelectedCourseId(courseId);
        setIsPlaying(true);
      }
    } else {
      setSelectedCourseId(courseId);
      setIsPlaying(true);
    }
  };

  const handleCompleteLesson = () => {
    if (!selectedCourse) return;
    updateCourseProgress(selectedCourse.id, 20); // Complete 20% increments
  };

  const handleContinueCert = (certName: string) => {
    if (certName === 'Certified Value Investor') {
      handleOpenCourse('1'); // Value Investing Masterclass
    } else if (certName === 'Portfolio Risk Manager') {
      handleOpenCourse('2'); // Portfolio Construction & Risk Management
    } else if (certName === 'Startup Valuation Expert') {
      handleOpenCourse('4'); // Startup Valuation & VC Investing
    } else {
      toast.success(`Continuing ${certName}`);
    }
  };

  // Calculate dynamic overall completion rate
  const enrolledCourses = courses.filter(c => c.progress !== undefined);
  const totalCompletedPercentage = enrolledCourses.reduce((acc, c) => acc + (c.progress ?? 0), 0);
  const completionRate = enrolledCourses.length > 0 ? Math.round(totalCompletedPercentage / enrolledCourses.length) : 0;

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
            <p className="text-3xl font-bold text-emerald-400">{completionRate || 68}%</p>
            <p className="text-slate-400 text-xs">Course completion</p>
          </div>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full gradient-growth transition-all duration-1000" style={{ width: `${completionRate || 68}%` }} />
        </div>
        <p className="text-slate-400 text-xs mt-2">
          {courses.filter(c => c.progress === 100).length} of {courses.length} courses completed · {enrolledCourses.filter(c => (c.progress ?? 0) < 100).length} in progress
        </p>
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
                  <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center" onClick={() => handleOpenCourse(course.id)}>
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
                    <Button size="sm" className="h-7 text-xs gradient-growth text-white border-0" onClick={() => handleOpenCourse(course.id)}>
                      {course.progress === 100 ? 'Review Course' : `Resume ${course.progress}%`}
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleOpenCourse(course.id)}>
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
                <Button disabled={cert.locked} className="gradient-growth text-white border-0 text-xs h-9 w-full sm:w-auto justify-center" onClick={() => handleContinueCert(cert.name)}>
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

      {/* Course Classroom Drawer/Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedCourseId(null)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-4xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative my-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider">Classroom Mode</span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-1">{selectedCourse.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Instructor: {selectedCourse.instructor}</p>
              </div>
              <button onClick={() => setSelectedCourseId(null)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Video & Transcript */}
              <div className="lg:col-span-2 space-y-4">
                {/* Simulated Video Player */}
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex flex-col justify-end p-4 group border border-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                    {!isPlaying ? (
                      <button onClick={() => setIsPlaying(true)} className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center hover:scale-105 transition-all text-white shadow-lg">
                        <Play className="w-6 h-6 ml-0.5" />
                      </button>
                    ) : (
                      <button onClick={() => setIsPlaying(false)} className="w-14 h-14 bg-black/40 rounded-full flex items-center justify-center hover:scale-105 opacity-0 group-hover:opacity-100 transition-all text-white shadow-lg">
                        <Pause className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  {/* Video details & controls */}
                  <div className="w-full space-y-2 z-10">
                    <p className="text-xs text-slate-300 font-medium truncate">Lesson 3: Advanced Balance Sheet Multiples</p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-emerald-400 transition-colors">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative">
                        <div className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full" style={{ width: `${selectedCourse.progress ?? 0}%` }} />
                      </div>
                      <span className="text-[10px] text-white/80 font-mono">14:28 / 45:10</span>
                      <Volume2 className="w-4 h-4 text-white cursor-pointer hover:text-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Lecture Notes */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-xs mb-1.5">Lecture Study Notes</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Key learning outcomes: EV/EBITDA multiples should represent the core operational valuation stripped of capital structure biases. When analyzing highly leveraged sectors, prefer EV multiples over P/E ratios to avoid skewing profitability assessments. In the next section, we will calculate free cash flows (FCFF) from actual financial statements.
                  </p>
                </div>
              </div>

              {/* Right Column: Syllabus & Progression */}
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-800 dark:text-white text-xs mb-3">Course Modules</h4>
                  <div className="space-y-2.5">
                    {[
                      { index: 1, name: 'Syllabus & Core Valuation', status: 'completed' },
                      { index: 2, name: 'Discounting Cash Flows', status: (selectedCourse.progress ?? 0) >= 40 ? 'completed' : 'in_progress' },
                      { index: 3, name: 'Multiples & Peers Analysis', status: (selectedCourse.progress ?? 0) >= 80 ? 'completed' : (selectedCourse.progress ?? 0) >= 40 ? 'in_progress' : 'locked' },
                      { index: 4, name: 'Case Study: Tech Stock', status: (selectedCourse.progress ?? 0) === 100 ? 'completed' : 'locked' },
                    ].map(mod => (
                      <div key={mod.index} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white dark:bg-navy border border-slate-100 dark:border-white/5">
                        <span className="text-slate-500 dark:text-slate-400 font-mono">0{mod.index}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px] ml-2 flex-1">{mod.name}</span>
                        {mod.status === 'completed' ? (
                          <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Completed</span>
                        ) : mod.status === 'in_progress' ? (
                          <span className="text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded animate-pulse">Active</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded">Locked</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Course progress: {selectedCourse.progress ?? 0}%</p>
                    <div className="h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full gradient-growth rounded-full transition-all" style={{ width: `${selectedCourse.progress ?? 0}%` }} />
                    </div>
                  </div>

                  {selectedCourse.progress === 100 ? (
                    <Button disabled className="w-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs h-9">
                      ✓ Course Completed!
                    </Button>
                  ) : (
                    <Button className="w-full gradient-growth text-white border-0 text-xs h-9 flex items-center justify-center gap-1" onClick={handleCompleteLesson}>
                      Complete Next Lesson <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
