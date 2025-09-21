'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event, EventFilters } from '../../lib/types/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({});
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type?.length) params.append('type', filters.type.join(','));
      if (filters.category?.length) params.append('category', filters.category.join(','));
      if (filters.isOnline !== undefined) params.append('isOnline', filters.isOnline.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);

      const response = await fetch(`/api/events?${params}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-stone-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {event.image && (
        <div className="h-48 bg-gradient-to-r from-primary/10 to-primary/5 relative overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              event.type === 'workshop' ? 'bg-blue-500 text-white' :
              event.type === 'exhibition' ? 'bg-purple-500 text-white' :
              event.type === 'government' ? 'bg-green-500 text-white' :
              'bg-orange-500 text-white'
            }`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            {event.isPaid ? (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ₹{event.price}
              </span>
            ) : (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                FREE
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2">
            {event.title}
          </h3>
          <div className="text-right text-sm text-neutral-600 dark:text-neutral-400">
            {event.isOnline ? (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-18 0m18 0a9 9 0 01-18 0m18 0H3m18 0a9 9 0 01-18 0" />
                </svg>
                Online
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location?.city}
              </div>
            )}
          </div>
        </div>
        
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">
              {new Date(event.startDate).toLocaleDateString()}
            </div>
            <div className="text-neutral-600 dark:text-neutral-400">
              {event.startTime} - {event.endTime}
            </div>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            By {event.organizerName}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {event.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-1 bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-lg">
                {tag}
              </span>
            ))}
          </div>
          <Link 
            href={`/events/${event.id}`}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Events & Workshops
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Discover workshops, exhibitions, and community events. Learn new skills, connect with fellow artisans, and showcase your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/for-artists/create-event" 
              className="bg-white text-primary hover:bg-stone-100 px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
            >
              Create Event
            </Link>
            <Link 
              href="#events" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-neutral-900 border-b border-stone-200 dark:border-neutral-800" id="events">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-3">
              <select 
                className="px-4 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800"
                onChange={(e) => setFilters({...filters, type: e.target.value ? [e.target.value] : []})}
              >
                <option value="">All Types</option>
                <option value="workshop">Workshops</option>
                <option value="exhibition">Exhibitions</option>
                <option value="community">Community Events</option>
                <option value="government">Government Events</option>
              </select>
              
              <select 
                className="px-4 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800"
                onChange={(e) => setFilters({...filters, category: e.target.value ? [e.target.value] : []})}
              >
                <option value="">All Categories</option>
                <option value="pottery">Pottery</option>
                <option value="textiles">Textiles</option>
                <option value="jewelry">Jewelry</option>
                <option value="woodwork">Woodwork</option>
                <option value="painting">Painting</option>
                <option value="mixed">Mixed Arts</option>
              </select>
              
              <select 
                className="px-4 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800"
                onChange={(e) => setFilters({...filters, isOnline: e.target.value === 'online' ? true : e.target.value === 'offline' ? false : undefined})}
              >
                <option value="">Online & Offline</option>
                <option value="online">Online Only</option>
                <option value="offline">In-Person Only</option>
              </select>
              
              <input
                type="text"
                placeholder="Search location..."
                className="px-4 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800"
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search events..."
                className="px-4 py-2 border border-stone-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800"
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
              <div className="flex border border-stone-300 dark:border-neutral-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 py-2 ${view === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-2 ${view === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-neutral-800'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-stone-200 dark:bg-neutral-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-stone-400 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">No Events Found</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">Try adjusting your filters or check back later for new events.</p>
              <Link 
                href="/for-artists/create-event"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Create First Event
              </Link>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
