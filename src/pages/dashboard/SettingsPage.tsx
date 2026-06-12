import { useState } from 'react';
import { Bell, Shield, Palette, Link2, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const tabs = ['Appearance', 'Notifications', 'Security', 'Integrations'];

export default function SettingsPage() {
  const [tab, setTab] = useState('Appearance');
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'AI Insight Alerts': true,
    'Price Alerts': true,
    'Portfolio Digest': false,
    'Earnings Reminders': true,
    'Rebalancing Alerts': false,
  });

  const save = () => toast.success('Settings saved successfully.');

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl w-fit max-w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-white dark:bg-navy text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Appearance' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-5">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Palette className="w-4 h-4" /> Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-slate-800 dark:text-white text-sm">Theme</p>
              <p className="text-xs text-slate-400 mt-0.5">Switch between light and dark mode</p>
            </div>
            <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30 transition-colors text-sm">
              {theme === 'dark' ? <><Sun className="w-4 h-4 text-amber-400" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="font-medium text-slate-800 dark:text-white text-sm">Dashboard Density</p>
              <p className="text-xs text-slate-400 mt-0.5">Choose how compact the UI appears</p>
            </div>
            <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy text-slate-800 dark:text-white text-sm">
              <option>Comfortable</option><option>Compact</option><option>Spacious</option>
            </select>
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
          {[
            { label: 'AI Insight Alerts', desc: 'Get notified when new AI insights are available' },
            { label: 'Price Alerts', desc: 'Notify when watchlist stocks hit price targets' },
            { label: 'Portfolio Digest', desc: 'Daily summary of your portfolio performance' },
            { label: 'Earnings Reminders', desc: 'Alert before holdings report earnings' },
            { label: 'Rebalancing Alerts', desc: 'When allocation drift exceeds threshold' },
          ].map((item, i) => {
            const on = notifications[item.label] ?? false;
            return (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl gap-4">
                <div><p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p><p className="text-xs text-slate-400">{item.desc}</p></div>
                <button onClick={() => setNotifications(prev => ({ ...prev, [item.label]: !on }))} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${on ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            );
          })}
          <button onClick={save} className="gradient-growth text-white px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Save Preferences</button>
        </div>
      )}

      {tab === 'Security' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
          {[
            { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', action: 'Enable 2FA', status: 'Disabled' },
            { label: 'API Access Keys', desc: 'Manage your API keys for third-party integrations', action: 'Manage Keys', status: '2 Active' },
            { label: 'Active Sessions', desc: 'View and manage all active login sessions', action: 'View Sessions', status: '1 Device' },
            { label: 'Data Export', desc: 'Download all your data in CSV or JSON format', action: 'Export Data', status: '' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                {item.status && <span className="text-xs text-slate-400">{item.status}</span>}
                <button className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">{item.action}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Integrations' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Link2 className="w-4 h-4" /> Connected Accounts</h3>
          {[
            { name: 'Charles Schwab', type: 'Brokerage', status: 'Connected', color: 'text-emerald-500' },
            { name: 'Fidelity', type: 'Brokerage', status: 'Connect', color: 'text-slate-400' },
            { name: 'Interactive Brokers', type: 'Brokerage', status: 'Connect', color: 'text-slate-400' },
            { name: 'Plaid', type: 'Banking', status: 'Connected', color: 'text-emerald-500' },
            { name: 'Bloomberg Terminal', type: 'Data Feed', status: 'Connect', color: 'text-slate-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</p>
                <p className="text-xs text-slate-400">{item.type}</p>
              </div>
              <button className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${item.status === 'Connected' ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'}`}>
                {item.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
