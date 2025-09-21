'use client'

import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../sections/home/HeroSection';
import FeaturedCategoriesSection from '../sections/home/FeaturedCategoriesSection';
import TestimonialsSection from '../sections/home/TestimonialsSection';
import StatsAndCTASection from '../sections/home/StatsAndCTASection';

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedCategoriesSection />
      <TestimonialsSection />
      <StatsAndCTASection />
      <Footer />
    </div>
  );
}

