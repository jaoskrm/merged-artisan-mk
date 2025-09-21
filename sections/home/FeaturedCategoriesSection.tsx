'use client'

export default function FeaturedCategoriesSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              WHAT WE OFFER
            </span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1] tracking-tight">
            Discover Amazing{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Art Categories
            </span>
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Explore our diverse collection of handcrafted pieces from talented artisans worldwide
          </p>
        </div>

        {/* Categories Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Handmade Jewelry */}
          <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              💎
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Handmade Jewelry</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base mb-6 leading-relaxed">
              Unique necklaces, bracelets, rings and earrings crafted with precious metals, gemstones and traditional techniques
            </p>
            <div className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full inline-block font-semibold">
              2,500+ unique pieces
            </div>
          </div>

          {/* Traditional Textiles */}
          <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              🧵
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Traditional Textiles</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base mb-6 leading-relaxed">
              Handwoven fabrics, tapestries, scarves and clothing featuring authentic cultural patterns from around the globe
            </p>
            <div className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full inline-block font-semibold">
              1,800+ authentic patterns
            </div>
          </div>

          {/* Pottery & Ceramics */}
          <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              🏺
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Pottery & Ceramics</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base mb-6 leading-relaxed">
              Functional and decorative ceramic pieces including vases, bowls, plates and sculptures made with clay and fire
            </p>
            <div className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full inline-block font-semibold">
              1,200+ functional art pieces
            </div>
          </div>

          {/* Digital Art */}
          <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
              🎨
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Digital Art</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base mb-6 leading-relaxed">
              Contemporary digital illustrations, NFTs, graphic designs and multimedia artworks created with modern tools
            </p>
            <div className="text-sm text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-full inline-block font-semibold">
              900+ modern creations
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-12">
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Authenticity Guaranteed</h3>
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Every piece is verified authentic with detailed documentation of materials and techniques used</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Global Artisan Network</h3>
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Connect with skilled craftspeople from over 50 countries sharing their cultural heritage</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Handcrafted with Love</h3>
            <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Each item is carefully made by hand with passion, dedication and years of artistic expertise</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-20 bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">6,400+</div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 font-medium">Total Artworks</div>
            </div>
            <div className="group">
              <div className="text-4xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">15,000+</div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 font-medium">Active Artisans</div>
            </div>
            <div className="group">
              <div className="text-4xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">50+</div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 font-medium">Countries</div>
            </div>
            <div className="group">
              <div className="text-4xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">4.9★</div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
