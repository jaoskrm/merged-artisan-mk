import { NextRequest } from 'next/server';

// This should match the events array from the main API route
// In a real app, this would query the same database
const events = [
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
  // ... other events
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const event = events.find(e => e.id === params.id);
    
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return Response.json({ event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
