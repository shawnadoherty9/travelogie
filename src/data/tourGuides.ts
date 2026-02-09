import { resolveAvatar } from "./tourGuideAvatars";

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
  {
    id: 'tokyo-guide4',
    name: 'Yuki Sato',
    avatar: '/src/assets/zhang-mei-profile.jpg',
    rating: 4.7,
    reviews: 178,
    specialties: ['Anime Culture', 'Gaming', 'Pop Culture'],
    dailyRate: 110,
    languages: ['Japanese', 'English', 'Mandarin'],
    experience: '5 years',
    about: 'Otaku culture expert and gaming enthusiast who guides through Tokyo\'s modern pop culture scene.',
    cityId: 'tokyo',
    location: { lat: 35.7020, lng: 139.7753 }
  },
  {
    id: 'tokyo-guide5',
    name: 'Emi Watanabe',
    avatar: '/src/assets/li-wei-profile.jpg',
    rating: 4.9,
    reviews: 142,
    specialties: ['Fashion Districts', 'Shopping', 'Youth Culture'],
    dailyRate: 105,
    languages: ['Japanese', 'English'],
    experience: '4 years',
    about: 'Fashion designer and trendsetter showing visitors Tokyo\'s cutting-edge fashion scene.',
    cityId: 'tokyo',
    location: { lat: 35.6688, lng: 139.7026 }
  },

  // New York City Guides
  {
    id: 'nyc-guide1',
    name: 'Amara Johnson',
    avatar: '/src/assets/amara-johnson-profile.jpg',
    rating: 4.9,
    reviews: 284,
    specialties: ['Harlem Heritage', 'Jazz History', 'Cultural Districts'],
    dailyRate: 155,
    languages: ['English', 'French'],
    experience: '8 years',
    about: 'Harlem-born cultural historian and jazz enthusiast sharing the rich African American heritage and artistic legacy of New York City.',
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
  {
    id: 'nyc-guide4',
    name: 'Jennifer Williams',
    avatar: '/src/assets/sarah-johnson-profile.jpg',
    rating: 4.8,
    reviews: 267,
    specialties: ['Wall Street', 'Financial District', 'Business Tours'],
    dailyRate: 160,
    languages: ['English', 'French'],
    experience: '9 years',
    about: 'Former Wall Street trader turned guide, offering insider perspectives on NYC\'s financial heart.',
    cityId: 'new-york',
    location: { lat: 40.7074, lng: -74.0113 }
  },
  {
    id: 'nyc-guide5',
    name: 'Michael O\'Connor',
    avatar: '/src/assets/bruno-silva-profile.jpg',
    rating: 4.6,
    reviews: 198,
    specialties: ['Brooklyn Tours', 'Craft Beer', 'Local Neighborhoods'],
    dailyRate: 120,
    languages: ['English'],
    experience: '6 years',
    about: 'Brooklyn native and craft beer enthusiast showing the authentic local side of New York.',
    cityId: 'new-york',
    location: { lat: 40.6782, lng: -73.9442 }
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
  },

  // Delhi Guides
  {
    id: 'delhi-guide1',
    name: 'Arjun Singh',
    avatar: '/src/assets/omar-al-rashid-profile.jpg',
    rating: 4.9,
    reviews: 245,
    specialties: ['Mughal History', 'Red Fort', 'Historical Monuments'],
    dailyRate: 85,
    languages: ['Hindi', 'English', 'Urdu'],
    experience: '10 years',
    about: 'Historian specializing in Mughal empire and Delhi\'s rich historical heritage.',
    cityId: 'delhi',
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 'delhi-guide2',
    name: 'Meera Gupta',
    avatar: '/src/assets/marie-dubois-profile.jpg',
    rating: 4.7,
    reviews: 189,
    specialties: ['Street Food', 'Old Delhi', 'Spice Markets'],
    dailyRate: 75,
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: '6 years',
    about: 'Food blogger and spice expert who knows every corner of Delhi\'s culinary landscape.',
    cityId: 'delhi',
    location: { lat: 28.6562, lng: 77.2410 }
  },

  // Varanasi Guides
  {
    id: 'varanasi-guide1',
    name: 'Pandit Ramesh Tiwari',
    avatar: '/src/assets/dara-vicheka-profile.jpg',
    rating: 5.0,
    reviews: 178,
    specialties: ['Spiritual Tours', 'Ganga Aarti', 'Ancient Temples'],
    dailyRate: 65,
    languages: ['Hindi', 'English', 'Sanskrit'],
    experience: '15 years',
    about: 'Spiritual guide and Sanskrit scholar offering deep insights into Varanasi\'s sacred traditions.',
    cityId: 'varanasi',
    location: { lat: 25.3176, lng: 82.9739 }
  },

  // Kyoto Guides
  {
    id: 'kyoto-guide1',
    name: 'Takeshi Yamamoto',
    avatar: '/src/assets/takeshi-yamamoto-profile.jpg',
    rating: 4.9,
    reviews: 156,
    specialties: ['Tea Ceremony', 'Zen Gardens', 'Traditional Architecture'],
    dailyRate: 130,
    languages: ['Japanese', 'English'],
    experience: '12 years',
    about: 'Tea ceremony master and zen practitioner sharing Kyoto\'s spiritual and cultural essence.',
    cityId: 'kyoto',
    location: { lat: 35.0116, lng: 135.7681 }
  },
  {
    id: 'kyoto-guide2',
    name: 'Sachiko Kimura',
    avatar: '/src/assets/sophea-chann-profile.jpg',
    rating: 4.8,
    reviews: 203,
    specialties: ['Geisha Districts', 'Kimono Culture', 'Traditional Crafts'],
    dailyRate: 125,
    languages: ['Japanese', 'English'],
    experience: '8 years',
    about: 'Former geisha apprentice sharing authentic insights into Kyoto\'s traditional culture.',
    cityId: 'kyoto',
    location: { lat: 35.0037, lng: 135.7751 }
  },

  // Osaka Guides
  {
    id: 'osaka-guide1',
    name: 'Daichi Okamoto',
    avatar: '/src/assets/somchai-pongpat-profile.jpg',
    rating: 4.7,
    reviews: 189,
    specialties: ['Street Food', 'Takoyaki Tours', 'Comedy Culture'],
    dailyRate: 100,
    languages: ['Japanese', 'English'],
    experience: '5 years',
    about: 'Comedy performer and food enthusiast showcasing Osaka\'s fun-loving culture and cuisine.',
    cityId: 'osaka',
    location: { lat: 34.6937, lng: 135.5023 }
  },

  // Bali Guides
  {
    id: 'bali-guide1',
    name: 'Made Wirawan',
    avatar: '/src/assets/carlos-mendez-profile.jpg',
    rating: 4.9,
    reviews: 234,
    specialties: ['Hindu Temples', 'Rice Terraces', 'Balinese Culture'],
    dailyRate: 60,
    languages: ['Indonesian', 'English', 'Balinese'],
    experience: '8 years',
    about: 'Local Balinese guide passionate about sharing island traditions and spiritual practices.',
    cityId: 'bali',
    location: { lat: -8.3405, lng: 115.0920 }
  },
  {
    id: 'bali-guide2',
    name: 'Kadek Surya',
    avatar: '/src/assets/ploy-siriwan-profile.jpg',
    rating: 4.8,
    reviews: 167,
    specialties: ['Surfing', 'Beach Culture', 'Island Adventures'],
    dailyRate: 70,
    languages: ['Indonesian', 'English', 'Japanese'],
    experience: '6 years',
    about: 'Professional surfer and adventure guide showing visitors Bali\'s best beaches and surf spots.',
    cityId: 'bali',
    location: { lat: -8.6500, lng: 115.1378 }
  },
  {
    id: 'bali-guide3',
    name: 'Ni Luh Sari',
    avatar: '/src/assets/fatima-al-zahra-profile.jpg',
    rating: 4.7,
    reviews: 145,
    specialties: ['Cooking Classes', 'Traditional Dance', 'Local Markets'],
    dailyRate: 55,
    languages: ['Indonesian', 'English'],
    experience: '4 years',
    about: 'Traditional dancer and cook sharing authentic Balinese cuisine and cultural performances.',
    cityId: 'bali',
    location: { lat: -8.5069, lng: 115.2625 }
  },
  {
    id: 'bali-guide4',
    name: 'Wayan Ketut',
    avatar: '/src/assets/carlos-rodriguez-profile.jpg',
    rating: 4.6,
    reviews: 198,
    specialties: ['Yoga Retreats', 'Wellness Tours', 'Healing Practices'],
    dailyRate: 65,
    languages: ['Indonesian', 'English', 'Dutch'],
    experience: '7 years',
    about: 'Certified yoga instructor and wellness coach offering holistic Bali experiences.',
    cityId: 'bali',
    location: { lat: -8.4095, lng: 115.1889 }
  },

  // Ubud, Bali Guides
  {
    id: 'ubud-guide1',
    name: 'Gede Alit',
    avatar: '/src/assets/jean-pierre-laurent-profile.jpg',
    rating: 5.0,
    reviews: 156,
    specialties: ['Art Villages', 'Wood Carving', 'Silver Crafts'],
    dailyRate: 75,
    languages: ['Indonesian', 'English'],
    experience: '9 years',
    about: 'Master wood carver from traditional artisan family, showcasing Ubud\'s artistic heritage.',
    cityId: 'ubud',
    location: { lat: -8.5069, lng: 115.2625 }
  },

  // Bangkok Guides
  {
    id: 'bangkok-guide1',
    name: 'Somchai Pongpat',
    avatar: '/src/assets/somchai-pongpat-profile.jpg',
    rating: 4.9,
    reviews: 267,
    specialties: ['Temple Tours', 'Royal Palaces', 'Buddhist Culture'],
    dailyRate: 65,
    languages: ['Thai', 'English', 'Mandarin'],
    experience: '10 years',
    about: 'Former monk turned cultural guide, offering deep insights into Thai Buddhist traditions and royal heritage.',
    cityId: 'bangkok',
    location: { lat: 13.7563, lng: 100.5018 }
  },
  {
    id: 'bangkok-guide2',
    name: 'Ploy Siriwan',
    avatar: '/src/assets/ploy-siriwan-profile.jpg',
    rating: 4.8,
    reviews: 198,
    specialties: ['Street Food', 'Floating Markets', 'Local Markets'],
    dailyRate: 55,
    languages: ['Thai', 'English', 'Japanese'],
    experience: '6 years',
    about: 'Food blogger and market expert who knows every hidden gem in Bangkok\'s incredible street food scene.',
    cityId: 'bangkok',
    location: { lat: 13.7540, lng: 100.5014 }
  },
  {
    id: 'bangkok-guide3',
    name: 'Niran Thanakit',
    avatar: '/src/assets/dara-vicheka-profile.jpg',
    rating: 4.7,
    reviews: 189,
    specialties: ['Muay Thai', 'Boxing Stadiums', 'Sports Culture'],
    dailyRate: 70,
    languages: ['Thai', 'English'],
    experience: '8 years',
    about: 'Former professional Muay Thai fighter sharing the authentic world of Thai boxing and sports culture.',
    cityId: 'bangkok',
    location: { lat: 13.7469, lng: 100.5346 }
  },
  {
    id: 'bangkok-guide4',
    name: 'Apinya Chaiwong',
    avatar: '/src/assets/giulia-ferrari-profile.jpg',
    rating: 4.9,
    reviews: 234,
    specialties: ['Thai Massage', 'Wellness Retreats', 'Traditional Medicine'],
    dailyRate: 60,
    languages: ['Thai', 'English', 'German'],
    experience: '7 years',
    about: 'Certified traditional Thai massage therapist and wellness expert offering authentic healing experiences.',
    cityId: 'bangkok',
    location: { lat: 13.7308, lng: 100.5418 }
  },

  // Chiang Mai Guides
  {
    id: 'chiang-mai-guide1',
    name: 'Kamon Lertkasemsuk',
    avatar: '/src/assets/marco-rossi-profile.jpg',
    rating: 4.8,
    reviews: 156,
    specialties: ['Hill Tribes', 'Elephant Sanctuaries', 'Mountain Adventures'],
    dailyRate: 75,
    languages: ['Thai', 'English', 'Karen'],
    experience: '9 years',
    about: 'Mountain guide and tribal culture expert offering ethical elephant experiences and hill tribe visits.',
    cityId: 'chiang-mai',
    location: { lat: 18.7883, lng: 98.9853 }
  },
  {
    id: 'chiang-mai-guide2',
    name: 'Siriporn Wongsawat',
    avatar: '/src/assets/amara-okafor-profile.jpg',
    rating: 4.9,
    reviews: 203,
    specialties: ['Cooking Classes', 'Night Markets', 'Local Crafts'],
    dailyRate: 65,
    languages: ['Thai', 'English', 'French'],
    experience: '5 years',
    about: 'Professional chef and artisan showcasing northern Thai cuisine and traditional handicrafts.',
    cityId: 'chiang-mai',
    location: { lat: 18.7961, lng: 98.9668 }
  },
  {
    id: 'chiang-mai-guide3',
    name: 'Thanawat Jaikla',
    avatar: '/src/assets/carlos-mendez-profile.jpg',
    rating: 4.7,
    reviews: 145,
    specialties: ['Temple Art', 'Lanna Culture', 'Traditional Architecture'],
    dailyRate: 70,
    languages: ['Thai', 'English'],
    experience: '12 years',
    about: 'Art historian specializing in Lanna kingdom heritage and northern Thai temple architecture.',
    cityId: 'chiang-mai',
    location: { lat: 18.7912, lng: 98.9817 }
  },

  // Phuket Guides
  {
    id: 'phuket-guide1',
    name: 'Natthawut Saengthong',
    avatar: '/src/assets/bruno-silva-profile.jpg',
    rating: 4.6,
    reviews: 187,
    specialties: ['Island Hopping', 'Diving', 'Marine Life'],
    dailyRate: 80,
    languages: ['Thai', 'English', 'Russian'],
    experience: '7 years',
    about: 'Professional dive master and marine biologist offering underwater adventures and island exploration.',
    cityId: 'phuket',
    location: { lat: 7.8804, lng: 98.3923 }
  },
  {
    id: 'phuket-guide2',
    name: 'Malee Boonsiri',
    avatar: '/src/assets/sarah-goldberg-profile.jpg',
    rating: 4.8,
    reviews: 234,
    specialties: ['Beach Culture', 'Sunset Tours', 'Local Seafood'],
    dailyRate: 70,
    languages: ['Thai', 'English', 'Swedish'],
    experience: '6 years',
    about: 'Local beach expert and seafood connoisseur sharing Phuket\'s best coastal experiences.',
    cityId: 'phuket',
    location: { lat: 7.9519, lng: 98.3381 }
  },

  // Krabi Guides
  {
    id: 'krabi-guide1',
    name: 'Chalerm Promthep',
    avatar: '/src/assets/li-wei-profile.jpg',
    rating: 4.9,
    reviews: 178,
    specialties: ['Rock Climbing', 'Limestone Karsts', 'Adventure Sports'],
    dailyRate: 85,
    languages: ['Thai', 'English', 'Japanese'],
    experience: '8 years',
    about: 'Professional rock climbing instructor and adventure guide exploring Krabi\'s stunning limestone formations.',
    cityId: 'krabi',
    location: { lat: 8.0863, lng: 98.9063 }
  },

  // Ayutthaya Guides
  {
    id: 'ayutthaya-guide1',
    name: 'Preecha Thongsuk',
    avatar: '/src/assets/zhang-mei-profile.jpg',
    rating: 4.8,
    reviews: 156,
    specialties: ['Ancient Ruins', 'Siamese History', 'Archaeological Sites'],
    dailyRate: 60,
    languages: ['Thai', 'English'],
    experience: '11 years',
    about: 'Archaeologist and historian specializing in the ancient Siamese capital and UNESCO World Heritage sites.',
    cityId: 'ayutthaya',
    location: { lat: 14.3532, lng: 100.5648 }
  }
];

export const getTourGuidesByCity = (cityId: string): TourGuide[] => {
  return tourGuides
    .filter(guide => guide.cityId.toLowerCase() === cityId.toLowerCase())
    .map(guide => ({ ...guide, avatar: resolveAvatar(guide.avatar) }));
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

export const getAllTourGuidesResolved = (): TourGuide[] => {
  return tourGuides.map(guide => ({ ...guide, avatar: resolveAvatar(guide.avatar) }));
};