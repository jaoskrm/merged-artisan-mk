'use client'

export default function AboutHeroSection(): React.ReactNode {
  return (
    <section className="px-6 py-12 pt-20 pb-20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            OUR STORY
          </span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-extrabold text-neutral-900 dark:text-neutral-50 leading-[1.1] tracking-tight mb-8">
          About Our{' '}
          <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Mission
          </span>
        </h1>
        
        <p className="text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium max-w-4xl mx-auto">
          We're building bridges between talented artisans and art lovers worldwide, 
          creating a sustainable ecosystem that celebrates creativity, craftsmanship, and cultural heritage.
        </p>
      </div>
    </section>
  );
}
