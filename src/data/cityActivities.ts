export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  type: 'activity' | 'attraction' | 'experience';
  ticketUrl?: string;
  image: string;
  rating: number;
  category: string;
  cityId: string;
}

export const activityCategories: ActivityCategory[] = [
  {
    id: 'cultural',
    name: 'Cultural',
    icon: '🏛️',
    description: 'Museums, temples, and cultural sites'
  },
  {
    id: 'culinary',
    name: 'Culinary',
    icon: '🍜',
    description: 'Food tours, cooking classes, and local cuisine'
  },
  {
    id: 'spiritual',
    name: 'Spiritual',
    icon: '🧘',
    description: 'Meditation, temples, and spiritual experiences'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: '🏔️',
    description: 'Outdoor activities and adventures'
  },
  {
    id: 'arts',
    name: 'Arts & Crafts',
    icon: '🎨',
    description: 'Art galleries, workshops, and creative experiences'
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    icon: '🌃',
    description: 'Bars, clubs, and evening entertainment'
  }
];

export const cityActivities: Record<string, Activity[]> = {
  tokyo: [
    {
      id: 'tokyo-tea-ceremony',
      name: 'Traditional Tea Ceremony Experience',
      description: 'Learn the ancient art of Japanese tea ceremony in a historic tea house',
      duration: '2 hours',
      price: 45,
      location: { lat: 35.6762, lng: 139.6503 },
      type: 'experience',
      ticketUrl: 'https://example.com/tea-ceremony',
      image: '/src/assets/chinese-tea-lesson.jpg',
      rating: 4.8,
      category: 'cultural',
      cityId: 'tokyo'
    },
    {
      id: 'tokyo-sensoji',
      name: 'Senso-ji Temple Visit',
      description: 'Explore Tokyo\'s oldest Buddhist temple with guided meditation',
      duration: '1.5 hours',
      price: 25,
      location: { lat: 35.7148, lng: 139.7967 },
      type: 'attraction',
      ticketUrl: 'https://example.com/sensoji',
      image: '/src/assets/khmer-temple-lesson.jpg',
      rating: 4.9,
      category: 'spiritual',
      cityId: 'tokyo'
    },
    {
      id: 'tokyo-street-food',
      name: 'Street Food Walking Tour',
      description: 'Discover hidden gems and authentic local flavors in vibrant neighborhoods',
      duration: '3 hours',
      price: 65,
      location: { lat: 35.6684, lng: 139.6833 },
      type: 'activity',
      ticketUrl: 'https://example.com/street-food',
      image: '/src/assets/japanese-street-food-lesson.jpg',
      rating: 4.7,
      category: 'culinary',
      cityId: 'tokyo'
    },
    {
      id: 'tokyo-artisan',
      name: 'Local Artisan Workshop',
      description: 'Create traditional crafts with master artisans',
      duration: '4 hours',
      price: 85,
      location: { lat: 35.6586, lng: 139.7454 },
      type: 'experience',
      ticketUrl: 'https://example.com/artisan',
      image: '/src/assets/culture-experiences.jpg',
      rating: 4.9,
      category: 'arts',
      cityId: 'tokyo'
    },
    {
      id: 'tokyo-sushi-making',
      name: 'Sushi Making Class',
      description: 'Learn to make authentic sushi from a professional chef',
      duration: '3 hours',
      price: 120,
      location: { lat: 35.6785, lng: 139.6823 },
      type: 'experience',
      ticketUrl: 'https://example.com/sushi-class',
      image: '/src/assets/tokyo-food-tour.jpg',
      rating: 4.9,
      category: 'culinary',
      cityId: 'tokyo'
    },
    {
      id: 'tokyo-robot-restaurant',
      name: 'Robot Restaurant Show',
      description: 'Futuristic dinner show with robots and neon lights',
      duration: '2 hours',
      price: 80,
      location: { lat: 35.6938, lng: 139.7034 },
      type: 'activity',
      ticketUrl: 'https://example.com/robot-restaurant',
      image: '/src/assets/tokyo-tech-scene.jpg',
      rating: 4.5,
      category: 'nightlife',
      cityId: 'tokyo'
    }
  ],
  'new-york': [
    {
      id: 'nyc-statue-liberty',
      name: 'Statue of Liberty & Ellis Island',
      description: 'Iconic symbols of freedom with ferry ride and museum access',
      duration: '4 hours',
      price: 45,
      location: { lat: 40.6892, lng: -74.0445 },
      type: 'attraction',
      ticketUrl: 'https://example.com/statue-liberty',
      image: '/placeholder-statue-liberty.jpg',
      rating: 4.7,
      category: 'cultural',
      cityId: 'new-york'
    },
    {
      id: 'nyc-central-park',
      name: 'Central Park Walking Tour',
      description: 'Explore the heart of Manhattan with a local guide',
      duration: '2.5 hours',
      price: 35,
      location: { lat: 40.7829, lng: -73.9654 },
      type: 'activity',
      ticketUrl: 'https://example.com/central-park',
      image: '/placeholder-central-park.jpg',
      rating: 4.6,
      category: 'adventure',
      cityId: 'new-york'
    },
    {
      id: 'nyc-food-tour',
      name: 'Brooklyn Food Tour',
      description: 'Taste authentic NYC foods from pizza to bagels',
      duration: '3.5 hours',
      price: 75,
      location: { lat: 40.6782, lng: -73.9442 },
      type: 'activity',
      ticketUrl: 'https://example.com/brooklyn-food',
      image: '/placeholder-brooklyn-food.jpg',
      rating: 4.8,
      category: 'culinary',
      cityId: 'new-york'
    },
    {
      id: 'nyc-broadway-show',
      name: 'Broadway Show Experience',
      description: 'World-class theater performance in the Theater District',
      duration: '3 hours',
      price: 150,
      location: { lat: 40.7589, lng: -73.9851 },
      type: 'experience',
      ticketUrl: 'https://example.com/broadway',
      image: '/placeholder-broadway.jpg',
      rating: 4.9,
      category: 'arts',
      cityId: 'new-york'
    },
    {
      id: 'nyc-rooftop-bar',
      name: 'Rooftop Bar Experience',
      description: 'Sunset drinks with Manhattan skyline views',
      duration: '2 hours',
      price: 60,
      location: { lat: 40.7484, lng: -73.9857 },
      type: 'activity',
      ticketUrl: 'https://example.com/rooftop-bar',
      image: '/placeholder-rooftop.jpg',
      rating: 4.5,
      category: 'nightlife',
      cityId: 'new-york'
    },
    {
      id: 'nyc-museum-modern-art',
      name: 'Museum of Modern Art Tour',
      description: 'Guided tour of world-famous modern art collection',
      duration: '2.5 hours',
      price: 55,
      location: { lat: 40.7614, lng: -73.9776 },
      type: 'attraction',
      ticketUrl: 'https://example.com/moma',
      image: '/placeholder-moma.jpg',
      rating: 4.7,
      category: 'arts',
      cityId: 'new-york'
    }
  ],
  mumbai: [
    {
      id: 'mumbai-bollywood',
      name: 'Bollywood Studio Tour',
      description: 'Behind-the-scenes look at Indian film industry',
      duration: '4 hours',
      price: 50,
      location: { lat: 19.0760, lng: 72.8777 },
      type: 'experience',
      ticketUrl: 'https://example.com/bollywood',
      image: '/src/assets/mumbai-film-scene.jpg',
      rating: 4.6,
      category: 'cultural',
      cityId: 'mumbai'
    },
    {
      id: 'mumbai-street-food',
      name: 'Mumbai Street Food Trail',
      description: 'Taste authentic local street food across the city',
      duration: '3 hours',
      price: 40,
      location: { lat: 19.0176, lng: 72.8562 },
      type: 'activity',
      ticketUrl: 'https://example.com/mumbai-food',
      image: '/placeholder-mumbai-food.jpg',
      rating: 4.8,
      category: 'culinary',
      cityId: 'mumbai'
    },
    {
      id: 'mumbai-photography',
      name: 'Photography Tour',
      description: 'Capture Mumbai\'s essence with professional guidance',
      duration: '5 hours',
      price: 70,
      location: { lat: 18.9220, lng: 72.8347 },
      type: 'activity',
      ticketUrl: 'https://example.com/mumbai-photo',
      image: '/src/assets/mumbai-photography-tour.jpg',
      rating: 4.7,
      category: 'arts',
      cityId: 'mumbai'
    }
  ]
};

export const getCityActivities = (cityName: string): Activity[] => {
  const cityKey = cityName.toLowerCase().replace(/\s+/g, '-');
  return cityActivities[cityKey] || [];
};

export const getActivitiesByCategory = (cityName: string, categoryId: string): Activity[] => {
  const activities = getCityActivities(cityName);
  return activities.filter(activity => activity.category === categoryId);
};