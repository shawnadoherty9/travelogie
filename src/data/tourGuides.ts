export interface TourGuide {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
  dailyRate: number;
  languages: string[];
  experience: string;
  about: string;
  cityId: string;
  location: {
    lat: number;
    lng: number;
  };
}

export const tourGuides: TourGuide[] = [
  // Tokyo Guides
  {
    id: 'tokyo-guide1',
    name: 'Hiroshi Yamada',
    avatar: '/src/assets/takeshi-yamamoto-profile.jpg',
    rating: 4.9,
    reviews: 156,
    specialties: ['Cultural Heritage', 'Traditional Arts', 'Temple Tours'],
    dailyRate: 120,
    languages: ['Japanese', 'English'],
    experience: '8 years',
    about: 'Cultural historian passionate about sharing Tokyo\'s hidden gems and traditional practices.',
    cityId: 'tokyo',
    location: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'tokyo-guide2',
    name: 'Akiko Tanaka',
    avatar: '/src/assets/sakura-tanaka-profile.jpg',
    rating: 4.8,
    reviews: 203,
    specialties: ['Food Culture', 'Local Markets', 'Street Art'],
    dailyRate: 95,
    languages: ['Japanese', 'English', 'Korean'],
    experience: '6 years',
    about: 'Food enthusiast and artist who knows every hidden restaurant and gallery in the city.',
    cityId: 'tokyo',
    location: { lat: 35.6895, lng: 139.6917 }
  },
  {
    id: 'tokyo-guide3',
    name: 'Kenji Nakamura',
    avatar: '/src/assets/yuki-tanaka-profile.jpg',
    rating: 5.0,
    reviews: 89,
    specialties: ['Traditional Crafts', 'Spiritual Sites', 'Photography'],
    dailyRate: 140,
    languages: ['Japanese', 'English'],
    experience: '10 years',
    about: 'Master craftsman and spiritual guide offering deep cultural immersion experiences.',
    cityId: 'tokyo',
    location: { lat: 35.6586, lng: 139.7454 }
  },

  // New York City Guides
  {
    id: 'nyc-guide1',
    name: 'Marcus Johnson',
    avatar: '/src/assets/james-wilson-profile.jpg',
    rating: 4.8,
    reviews: 234,
    specialties: ['Broadway Shows', 'Jazz History', 'Neighborhoods'],
    dailyRate: 150,
    languages: ['English', 'Spanish'],
    experience: '7 years',
    about: 'Born and raised New Yorker with deep knowledge of the city\'s music scene and cultural history.',
    cityId: 'new-york',
    location: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: 'nyc-guide2',
    name: 'Sofia Rodriguez',
    avatar: '/src/assets/isabella-garcia-profile.jpg',
    rating: 4.9,
    reviews: 189,
    specialties: ['Food Tours', 'Immigration Stories', 'Hidden Gems'],
    dailyRate: 130,
    languages: ['English', 'Spanish', 'Italian'],
    experience: '5 years',
    about: 'Third-generation New Yorker passionate about the city\'s diverse food culture and immigrant communities.',
    cityId: 'new-york',
    location: { lat: 40.7505, lng: -73.9934 }
  },
  {
    id: 'nyc-guide3',
    name: 'David Chen',
    avatar: '/src/assets/david-cohen-profile.jpg',
    rating: 4.7,
    reviews: 156,
    specialties: ['Art Galleries', 'Architecture', 'Street Art'],
    dailyRate: 125,
    languages: ['English', 'Mandarin'],
    experience: '6 years',
    about: 'Art historian and gallery owner who knows every corner of NYC\'s vibrant art scene.',
    cityId: 'new-york',
    location: { lat: 40.7282, lng: -74.0776 }
  },

  // Mumbai Guides
  {
    id: 'mumbai-guide1',
    name: 'Priya Sharma',
    avatar: '/src/assets/priya-sharma-profile.jpg',
    rating: 4.8,
    reviews: 167,
    specialties: ['Bollywood Tours', 'Street Food', 'Markets'],
    dailyRate: 80,
    languages: ['Hindi', 'English', 'Marathi'],
    experience: '4 years',
    about: 'Bollywood insider and food enthusiast who grew up in Mumbai\'s film district.',
    cityId: 'mumbai',
    location: { lat: 19.0760, lng: 72.8777 }
  },
  {
    id: 'mumbai-guide2',
    name: 'Raj Patel',
    avatar: '/src/assets/raj-patel-profile.jpg',
    rating: 4.9,
    reviews: 203,
    specialties: ['Colonial History', 'Architecture', 'Spiritual Sites'],
    dailyRate: 75,
    languages: ['Hindi', 'English', 'Gujarati'],
    experience: '8 years',
    about: 'History professor turned tour guide, specializing in Mumbai\'s colonial heritage and spiritual traditions.',
    cityId: 'mumbai',
    location: { lat: 18.9220, lng: 72.8347 }
  },
  {
    id: 'mumbai-guide3',
    name: 'Maya Patel',
    avatar: '/src/assets/maya-patel-profile.jpg',
    rating: 4.6,
    reviews: 134,
    specialties: ['Textile Tours', 'Local Crafts', 'Women\'s Stories'],
    dailyRate: 70,
    languages: ['Hindi', 'English'],
    experience: '5 years',
    about: 'Textile designer and women\'s rights advocate showcasing Mumbai\'s rich craft traditions.',
    cityId: 'mumbai',
    location: { lat: 19.0176, lng: 72.8562 }
  }
];

export const getTourGuidesByCity = (cityId: string): TourGuide[] => {
  return tourGuides.filter(guide => guide.cityId.toLowerCase() === cityId.toLowerCase());
};

export const getTourGuidesBySpecialty = (cityId: string, specialties: string[]): TourGuide[] => {
  const cityGuides = getTourGuidesByCity(cityId);
  return cityGuides.filter(guide => 
    guide.specialties.some(specialty => 
      specialties.some(requestedSpecialty => 
        specialty.toLowerCase().includes(requestedSpecialty.toLowerCase()) ||
        requestedSpecialty.toLowerCase().includes(specialty.toLowerCase())
      )
    )
  );
};