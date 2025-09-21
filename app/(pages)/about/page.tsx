'use client'

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AboutHeroSection from '../../sections/about/AboutHeroSection';
import AboutStorySection from '../../sections/about/AboutStorySection';
import AboutImpactSection from '../../sections/about/AboutImpactSection';
import AboutTeamSection from '../../sections/about/AboutTeamSection';

export default function About(): React.ReactNode {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      {/* ADD PT-20 WRAPPER TO FIX HEADER OVERLAP */}
      <div className="pt-20">
        <AboutHeroSection />
        <AboutStorySection />
        <AboutImpactSection />
        <AboutTeamSection />
      </div>
      <Footer />
    </div>
  );
}
