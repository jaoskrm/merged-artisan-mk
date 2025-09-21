'use client'

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AboutHeroSection from '../../../sections/about/AboutHeroSection';
import AboutStorySection from '../../../sections/about/AboutStorySection';
import AboutImpactSection from '../../../sections/about/AboutImpactSection';
import AboutTeamSection from '../../../sections/about/AboutTeamSection';

export default function About(): React.ReactNode {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      <AboutHeroSection />
      <AboutStorySection />
      <AboutImpactSection />
      <AboutTeamSection />
      <Footer />
    </div>
  );
}
