'use client'

interface ImpactStat {
  number: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function AboutImpactSection(): React.ReactNode {
  const impactStats: ImpactStat[] = [
    { 
      number: "$2.5M+", 
      label: "Paid to Artists", 
      icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>, 
      description: "Direct earnings in artist pockets" 
    },
    { 
      number: "15,000+", 
      label: "Active Artisans", 
      icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>, 
      description: "From 50+ countries worldwide" 
    },
    { 
      number: "300%", 
      label: "Average Sales Increase", 
      icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>, 
      description: "For artists joining our platform" 
    },
    { 
      number: "98%", 
      label: "Satisfaction Rate", 
      icon: <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>, 
      description: "Based on buyer feedback" 
    }
  ];

  return (
    <section className="px-6 py-20 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto">
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
            Making a{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Difference
            </span>
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Real numbers showing how we're making a difference in artisan communities worldwide
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {impactStats.map((stat: ImpactStat, index: number) => (
            <div key={index} className="bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-3xl p-8 text-center hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
              <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold text-primary mb-3 group-hover:scale-105 transition-transform duration-300">{stat.number}</div>
              <div className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">{stat.label}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.description}</div>
            </div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i: number) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-neutral-900 dark:text-neutral-100 mb-8 text-lg leading-relaxed">
              "This platform changed my life. I went from struggling to make ends meet to having a sustainable business. The support team genuinely cares about artist success."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
                MC
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-base">Maria Chen</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Ceramic Artist, Portugal</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i: number) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p className="text-neutral-900 dark:text-neutral-100 mb-8 text-lg leading-relaxed">
              "As a collector, I love the transparency about each piece's origin and the artist's story. You can feel the passion in every purchase."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
                DK
              </div>
              <div>
                <div className="font-bold text-neutral-900 dark:text-neutral-100 text-base">David Kim</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Art Collector, South Korea</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
