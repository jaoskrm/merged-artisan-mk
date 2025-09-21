'use client'

export default function AboutStorySection(): React.ReactNode {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Badge */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              OUR JOURNEY
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1]">
            Why We Started
          </h2>
          
          <p className="text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium mb-8">
            In a world increasingly dominated by mass production, we witnessed countless talented artisans struggling to reach customers who truly valued their craft.
          </p>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-12 max-w-3xl mx-auto">
            Traditional retail channels often took 50-80% of profits, leaving creators with little to sustain their passion. Founded in 2023, Artisans Marketplace emerged from a simple belief: exceptional handmade art deserves a platform that honors both creator and collector.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">2023</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Founded</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">15K+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Active Artists</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-extrabold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">50+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
