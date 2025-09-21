export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'exhibition' | 'community' | 'government';
  category: 'pottery' | 'textiles' | 'jewelry' | 'woodwork' | 'painting' | 'mixed' | 'other';
  isPaid: boolean;
  price?: number;
  currency: string;
  capacity?: number;
  registeredCount: number;
  
  // Date and time
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  
  // Location
  isOnline: boolean;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  onlineLink?: string;
  
  // Organizer
  organizerId: string;
  organizerName: string;
  organizerType: 'artist' | 'government' | 'organization';
  
  // Media
  image?: string;
  gallery?: string[];
  
  // Metadata
  tags: string[];
  requirements?: string[];
  materials?: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
  language: string[];
  
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  type?: string[];
  category?: string[];
  isPaid?: boolean;
  isOnline?: boolean;
  location?: string;
  dateRange?: { start: string; end: string };
  skillLevel?: string[];
  priceRange?: { min: number; max: number };
  search?: string;
}
