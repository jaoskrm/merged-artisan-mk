'use client'

const stats = [
  { number: "15K+", label: "Active Artists", icon: "👨‍🎨" },
  { number: "75K+", label: "Unique Products", icon: "🎨" },
  { number: "50K+", label: "Happy Customers", icon: "😊" },
  { number: "98%", label: "Satisfaction Rate", icon: "⭐" }
];

export default function StatsAndCTASection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Stats Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                OUR IMPACT
              </span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1] tracking-tight">
              Growing{' '}
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Creative Community
              </span>
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium">
              Join thousands of artists and art lovers in our thriving marketplace ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 text-center hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-base text-neutral-600 dark:text-neutral-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-stone-50 dark:bg-neutral-900 rounded-3xl p-16 border border-stone-200 dark:border-neutral-800">
          
          <h2 className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1] tracking-tight">
            Ready to Start Your{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Creative Journey?
            </span>
          </h2>
          
          <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Join thousands of art lovers and creators in our vibrant marketplace community. Discover unique pieces or showcase your own artistic creations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-3">
              Shop Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="bg-stone-100 hover:bg-stone-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border border-stone-200 dark:border-neutral-700">
              Sell Your Art
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
