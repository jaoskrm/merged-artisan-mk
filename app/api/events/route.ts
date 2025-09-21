import { NextRequest } from 'next/server';
import { Event, EventFilters } from '../../../lib/types/events';

// In-memory storage for demo - replace with database
let events: Event[] = [
  {
    id: '1',
    title: 'Traditional Pottery Making Workshop',
    description: 'Learn the ancient art of pottery making with clay, wheel throwing, and glazing techniques. Perfect for beginners who want to create their first ceramic pieces.',
    type: 'workshop',
    category: 'pottery',
    isPaid: true,
    price: 1500,
    currency: 'INR',
    capacity: 20,
    registeredCount: 12,
    startDate: '2025-10-15',
    endDate: '2025-10-15',
    startTime: '10:00',
    endTime: '16:00',
    timezone: 'Asia/Kolkata',
    isOnline: false,
    location: {
      address: '123 Artist Street, Pottery Quarter',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    organizerId: 'artist1',
    organizerName: 'Meera Sharma',
    organizerType: 'artist',
    image: '/api/placeholder/400/300',
    tags: ['pottery', 'traditional', 'hands-on', 'ceramics'],
    requirements: ['No prior experience needed', 'Comfortable clothes'],
    materials: ['Clay and tools provided', 'Apron recommended'],
    skillLevel: 'beginner',
    language: ['English', 'Hindi'],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Digital Art Exhibition - Future Crafts',
    description: 'A virtual exhibition showcasing the intersection of traditional crafts and digital art. Featuring 50+ artists from across India.',
    type: 'exhibition',
    category: 'mixed',
    isPaid: false,
    price: 0,
    currency: 'INR',
    capacity: 500,
    registeredCount: 234,
    startDate: '2025-10-20',
    endDate: '2025-10-27',
    startTime: '00:00',
    endTime: '23:59',
    timezone: 'Asia/Kolkata',
    isOnline: true,
    onlineLink: 'https://exhibition.artisans-marketplace.com/future-crafts',
    organizerId: 'gov1',
    organizerName: 'Ministry of Culture',
    organizerType: 'government',
    image: '/api/placeholder/400/300',
    tags: ['exhibition', 'digital', 'government', 'cultural'],
    skillLevel: 'all',
    language: ['English', 'Hindi'],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: EventFilters = {
      type: searchParams.get('type')?.split(','),
      category: searchParams.get('category')?.split(','),
      isOnline: searchParams.get('isOnline') === 'true' ? true : searchParams.get('isOnline') === 'false' ? false : undefined,
      location: searchParams.get('location') || undefined,
      search: searchParams.get('search') || undefined,
    };

    let filteredEvents = [...events];

    // Apply filters
    if (filters.type?.length) {
      filteredEvents = filteredEvents.filter(event => filters.type!.includes(event.type));
    }
    
    if (filters.category?.length) {
      filteredEvents = filteredEvents.filter(event => filters.category!.includes(event.category));
    }
    
    if (filters.isOnline !== undefined) {
      filteredEvents = filteredEvents.filter(event => event.isOnline === filters.isOnline);
    }
    
    if (filters.location) {
      filteredEvents = filteredEvents.filter(event => 
        event.location?.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        event.location?.state.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter only published events
    filteredEvents = filteredEvents.filter(event => event.status === 'published');

    // Sort by start date
    filteredEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return Response.json({ events: filteredEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    events.push(newEvent);

    return Response.json({ event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
