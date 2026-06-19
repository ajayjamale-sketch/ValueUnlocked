import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Building2, Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const contactMethods = [
  { icon: Mail, label: 'Email Support', value: 'support@valueunlocked.ai', desc: 'Typical response: 4 hours' },
  { icon: Phone, label: 'Phone (Enterprise)', value: '+1 (888) 482-6555', desc: 'Mon–Fri, 9 AM – 6 PM EST' },
  { icon: MapPin, label: 'Headquarters', value: '100 Market Street, San Francisco, CA 94105', desc: 'United States' },
  { icon: Clock, label: 'Support Hours', value: '24/7 AI Chat + Email', desc: 'Human support Mon–Fri' },
];

const topics = ['General Inquiry', 'Technical Support', 'Billing & Pricing', 'Partnership / Enterprise', 'Press & Media', 'Feature Request'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', topic: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Message sent! We will get back to you within 4 hours.');
  };

  const handleEnterpriseClick = () => {
    // Pre-fill topic and message
    setForm(p => ({
      ...p,
      topic: 'Partnership / Enterprise',
      message: p.message || 'Hi, I would like to inquire about ValueUnlocked Enterprise solutions for my organization.'
    }));

    // If name and email are already filled, submit the form directly
    if (form.name && form.email) {
      // Use a small delay to allow state update to propagate, then submit
      setTimeout(() => {
        formRef.current?.requestSubmit();
      }, 50);
    } else {
      // Otherwise notify and scroll to the form
      toast.info('Please fill in your name and email, then we\'ll send your enterprise inquiry.');
      const el = document.getElementById('contact-form');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.classList.add('ring-2', 'ring-emerald-500', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-emerald-500');
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617]">
      <Navbar />

      {/* Hero */}
      <section className="bg-navy pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0f2d1f] to-navy opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6 animate-pulse-slow">
            Contact Support & Sales
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Get in <span className="text-gradient-emerald">Touch</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We would love to hear from you. Our team is available to help you with any question, feedback, or custom enterprise requirements.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Contact Information</h2>
              {contactMethods.map((method, i) => {
                const Icon = method.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-navy rounded-xl border border-slate-200 dark:border-white/10">
                    <div className="w-10 h-10 gradient-growth rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{method.label}</p>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-0.5">{method.value}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{method.desc}</p>
                    </div>
                  </div>
                );
              })}

                <Button 
                  size="sm" 
                  className="gradient-growth text-white border-0 w-full h-8 text-xs font-semibold"
                  onClick={handleEnterpriseClick}
                >
                  Talk to Enterprise Sales
                </Button>
              </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-20 h-20 gradient-growth rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Message Sent!</h2>
                  <p className="text-slate-400 mb-6">Thanks for reaching out, {form.name.split(' ')[0]}. We will respond to {form.email} within 4 hours.</p>
                  <Button className="gradient-growth text-white border-0" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', topic: 'General Inquiry', message: '' }); }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div id="contact-form" className="bg-white dark:bg-navy rounded-2xl border border-slate-200 dark:border-white/10 p-8">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Send Us a Message</h2>
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
                        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Smith" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
                        <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@company.com" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company (Optional)</label>
                        <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Your company name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Topic</label>
                        <select value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-sm">
                          {topics.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                        required
                      />
                    </div>
                    <Button type="submit" className="gradient-growth text-white border-0 w-full gap-2 py-3">
                      <Send className="w-4 h-4" /> Send Message
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}