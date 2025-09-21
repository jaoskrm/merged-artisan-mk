'use client'

const testimonials = [
  {
    quote: "I found the most beautiful handmade necklace here. The artist was so helpful and even customized it perfectly for my special day!",
    author: "Sarah Johnson",
    role: "Art Collector",
    rating: 5,
    location: "New York, USA",
    avatar: "SJ"
  },
  {
    quote: "As an artist, this platform helped me reach customers worldwide. My pottery sales have increased 300% since joining!",
    author: "Carlos Rivera",
    role: "Ceramic Artist",
    rating: 5,
    location: "Mexico City, MX",
    avatar: "CR"
  },
  {
    quote: "The quality of handmade textiles here is incredible. Each piece tells a story and the artists are so passionate about their work.",
    author: "Priya Sharma",
    role: "Interior Designer",
    rating: 5,
    location: "Mumbai, India",
    avatar: "PS"
  },
  {
    quote: "Love supporting independent artists! The customer service is amazing and shipping is always careful and secure.",
    author: "Emma Thompson",
    role: "Art Enthusiast",
    rating: 5,
    location: "London, UK",
    avatar: "ET"
  },
  {
    quote: "Found unique pieces for my art gallery here. The variety and authenticity of work is unmatched anywhere else online.",
    author: "David Kim",
    role: "Gallery Owner",
    rating: 5,
    location: "Seoul, Korea",
    avatar: "DK"
  },
  {
    quote: "The commission process was seamless. The artist understood exactly what I wanted and delivered beyond my expectations!",
    author: "Maria Santos",
    role: "Collector",
    rating: 5,
    location: "São Paulo, Brazil",
    avatar: "MS"
  }
];

export default function TestimonialsSection() {
  // Duplicate testimonials for infinite scroll effect
  const duplicatedTestimonials = [...testimonials, ...testimonials.slice(0, 3)];

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              CUSTOMER STORIES
            </span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1] tracking-tight">
            What Our{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Real stories from artists and customers who've found their perfect match
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="flex gap-8 animate-[scroll_35s_linear_infinite] hover:pause">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-96">
                <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-8 h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-neutral-900 dark:text-neutral-100 mb-8 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 text-base">{testimonial.author}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{testimonial.role}</div>
                      <div className="text-sm text-primary font-medium">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
