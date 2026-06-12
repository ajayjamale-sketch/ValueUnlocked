import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/features/HeroSection';
import FeaturesSection from '@/components/features/FeaturesSection';
import WorkflowSection from '@/components/features/WorkflowSection';
import BenefitsSection from '@/components/features/BenefitsSection';
import DashboardPreviewSection from '@/components/features/DashboardPreviewSection';
import TestimonialsSection from '@/components/features/TestimonialsSection';
import PricingSection from '@/components/features/PricingSection';
import FAQSection from '@/components/features/FAQSection';
import CTASection from '@/components/features/CTASection';
import { initTheme } from '@/lib/auth';

export default function Index() {
  useEffect(() => {
    initTheme();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <BenefitsSection />
      <DashboardPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
