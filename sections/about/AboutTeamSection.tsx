'use client'

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string;
  location: string;
  expertise: string[];
  joinDate: string;
  linkedin: string;
  quote: string;
}

export default function AboutTeamSection(): React.ReactNode {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Co-Founder & CEO",
      department: "Leadership",
      bio: "Former product leader at Google Arts & Culture with a passion for connecting traditional artisans with global markets.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=400&h=400&fit=crop&crop=face",
      location: "San Francisco, CA",
      expertise: ["Product Strategy", "Cultural Preservation", "Global Markets"],
      joinDate: "2023",
      linkedin: "#",
      quote: "Technology should preserve culture, not replace it."
    },
    {
      id: 2,
      name: "Marco Rodriguez",
      role: "Co-Founder & CTO",
      department: "Technology",
      bio: "Full-stack engineer with 12+ years building scalable platforms that serve millions of users worldwide.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      location: "Barcelona, Spain",
      expertise: ["System Architecture", "Platform Scaling", "Team Leadership"],
      joinDate: "2023",
      linkedin: "#",
      quote: "Great technology is invisible but transforms everything."
    },
    {
      id: 3,
      name: "Amara Okafor",
      role: "Head of Artist Relations",
      department: "Community",
      bio: "Former curator at the British Museum with deep expertise in African and diaspora art connecting artisans globally.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
      location: "London, UK",
      expertise: ["Art Curation", "Community Building", "Cultural Outreach"],
      joinDate: "2023",
      linkedin: "#",
      quote: "Every artwork tells a story that deserves global recognition."
    },
    {
      id: 4,
      name: "Hiroshi Tanaka",
      role: "Lead Designer",
      department: "Design",
      bio: "Award-winning UX designer who believes in minimalist interfaces that celebrate the artwork and user experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      location: "Tokyo, Japan",
      expertise: ["UI/UX Design", "Design Systems", "User Research"],
      joinDate: "2024",
      linkedin: "#",
      quote: "The best design makes the impossible feel effortless."
    },
    {
      id: 5,
      name: "Elena Popovic",
      role: "VP of Operations",
      department: "Operations",
      bio: "Operations expert who scaled Etsy's seller experience ensuring smooth platform operations across 50+ countries.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      location: "Prague, Czech Republic",
      expertise: ["Operations Management", "Process Optimization", "International Expansion"],
      joinDate: "2024",
      linkedin: "#",
      quote: "Smooth operations enable unlimited creative freedom."
    },
    {
      id: 6,
      name: "David Kim",
      role: "Head of Marketing",
      department: "Marketing",
      bio: "Digital marketing strategist focused on authentic storytelling and artist empowerment in the creator economy.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      location: "Seoul, South Korea",
      expertise: ["Digital Marketing", "Creator Economy", "Brand Strategy"],
      joinDate: "2024",
      linkedin: "#",
      quote: "Every artist has a unique story worth sharing globally."
    }
  ];

  // Duplicate team members for infinite scroll effect
  const duplicatedTeamMembers = [...teamMembers, ...teamMembers.slice(0, 3)];

  return (
    <>
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/15 text-primary px-4 py-2.5 rounded-full text-sm font-semibold border border-primary/20 dark:border-primary/25">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              MEET THE TEAM
            </span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 leading-[1.1] tracking-tight">
            Meet Our{' '}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Our diverse global team brings together expertise in technology, art, business, and cultural preservation
          </p>
        </div>
        
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="flex gap-8 animate-[scroll_40s_linear_infinite] hover:pause">
            {duplicatedTeamMembers.map((member, index) => (
              <div key={index} className="flex-shrink-0 w-96">
                <div className="bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl overflow-hidden h-full hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 group hover:scale-[1.02]">
                  
                  {/* Member Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                      <div className="text-white">
                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                        <div className="text-white/90 text-sm font-medium">{member.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Member Content */}
                  <div className="p-6">
                    {/* Department & Location */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                        {member.department}
                      </span>
                      <div className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {member.location}
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="mb-4">
                      <blockquote className="text-neutral-700 dark:text-neutral-300 italic text-sm leading-relaxed">
                        "{member.quote}"
                      </blockquote>
                    </div>

                    {/* Bio */}
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6">
                      {member.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {member.expertise.map((skill: string, skillIndex: number) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-stone-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-neutral-700">
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        Joined {member.joinDate}
                      </div>
                      <a
                        href={member.linkedin}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Connect
                      </a>
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
