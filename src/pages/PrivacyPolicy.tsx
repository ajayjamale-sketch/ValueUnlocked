import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Bell, Mail } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content: [
      'Account information: name, email address, password (hashed), profile details',
      'Financial data: portfolio holdings, transaction history, watchlists, and goals you create within the platform',
      'Usage data: features accessed, queries made, time spent, device and browser information',
      'Communication data: support tickets, messages, and feedback you send us',
      'Payment information: billing details processed securely through Stripe (we never store raw card numbers)',
    ],
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    content: [
      'Provide, maintain, and improve our wealth intelligence platform',
      'Personalize AI recommendations, opportunity scoring, and research feeds',
      'Process transactions and send billing confirmations',
      'Send important product updates, security alerts, and weekly market digests (opt-out available)',
      'Conduct analytics to improve platform performance and feature development',
      'Comply with legal obligations and prevent fraud',
    ],
  },
  {
    icon: Shield,
    title: '3. Data Security',
    content: [
      'All data is encrypted at rest using AES-256 and in transit using TLS 1.3',
      'We are SOC 2 Type II certified and undergo annual third-party security audits',
      'Access to user data is strictly role-based and logged for audit purposes',
      'We maintain a bug bounty program and responsible disclosure policy',
      'In the event of a security breach, we will notify affected users within 72 hours',
    ],
  },
  {
    icon: Lock,
    title: '4. Data Sharing',
    content: [
      'We do not sell your personal data to third parties — ever',
      'We share minimal necessary data with service providers (AWS, Stripe, Sendgrid) under strict data processing agreements',
      'We may share aggregated, anonymized data for research or product improvement purposes',
      'We may disclose data when legally required by court order or government request',
      'In the event of an acquisition, your data will remain subject to this privacy policy',
    ],
  },
  {
    icon: Bell,
    title: '5. Your Rights',
    content: [
      'Access: Request a copy of all personal data we hold about you',
      'Correction: Request correction of inaccurate or incomplete data',
      'Deletion: Request deletion of your account and associated data',
      'Portability: Export your data in machine-readable format (CSV/JSON)',
      'Opt-out: Unsubscribe from marketing communications at any time',
      'GDPR / CCPA: EU and California residents have additional rights under applicable law',
    ],
  },
  {
    icon: Mail,
    title: '6. Contact & Updates',
    content: [
      'To exercise your rights or ask privacy questions, contact: privacy@valueunlocked.ai',
      'Our Data Protection Officer is available at dpo@valueunlocked.ai',
      'We will update this policy as our practices evolve and will notify users of material changes',
      'Continued use of the platform after changes constitutes acceptance of the updated policy',
      'This policy was last updated: January 2024',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />
      <section className="bg-navy py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-300">Last updated: January 2024 · Effective January 1, 2024</p>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-5 mb-10">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Summary:</strong> ValueUnlocked collects only the information needed to provide our service. We never sell your data, encrypt everything, and give you full control over your information. If you have any questions, email us at <a href="mailto:privacy@valueunlocked.ai" className="text-emerald-600 dark:text-emerald-400 underline">privacy@valueunlocked.ai</a>.
            </p>
          </div>
          <div className="space-y-10">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div key={i}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 gradient-growth rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{section.title}</h2>
                  </div>
                  <ul className="space-y-2 pl-13">
                    {section.content.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-12 p-6 bg-slate-50 dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Questions about our privacy practices?</p>
            <Link to="/contact" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">Contact our Privacy Team →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
