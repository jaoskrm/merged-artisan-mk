'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '../../../lib/types/events';

export default function CreateEventPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'workshop' as Event['type'],
    category: 'pottery' as Event['category'],
    isPaid: false,
    price: 0,
    capacity: 50,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isOnline: false,
    address: '',
    city: '',
    state: '',
    country: 'India',
    onlineLink: '',
    requirements: '',
    materials: '',
    skillLevel: 'all' as Event['skillLevel'],
    language: ['English'],
    tags: '',
  });

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (authToken && userStr) {
      setUser(JSON.parse(userStr));
      setIsAuthenticated(true);
    } else {
      router.push('/auth');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const eventData: Partial<Event> = {
        ...formData,
        organizerId: user.id,
        organizerName: user.name,
        organizerType: 'artist',
        currency: 'INR',
        registeredCount: 0,
        timezone: 'Asia/Kolkata',
        location: formData.isOnline ? undefined : {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
        },
        requirements: formData.requirements.split('\n').filter(Boolean),
        materials: formData.materials.split('\n').filter(Boolean),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'published',
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/events/${result.event.id}`);
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-stone-50 dark:bg-neutral-950 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-stone-200 dark:border-neutral-800 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-3">
              Create New Event
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Host workshops, exhibitions, or community events to connect with fellow artisans and share your expertise.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    placeholder="e.g., Pottery Basics Workshop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="community">Community Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  >
                    <option value="pottery">Pottery</option>
                    <option value="textiles">Textiles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="woodwork">Woodwork</option>
                    <option value="painting">Painting</option>
                    <option value="mixed">Mixed Arts</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    placeholder="Describe your event, what participants will learn, and what makes it special..."
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Pricing & Capacity</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={formData.isPaid}
                    onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                    className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isPaid" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    This is a paid event
                  </label>
                </div>

                {formData.isPaid && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 50)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>
            </section>

            {/* Date & Time */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Date & Time</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Location</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={formData.isOnline}
                    onChange={(e) => handleInputChange('isOnline', e.target.checked)}
                    className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isOnline" className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    This is an online event
                  </label>
                </div>

                {formData.isOnline ? (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      Online Meeting Link
                    </label>
                    <input
                      type="url"
                      value={formData.onlineLink}
                      onChange={(e) => handleInputChange('onlineLink', e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                      placeholder="https://zoom.us/... or meet.google.com/..."
                    />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        required={!formData.isOnline}
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required={!formData.isOnline}
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required={!formData.isOnline}
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Additional Details */}
            <section>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Additional Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Skill Level *
                  </label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => handleInputChange('skillLevel', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Requirements (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    placeholder="Basic drawing skills&#10;Own laptop&#10;Zoom account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Materials Needed (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.materials}
                    onChange={(e) => handleInputChange('materials', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    placeholder="Clay (500g)&#10;Sculpting tools&#10;Apron"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-neutral-800"
                    placeholder="pottery, beginners, hands-on, ceramics"
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 border border-stone-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-2xl font-bold text-lg hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
