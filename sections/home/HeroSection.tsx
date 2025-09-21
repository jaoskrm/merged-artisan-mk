'use client'

export default function HeroSection() {
  return (
    <section className="flex items-center px-6 py-12 pt-20 pb-20 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Connecting Artists Worldwide
            </span>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-neutral-900 dark:text-neutral-50 leading-[1.1] tracking-tight">
              Artisan Marketplace For{' '}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Creative Businesses
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              Empowering Your Creative Business With Next-Generation Technology
            </p>
            
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
              Transform your artisan business operations with our comprehensive marketplace solution designed specifically for creators. Streamline processes, enhance customer experiences, and accelerate growth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-3">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button className="bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border border-stone-200 dark:border-neutral-700">
                Browse Artists
              </button>
            </div>
          </div>

          {/* Right Column - Image & Stats */}
          <div className="relative h-full flex items-center justify-center">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden aspect-[3/4] w-full border border-stone-200 dark:border-neutral-800">
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Artisan marketplace showing handcrafted pottery and ceramic arts display"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Enhanced Floating Stats Card */}
              <div className="absolute -bottom-8 -right-6 bg-stone-50 dark:bg-neutral-900 rounded-3xl p-6 min-w-[200px] border border-stone-200 dark:border-neutral-800">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">4.9</span>
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Customer Rating</div>
                  </div>
                  <div className="h-14 w-px bg-stone-300 dark:bg-neutral-700" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">15K+</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Active Artists</div>
                  </div>
                </div>
              </div>

              {/* Improved Floating Badge */}
              <div className="absolute -top-6 -left-6 bg-stone-50 dark:bg-neutral-900 rounded-2xl p-4 border border-stone-200 dark:border-neutral-800">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                    </svg>
                  </div>
                  <div className="text-sm text-primary font-bold">Live Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
