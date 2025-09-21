'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Event } from '../../../../lib/types/events';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
      } else {
        router.push('/events');
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Implementation for event registration
    setRegistering(true);
    try {
      // API call to register for event
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Successfully registered for the event!');
    } catch (error) {
      alert('Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Event Not Found</h1>
          <button
            onClick={() => router.push('/events')}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Events
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  event.type === 'workshop' ? 'bg-blue-500 text-white' :
                  event.type === 'exhibition' ? 'bg-purple-500 text-white' :
                  event.type === 'government' ? 'bg-green-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
                {event.isPaid ? (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ₹{event.price}
                  </span>
                ) : (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    FREE
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-4">
                {event.title}
              </h1>
              
              <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                {event.description}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold">
                    {new Date(event.startDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {event.isOnline ? (
                    <>
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-18 0m18 0a9 9 0 01-18 0m18 0H3m18 0a9 9 0 01-18 0" />
                      </svg>
                      <span>Online Event</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {event.location?.address}, {event.location?.city}, {event.location?.state}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>
                    Organized by {event.organizerName}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
                >
                  {registering ? 'Registering...' : event.isPaid ? `Register for ₹${event.price}` : 'Register for Free'}
                </button>
                <button
                  onClick={() => router.push('/events')}
                  className="border border-stone-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
            
            <div>
              {event.image && (
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-stone-200 dark:border-neutral-800 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Event Details</h2>
                
                {event.requirements && event.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-neutral-700 dark:text-neutral-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.materials && event.materials.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Materials & Tools</h3>
                    <ul className="space-y-2">
                      {event.materials.map((material, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-neutral-700 dark:text-neutral-300">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-stone-200 dark:border-neutral-800 p-6 sticky top-6">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Event Info</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">Capacity</span>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {event.registeredCount} / {event.capacity || '∞'}
                      </span>
                      <div className="w-20 h-2 bg-stone-200 dark:bg-neutral-800 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${event.capacity ? (event.registeredCount / event.capacity) * 100 : 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">Skill Level</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                      {event.skillLevel}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">Category</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 capitalize">
                      {event.category}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">Languages</span>
                    <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {event.language.join(', ')}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-stone-200 dark:border-neutral-800">
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {registering ? 'Registering...' : event.isPaid ? `Register - ₹${event.price}` : 'Register Free'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
