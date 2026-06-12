import { useState } from 'react';
import { Camera, Edit2, Save, TrendingUp, Target, Shield, Award, CheckCircle2, Trophy, GraduationCap, FlaskConical, LayoutDashboard, Bot, Users, FileText, Crosshair, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStoredUser, storeUser, getRoleLabel } from '@/lib/auth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const riskOptions = ['Conservative', 'Moderate', 'Moderate-Aggressive', 'Aggressive'];
const horizonOptions = ['1-3 Years', '3-5 Years', '5-10 Years', '10-20 Years', '20+ Years'];
const goalOptions = ['Wealth Accumulation', 'Retirement Planning', 'Passive Income', 'Capital Preservation', 'Business Growth'];
const styleOptions = ['Value Investing', 'Growth Investing', 'Value + Growth', 'Dividend Investing', 'Index Investing', 'Momentum', 'Other'];

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
];

export default function ProfilePage() {
  const user = getStoredUser()!;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(user.avatar || '');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [investmentProfile, setInvestmentProfile] = useState({
    risk: 'Moderate-Aggressive',
    horizon: '10-20 Years',
    goal: 'Wealth Accumulation',
    style: 'Value + Growth',
    sectors: 'Tech, Healthcare',
    esg: 'Moderate',
    annualIncome: '$200K - $500K',
    netWorth: '$1M - $5M',
  });
  const [editingInvestment, setEditingInvestment] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'investment' | 'achievements'>('profile');

  const saveProfile = () => {
    storeUser({ ...user, name: form.name, email: form.email });
    setEditing(false);
    toast.success('Profile updated successfully.');
  };

  const saveInvestmentProfile = () => {
    setEditingInvestment(false);
    toast.success('Investment profile updated successfully.');
  };

  const achievements = [
    { label: 'First Login', Icon: GraduationCap, earned: true, desc: 'Welcome to ValueUnlocked' },
    { label: 'Profile Complete', Icon: CheckCircle2, earned: true, desc: 'Completed your financial profile' },
    { label: 'First Research', Icon: FlaskConical, earned: true, desc: 'Ran your first stock analysis' },
    { label: 'Portfolio Setup', Icon: LayoutDashboard, earned: true, desc: 'Added your first investment' },
    { label: 'AI Advisor Chat', Icon: Bot, earned: false, desc: 'Ask AI Advisor 10 questions' },
    { label: 'Community Member', Icon: Users, earned: false, desc: 'Make your first community post' },
    { label: 'First Report', Icon: FileText, earned: false, desc: 'Purchase a research report' },
    { label: 'Opportunity Hunter', Icon: Crosshair, earned: false, desc: 'Save 5 investment opportunities' },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-8">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20"
            />
            <button
              onClick={() => {
                setTempAvatar(user.avatar || '');
                setCustomAvatarUrl(presetAvatars.includes(user.avatar || '') ? '' : (user.avatar || ''));
                setAvatarModalOpen(true);
              }}
              className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-lg text-white hover:bg-emerald-600 transition-colors"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{form.name}</h2>
              <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-0 capitalize">
                {user.plan.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-slate-400 text-sm">
              {getRoleLabel(user.role)} · Member since{' '}
              {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10">
        {(['profile', 'investment', 'achievements'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-500'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'achievements' && <Trophy className="w-3.5 h-3.5" />}
            {tab === 'achievements' ? 'Achievements' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800 dark:text-white">Personal Information</h3>
              <Button
                onClick={() => editing ? saveProfile() : setEditing(true)}
                variant={editing ? 'default' : 'outline'}
                size="sm"
                className={editing ? 'gradient-growth text-white border-0' : ''}
              >
                {editing
                  ? <><Save className="w-3.5 h-3.5 mr-1.5" />Save Changes</>
                  : <><Edit2 className="w-3.5 h-3.5 mr-1.5" />Edit Profile</>}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', key: 'name', value: form.name, type: 'text' },
                { label: 'Email Address', key: 'email', value: form.email, type: 'email' },
              ].map(field => (
                <div key={field.key}>
                  <Label className="text-sm text-slate-500 dark:text-slate-400 mb-1.5 block">{field.label}</Label>
                  {editing ? (
                    <Input
                      type={field.type}
                      value={field.value}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    />
                  ) : (
                    <p className="text-slate-800 dark:text-white font-medium py-2">{field.value}</p>
                  )}
                </div>
              ))}
              {editing && (
                <div>
                  <Label className="text-sm text-slate-500 dark:text-slate-400 mb-1.5 block">New Password</Label>
                  <Input type="password" placeholder="Leave blank to keep current" />
                </div>
              )}
            </div>
            {editing && (
              <Button variant="ghost" size="sm" className="mt-3 h-8 text-xs text-slate-400" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            )}
          </div>

          <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Account Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Member Since', value: new Date(user.joinedAt).getFullYear().toString(), icon: Award },
                { label: 'Current Plan', value: user.plan.replace(/_/g, ' '), icon: Shield },
                { label: 'User Role', value: getRoleLabel(user.role), icon: Target },
                { label: 'Profile Score', value: '85/100', icon: TrendingUp },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="text-center p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                    <div className="w-8 h-8 gradient-growth rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white capitalize">{item.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'investment' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 dark:text-white">Investment Profile</h3>
            <Button
              onClick={() => editingInvestment ? saveInvestmentProfile() : setEditingInvestment(true)}
              variant={editingInvestment ? 'default' : 'outline'}
              size="sm"
              className={editingInvestment ? 'gradient-growth text-white border-0' : ''}
            >
              {editingInvestment
                ? <><Save className="w-3.5 h-3.5 mr-1.5" />Save</>
                : <><Edit2 className="w-3.5 h-3.5 mr-1.5" />Edit</>}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Risk Tolerance', key: 'risk', value: investmentProfile.risk, options: riskOptions },
              { label: 'Investment Horizon', key: 'horizon', value: investmentProfile.horizon, options: horizonOptions },
              { label: 'Primary Goal', key: 'goal', value: investmentProfile.goal, options: goalOptions },
              { label: 'Investment Style', key: 'style', value: investmentProfile.style, options: styleOptions },
              { label: 'Annual Income', key: 'annualIncome', value: investmentProfile.annualIncome, options: ['Under $100K', '$100K - $200K', '$200K - $500K', '$500K - $1M', '$1M+'] },
              { label: 'Net Worth', key: 'netWorth', value: investmentProfile.netWorth, options: ['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $20M', '$20M+'] },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                <p className="text-xs text-slate-400 mb-1.5">{item.label}</p>
                {editingInvestment ? (
                  <select
                    value={item.value}
                    onChange={e => setInvestmentProfile(p => ({ ...p, [item.key]: e.target.value }))}
                    className="w-full text-xs bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1.5 text-slate-700 dark:text-slate-300"
                  >
                    {item.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>
          {editingInvestment && (
            <Button variant="ghost" size="sm" className="mt-3 h-8 text-xs text-slate-400" onClick={() => setEditingInvestment(false)}>
              Cancel
            </Button>
          )}
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Achievement Progress</p>
                <p className="text-xs text-slate-400 mt-0.5">4 of 8 achievements earned</p>
              </div>
              <span className="text-2xl font-bold text-emerald-500">50%</span>
            </div>
            <div className="h-2 bg-emerald-200 dark:bg-emerald-500/20 rounded-full overflow-hidden mt-2">
              <div className="h-full gradient-growth rounded-full w-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((a, i) => {
              const AchIcon = a.Icon;
              return (
                <div
                  key={i}
                  className={`bg-white dark:bg-navy rounded-xl border p-4 text-center transition-all ${
                    a.earned ? 'border-emerald-500/30 shadow-md' : 'border-slate-200 dark:border-white/10 opacity-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center ${a.earned ? 'bg-emerald-500/20' : 'bg-slate-100 dark:bg-white/10'}`}>
                    <AchIcon className={`w-6 h-6 ${a.earned ? 'text-emerald-500' : 'text-slate-400'}`} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-white leading-tight">{a.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{a.desc}</p>
                  {a.earned && (
                    <p className="text-[10px] text-emerald-500 mt-1 font-medium flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Earned
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Avatar Selector Modal */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy border border-slate-200 dark:border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-500" />
                Update Profile Avatar
              </h3>
              <button onClick={() => setAvatarModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Choose a preset avatar
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {presetAvatars.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setTempAvatar(url);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                        tempAvatar === url
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <img src={url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                      {tempAvatar === url && (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-white dark:fill-navy" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Custom Image URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarUrl || (presetAvatars.includes(tempAvatar) ? '' : tempAvatar)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomAvatarUrl(val);
                    setTempAvatar(val);
                  }}
                  className="w-full text-xs text-slate-800 dark:text-white"
                />
              </div>

              {tempAvatar && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={tempAvatar} 
                      alt="Custom Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`;
                      }} 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Avatar Preview</p>
                    <p className="text-[10px] text-slate-400 truncate">{tempAvatar}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAvatarModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!tempAvatar.trim()) {
                    return toast.error('Please select an avatar or enter a valid URL.');
                  }
                  storeUser({ ...user, avatar: tempAvatar });
                  toast.success('Avatar updated successfully!');
                  setAvatarModalOpen(false);
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }}
                className="gradient-growth text-white border-0"
              >
                Save Avatar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
