import { useState } from 'react';
import { Bell, Shield, Palette, Link2, Moon, Sun, X, Copy, Trash2, Key, Laptop, Globe, Plus } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';
import { getStoredUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const tabs = ['Appearance', 'Notifications', 'Security', 'Integrations'];

export default function SettingsPage() {
  const [tab, setTab] = useState('Appearance');
  const { theme, toggleTheme } = useTheme();
  const user = getStoredUser();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'AI Insight Alerts': true,
    'Price Alerts': true,
    'Portfolio Digest': false,
    'Earnings Reminders': true,
    'Rebalancing Alerts': false,
  });

  // Security tab states
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [apiKeys, setApiKeys] = useState<string[]>([
    'vu_live_9a82f1b0cd93e784',
    'vu_live_83b28f9cde74b210'
  ]);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', location: 'San Francisco, USA', date: 'Active now', current: true },
    { id: '2', device: 'Safari on iPhone 15 Pro', location: 'San Francisco, USA', date: '3 hours ago', current: false },
    { id: '3', device: 'Edge on Windows 10', location: 'Seattle, USA', date: '2 days ago', current: false },
  ]);

  // Integrations states
  const [connectedBrokerages, setConnectedBrokerages] = useState<Record<string, boolean>>({
    'Charles Schwab': true,
    'Fidelity': false,
    'Interactive Brokers': false,
    'Plaid': true,
    'Bloomberg Terminal': false,
  });
  const [oauthConnecting, setOauthConnecting] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const save = () => toast.success('Settings saved successfully.');

  const handleTfaToggle = () => {
    setTfaEnabled(prev => {
      const next = !prev;
      toast.success(next ? 'Two-Factor Authentication enabled.' : 'Two-Factor Authentication disabled.');
      return next;
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify({
      user: {
        name: user?.name,
        email: user?.email,
        role: user?.role,
        plan: user?.plan,
        joinedAt: user?.joinedAt
      },
      settings: {
        theme,
        notifications,
        tfaEnabled,
        connectedAccounts: Object.keys(connectedBrokerages).filter(k => connectedBrokerages[k])
      },
      exportedAt: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `valueunlocked_user_profile_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Your settings and profile data have been exported successfully.');
  };

  const generateApiKey = () => {
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = `vu_live_${randomHex}`;
    setApiKeys(prev => [...prev, newKey]);
    toast.success('Generated a new API access key.');
  };

  const deleteApiKey = (key: string) => {
    setApiKeys(prev => prev.filter(k => k !== key));
    toast.success('API key revoked successfully.');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied API key to clipboard.');
  };

  const revokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Session revoked successfully.');
  };

  const revokeAllOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    toast.success('All other sessions revoked.');
  };

  const startConnection = (name: string) => {
    if (connectedBrokerages[name]) {
      // Disconnect directly
      setConnectedBrokerages(prev => ({ ...prev, [name]: false }));
      toast.success(`Disconnected ${name} successfully.`);
    } else {
      // Start connection modal
      setOauthConnecting(name);
    }
  };

  const handleConfirmConnection = () => {
    if (!oauthConnecting) return;
    setIsAuthorizing(true);
    setTimeout(() => {
      setConnectedBrokerages(prev => ({ ...prev, [oauthConnecting]: true }));
      toast.success(`Connected ${oauthConnecting} successfully.`);
      setIsAuthorizing(false);
      setOauthConnecting(null);
    }, 1200);
  };

  return (
    <div className="max-w-3xl space-y-6 relative">
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
          
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${tfaEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                {tfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button onClick={handleTfaToggle} className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">
                {tfaEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">API Access Keys</p>
              <p className="text-xs text-slate-400">Manage your API keys for third-party integrations</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{apiKeys.length} Active</span>
              <button onClick={() => setShowApiKeysModal(true)} className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">Manage Keys</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Active Sessions</p>
              <p className="text-xs text-slate-400">View and manage all active login sessions</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{sessions.length} Device{sessions.length > 1 ? 's' : ''}</span>
              <button onClick={() => setShowSessionsModal(true)} className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">View Sessions</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-white">Data Export</p>
              <p className="text-xs text-slate-400">Download all your data in CSV or JSON format</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleExportData} className="text-xs text-emerald-500 hover:text-emerald-400 font-medium">Export Data</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'Integrations' && (
        <div className="bg-white dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"><Link2 className="w-4 h-4" /> Connected Accounts</h3>
          {[
            { name: 'Charles Schwab', type: 'Brokerage' },
            { name: 'Fidelity', type: 'Brokerage' },
            { name: 'Interactive Brokers', type: 'Brokerage' },
            { name: 'Plaid', type: 'Banking' },
            { name: 'Bloomberg Terminal', type: 'Data Feed' },
          ].map((item, i) => {
            const isConnected = connectedBrokerages[item.name] ?? false;
            return (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.type}</p>
                </div>
                <button 
                  onClick={() => startConnection(item.name)} 
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${isConnected ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-emerald-500/30'}`}
                >
                  {isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* API Keys Modal */}
      {showApiKeysModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setShowApiKeysModal(false)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                API Access Keys
              </h3>
              <button onClick={() => setShowApiKeysModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Use these keys to access ValueUnlocked intelligence feeds and portfolio metrics programmatically. Keep your keys secret.
            </p>

            <div className="space-y-3 mb-5">
              {apiKeys.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No active keys. Click below to generate one.
                </div>
              ) : (
                apiKeys.map(k => (
                  <div key={k} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl gap-2">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300 select-all truncate">{k}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-emerald-400" onClick={() => copyToClipboard(k)} title="Copy to clipboard">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-red-400" onClick={() => deleteApiKey(k)} title="Revoke Key">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button size="sm" variant="outline" onClick={generateApiKey} className="h-8 text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Generate New Key
              </Button>
              <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs" onClick={() => setShowApiKeysModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={() => setShowSessionsModal(false)}>
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-lg shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <Laptop className="w-5 h-5 text-blue-400" />
                Active Login Sessions
              </h3>
              <button onClick={() => setShowSessionsModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    {s.device.toLowerCase().includes('iphone') ? <Globe className="w-4 h-4 text-slate-400" /> : <Laptop className="w-4 h-4 text-slate-400" />}
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                        {s.device}
                        {s.current && <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[9px] px-1.5 py-0 h-4">Current Session</Badge>}
                      </p>
                      <p className="text-[10px] text-slate-400">{s.location} · {s.date}</p>
                    </div>
                  </div>
                  {!s.current && (
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-400 hover:bg-red-500/10" onClick={() => revokeSession(s.id)}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              {sessions.length > 1 ? (
                <Button size="sm" variant="destructive" onClick={revokeAllOtherSessions} className="h-8 text-xs">
                  Revoke All Other Sessions
                </Button>
              ) : <div />}
              <Button size="sm" className="gradient-growth text-white border-0 h-8 text-xs" onClick={() => setShowSessionsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OAuth Connection Modal */}
      {oauthConnecting && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-slate-200 dark:border-white/10 p-6 w-full max-w-sm shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 relative">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Connect to {oauthConnecting}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              ValueUnlocked uses Plaid to establish an encrypted, read-only sync of your holdings and transactions. Your credentials are never stored.
            </p>
            
            <div className="bg-emerald-50 dark:bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 mb-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Secure Link Details:</p>
              <p>• 256-bit AES encryption</p>
              <p>• Multi-factor authorization pass-through</p>
              <p>• Automatic daily balance sync</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setOauthConnecting(null)} disabled={isAuthorizing}>Cancel</Button>
              <Button className="gradient-growth text-white border-0 size-sm" onClick={handleConfirmConnection} disabled={isAuthorizing}>
                {isAuthorizing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                    Linking Account...
                  </>
                ) : 'Authorize Secure Link'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
