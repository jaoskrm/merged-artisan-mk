'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'exhibition' | 'fair' | 'community';
  category: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  onlineLink?: string;
  price: number;
  isPaid: boolean;
  capacity: number;
  registeredCount: number;
  organizerName: string;
  organizerType: 'artist' | 'gallery' | 'community';
  status: 'published' | 'cancelled';
  tags: string[];
  image?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || event.type === filter;
    return matchesSearch && matchesFilter;
  });

  const eventTypes = [
    { value: 'all', label: 'All Events', icon: '🎨' },
    { value: 'workshop', label: 'Workshops', icon: '🛠️' },
    { value: 'exhibition', label: 'Exhibitions', icon: '🖼️' },
    { value: 'fair', label: 'Art Fairs', icon: '🎪' },
    { value: 'community', label: 'Community', icon: '👥' }
  ];

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-400">Loading events...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      
      {/* ADD PT-20 WRAPPER TO FIX HEADER OVERLAP */}
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Artisan Events & Workshops
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              Join workshops, exhibitions, and community events to learn new skills and connect with fellow artisans
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="w-full px-6 py-4 pl-14 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
              />
              <svg className="absolute left-5 top-4 w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Create Event Button */}
            <Link
              href="/for-artists/create-event"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </Link>
          </div>
        </section>

        {/* Event Filters & List */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Event Type Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                  filter === type.value
                    ? 'bg-primary text-white'
                    : 'bg-stone-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-stone-200 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No events found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to create an event!'}
              </p>
              <Link
                href="/for-artists/create-event"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M12 4v16m8-8H4" />
                </svg>
                Create Event
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-stone-200/60 dark:border-neutral-800/60 hover:shadow-lg transition-all duration-300">
                  
                  {/* Event Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                    <div className="text-4xl">
                      {eventTypes.find(t => t.value === event.type)?.icon || '🎨'}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        event.type === 'workshop' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        event.type === 'exhibition' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        event.type === 'fair' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {event.isOnline ? '🌐 Online' : '📍 In-person'}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        by {event.organizerName}
                      </div>

                      {!event.isOnline && event.location && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.location.city}, {event.location.state}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                          {event.isPaid ? `$${event.price}` : 'Free'}
                        </span>
                        <div className="text-xs text-neutral-500">
                          {event.registeredCount}/{event.capacity} registered
                        </div>
                      </div>

                      <Link
                        href={`/events/${event.id}`}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
