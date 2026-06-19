import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using ValueUnlocked ("Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the Platform. These Terms apply to all users, visitors, and others who access the Platform.',
  },
  {
    title: '2. Platform License',
    content: 'Subject to your payment of applicable fees and compliance with these Terms, ValueUnlocked grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal or internal business purposes. This license does not include any rights to resell or commercial use of the Platform or its contents; collection and use of any product listings, descriptions, or prices; any derivative use of the Platform or its contents.',
  },
  {
    title: '3. Investment Disclaimer',
    content: 'IMPORTANT: Nothing on this Platform constitutes financial, investment, legal, or tax advice. All content is provided for informational and educational purposes only. Past performance does not guarantee future results. All investing involves risk, including the possible loss of principal. You should consult qualified financial, legal, and tax professionals before making any investment decisions. ValueUnlocked does not provide personalized investment advice and is not a registered investment advisor.',
  },
  {
    title: '4. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. You must be at least 18 years old to create an account. You may not create accounts for others without their consent. We reserve the right to terminate accounts that violate these Terms.',
  },
  {
    title: '5. Subscription and Payments',
    content: 'Paid subscriptions are billed in advance on a monthly or annual basis. All fees are non-refundable except where required by law. We reserve the right to change pricing with 30 days notice. Free trials automatically convert to paid subscriptions unless cancelled before the trial ends. You may cancel your subscription at any time; your access will continue until the end of the current billing period.',
  },
  {
    title: '6. Intellectual Property',
    content: 'All content on the Platform, including but not limited to AI models, research frameworks, opportunity scoring algorithms, course content, and design elements, is the exclusive property of ValueUnlocked Inc. and is protected by copyright, trademark, and other intellectual property laws. User-generated content remains yours, but you grant ValueUnlocked a license to use it to improve our services.',
  },
  {
    title: '7. Prohibited Conduct',
    content: 'You agree not to: (a) use the Platform for any unlawful purpose; (b) scrape, crawl, or systematically download Platform content without written permission; (c) attempt to reverse engineer any AI models or algorithms; (d) share subscription access with non-paying users; (e) use automated tools or bots to access the Platform; (f) publish research obtained from the Platform as your own original work without proper attribution.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'TO THE MAXIMUM EXTENT PERMITTED BY LAW, VALUEUNLOCKED SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT EXCEED THE FEES YOU PAID IN THE LAST 12 MONTHS. Some jurisdictions do not allow limitation of liability for certain damages, so this limitation may not apply to you.',
  },
  {
    title: '9. Changes to Terms',
    content: 'We reserve the right to modify these Terms at any time. We will provide 30 days notice for material changes via email and in-platform notification. Your continued use of the Platform after changes take effect constitutes acceptance. If you do not agree to new Terms, you may cancel your subscription before the effective date.',
  },
  {
    title: '10. Governing Law',
    content: 'These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes shall be resolved through binding arbitration in San Francisco, California, except that either party may seek injunctive relief in a court of competent jurisdiction.',
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />
      <section className="bg-navy pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0f2d1f] to-navy opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        <div className="relative max-w-3xl mx-auto text-center">
          <FileText className="w-12 h-12 text-emerald-400 mx-auto mb-4 animate-float" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Terms of <span className="text-gradient-emerald">Service</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base">Last updated: January 2024 · Effective January 1, 2024</p>
        </div>
      </section>
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-5 mb-10">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Important Notice:</strong> By using ValueUnlocked, you acknowledge that our platform provides informational tools only and not licensed financial advice. Please read Section 3 (Investment Disclaimer) carefully.
            </p>
          </div>
          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i} className="pb-8 border-b border-slate-100 dark:border-white/10 last:border-0">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">{section.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 bg-slate-50 dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Questions about our Terms of Service?</p>
            <Link to="/contact" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">Contact Legal Team →</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
