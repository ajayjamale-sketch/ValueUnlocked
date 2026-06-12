import { useState } from 'react';
import { BookOpen, Play, Star, Clock, Users, Award, CheckCircle2, Filter, Search, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { courses } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';

const extraCourses = [
  { id: '5', title: 'Technical Analysis Masterclass', instructor: 'Price Action & Charts', category: 'Technical', level: 'intermediate' as const, duration: '16h', enrolled: 18200, rating: 4.8, price: 199, image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=225&fit=crop' },
  { id: '6', title: 'Cryptocurrency Investing: A Measured Approach', instructor: 'Digital Asset Strategy', category: 'Crypto', level: 'beginner' as const, duration: '8h', enrolled: 31400, rating: 4.5, price: 99, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop' },
  { id: '7', title: 'Real Estate Investing for High Net Worth', instructor: 'REIT & Property Strategy', category: 'Real Estate', level: 'advanced' as const, duration: '22h', enrolled: 6800, rating: 4.9, price: 349, image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop' },
  { id: '8', title: 'Tax-Efficient Investing', instructor: 'Tax Strategy for Investors', category: 'Tax', level: 'intermediate' as const, duration: '10h', enrolled: 9200, rating: 4.7, price: 179, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop' },
];

const allCourses = [...courses, ...extraCourses];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Investing', 'Portfolio', 'Fundamentals', 'Startup', 'Technical', 'Crypto', 'Real Estate', 'Tax'];

const levelColors: Record<string, string> = {
  beginner: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  intermediate: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  advanced: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
};

export default function LearningAcademy() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [category, setCategory] = useState('All');

  // Load and merge courses state from localStorage to check which are enrolled/have progress
  const [localCourses, setLocalCourses] = useState(() => {
    const stored = localStorage.getItem('vu_courses');
    let dbCoursesList = courses;
    if (stored) {
      try {
        dbCoursesList = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    // Merge allCourses and dbCoursesList by ID. If a course is in dbCoursesList, use it (since it might have progress).
    // Otherwise, use the one from allCourses.
    const merged = allCourses.map(ac => {
      const match = dbCoursesList.find(dc => dc.id === ac.id);
      return match ? match : ac;
    });
    return merged;
  });

  const filtered = localCourses.filter(c =>
    (level === 'All' || c.level.toLowerCase() === level.toLowerCase()) &&
    (category === 'All' || c.category === category) &&
    (c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()))
  );

  const handleEnroll = (course: typeof allCourses[0]) => {
    if (!user) {
      toast.info('Please sign in to enroll in courses.');
      navigate('/login');
      return;
    }

    const isEnrolled = course.progress !== undefined;
    if (isEnrolled) {
      toast.info(`Resuming: ${course.title}`);
      navigate('/dashboard/learning', { state: { openCourseId: course.id } });
    } else {
      const updated = localCourses.map(c => {
        if (c.id === course.id) {
          return { ...c, progress: 0 };
        }
        return c;
      });
      setLocalCourses(updated);
      // Synchronize with dashboard storage key
      localStorage.setItem('vu_courses', JSON.stringify(updated));
      toast.success(`Enrolled in: ${course.title}`);
      navigate('/dashboard/learning', { state: { openCourseId: course.id } });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      <section className="bg-navy py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">Learning Academy</span>
          <h1 className="text-4xl font-bold text-white mb-4">Master <span className="text-emerald-400">Wealth Building</span></h1>
          <p className="text-slate-300 text-lg mb-8">100+ premium courses on investing, portfolio management, and financial literacy — taught by industry experts.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input value={query} onChange={e => setQuery(e.target.value)} className="pl-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-base" placeholder="Search courses..." />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-slate-50 dark:bg-[#0f172a] py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '100+', label: 'Premium Courses', icon: BookOpen },
            { value: '250K+', label: 'Enrolled Students', icon: Users },
            { value: '4.8/5', label: 'Average Rating', icon: Star },
            { value: '12', label: 'Certifications', icon: Award },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 gradient-growth rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-slate-400 self-center mr-1">Level:</span>
              {levels.map(l => (
                <button key={l} onClick={() => setLevel(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${level === l ? 'gradient-growth text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>{l}</button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs text-slate-400 self-center mr-1">Topic:</span>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-navy dark:bg-white text-white dark:text-navy' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(course => {
              const isEnrolled = course.progress !== undefined;
              return (
                <div key={course.id} className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center" onClick={() => handleEnroll(course)}>
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </button>
                    </div>
                    {isEnrolled && course.progress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                        <div className="h-full gradient-growth" style={{ width: `${course.progress}%` }} />
                      </div>
                    )}
                    {isEnrolled && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Enrolled
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-[10px] border-0 ${levelColors[course.level]}`}>{course.level}</Badge>
                      <span className="text-xs text-slate-400">{course.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 line-clamp-2">{course.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{course.instructor}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-current" />{course.rating}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800 dark:text-white">${course.price}</span>
                    </div>
                    <Button size="sm" className={`w-full h-8 text-xs ${isEnrolled ? 'gradient-growth text-white border-0' : 'border border-slate-200 dark:border-white/20 text-slate-700 dark:text-slate-300 bg-transparent hover:border-emerald-500/30'}`} onClick={() => handleEnroll(course)}>
                      {isEnrolled ? `Resume ${course.progress !== undefined ? `· ${course.progress}%` : ''}` : `Enroll — $${course.price}`}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No courses match your search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
