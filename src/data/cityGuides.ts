export interface Attraction {
  name: string;
  description: string;
  location: string;
  hours: string;
  cost: string;
  tips: string;
}

export interface DayTrip {
  name: string;
  description: string;
  distance: string;
  duration: string;
  cost: string;
  highlights: string[];
}

export interface Transportation {
  type: string;
  description: string;
  cost: string;
  tips: string;
}

export interface Festival {
  name: string;
  month: string;
  description: string;
  duration: string;
}

export interface CityGuideData {
  cityName: string;
  country: string;
  heroImage: string;
  history: {
    overview: string;
    periods: { era: string; description: string }[];
  };
  attractions: Attraction[];
  dayTrips: DayTrip[];
  transportation: Transportation[];
  airport: {
    name: string;
    code: string;
    description: string;
    distance: string;
    transportOptions: string[];
  };
  currency: {
    name: string;
    code: string;
    symbol: string;
    denominations: string[];
    exchangeTips: string[];
  };
  climate: {
    overview: string;
    seasons: { season: string; temperature: string; description: string }[];
    rainfall: string;
    clothing: string[];
  };
  festivals: Festival[];
}

export const cityGuides: Record<string, CityGuideData> = {
  varanasi: {
    cityName: "Varanasi",
    country: "India",
    heroImage: "/src/assets/varanasi-destination.jpg",
    history: {
      overview: "Varanasi, also known as Benares or Kashi, is one of the oldest continuously inhabited cities in the world, dating back to around 1800 BCE. It holds immense religious significance for Hindus, Buddhists, and Jains.",
      periods: [
        { era: "Ancient Period (1800-600 BCE)", description: "Founded by the Vedic tribe of Kashi, becoming a prominent cultural and religious center." },
        { era: "Buddhist Period (600 BCE-500 CE)", description: "Gained prominence when Buddha delivered his first sermon at nearby Sarnath in 528 BCE." },
        { era: "Gupta Period (320-600 CE)", description: "Experienced a golden age of art, literature, and science under the Gupta Empire." },
        { era: "Medieval Period (600-1500 CE)", description: "Remained an important center of Hindu culture despite periodic invasions." },
        { era: "Modern Era (1500 CE-Present)", description: "Continued as a major pilgrimage destination and cultural center." }
      ]
    },
    attractions: [
      {
        name: "Kashi Vishwanath Temple",
        description: "One of the most sacred Hindu temples dedicated to Lord Shiva",
        location: "Lahori Tola, Varanasi",
        hours: "3:00 AM - 11:00 PM",
        cost: "Free entry",
        tips: "Dress modestly and be prepared for crowds during festivals"
      },
      {
        name: "Dashashwamedh Ghat",
        description: "The main ghat famous for its evening Ganga Aarti ceremony",
        location: "Dashashwamedh Rd, Godowlia",
        hours: "24 hours (Aarti at 7:00 PM)",
        cost: "Free, boat rides ₹50-200",
        tips: "Arrive early for the best viewing spots during Aarti"
      },
      {
        name: "Sarnath",
        description: "Buddhist pilgrimage site where Buddha gave his first sermon",
        location: "10 km from Varanasi city center",
        hours: "Sunrise to sunset",
        cost: "Museum: ₹25 for Indians, ₹300 for foreigners",
        tips: "Visit the museum to see ancient artifacts and sculptures"
      }
    ],
    dayTrips: [
      {
        name: "Allahabad (Prayagraj)",
        description: "Historic city famous for Triveni Sangam and Kumbh Mela",
        distance: "120 km",
        duration: "2.5 hours by car",
        cost: "₹2000-3000 for taxi, ₹200-500 by bus",
        highlights: ["Triveni Sangam", "Allahabad Fort", "Anand Bhavan", "Kumbh Mela grounds"]
      },
      {
        name: "Chunar Fort",
        description: "Ancient 16th-century fort along the Ganges with stunning views",
        distance: "40 km",
        duration: "1.5 hours by car",
        cost: "₹25 entry for Indians, ₹300 for foreigners",
        highlights: ["Ganges views", "Historical architecture", "Sunset photography"]
      }
    ],
    transportation: [
      {
        type: "Auto Rickshaw",
        description: "Three-wheeled vehicles for short to medium distances",
        cost: "₹50-200 depending on distance",
        tips: "Negotiate fare beforehand or insist on using the meter"
      },
      {
        type: "Cycle Rickshaw",
        description: "Traditional pedal-powered vehicles for short distances",
        cost: "₹30-100 for short trips",
        tips: "Best for navigating narrow lanes in old city areas"
      },
      {
        type: "Boat Rides",
        description: "Traditional boats on the Ganges River",
        cost: "₹50-500 depending on duration and type",
        tips: "Best during sunrise or sunset for magical experiences"
      }
    ],
    airport: {
      name: "Lal Bahadur Shastri International Airport",
      code: "VNS",
      description: "Primary airport serving Varanasi with domestic and limited international flights",
      distance: "18 km from city center",
      transportOptions: ["Taxi (₹400-600)", "Prepaid auto-rickshaw (₹300-500)", "Bus (₹50-100)"]
    },
    currency: {
      name: "Indian Rupee",
      code: "INR",
      symbol: "₹",
      denominations: ["₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000 notes", "₹1, ₹2, ₹5, ₹10, ₹20 coins"],
      exchangeTips: ["Use authorized money changers", "ATMs widely available", "Cards accepted in hotels and restaurants"]
    },
    climate: {
      overview: "Hot and humid subtropical climate with extreme summers and mild winters",
      seasons: [
        { season: "Summer (April-June)", temperature: "35-45°C", description: "Very hot and humid, challenging for outdoor activities" },
        { season: "Monsoon (July-September)", temperature: "25-35°C", description: "Heavy rainfall and high humidity" },
        { season: "Winter (October-March)", temperature: "5-25°C", description: "Pleasant and ideal for tourism" }
      ],
      rainfall: "1,100 mm annually, mostly during monsoon",
      clothing: ["Light cotton in summer", "Umbrella during monsoon", "Light woolens in winter", "Modest dress for temples"]
    },
    festivals: [
      { name: "Dev Deepawali", month: "November", description: "Festival of lights celebrated on Kartik Purnima", duration: "1 day" },
      { name: "Mahashivratri", month: "February/March", description: "Major festival dedicated to Lord Shiva", duration: "1 day" },
      { name: "Ganga Aarti", month: "Daily", description: "Evening prayer ceremony at Dashashwamedh Ghat", duration: "Daily at 7 PM" },
      { name: "Buddha Purnima", month: "May", description: "Celebration of Buddha's birth at Sarnath", duration: "1 day" }
    ]
  },
  tokyo: {
    cityName: "Tokyo",
    country: "Japan",
    heroImage: "/src/assets/tokyo-destination.jpg",
    history: {
      overview: "Tokyo, originally called Edo, has been Japan's capital since 1868. It transformed from a small fishing village to one of the world's largest metropolitan areas, blending ancient traditions with cutting-edge modernity.",
      periods: [
        { era: "Edo Period (1603-1868)", description: "Established as the seat of the Tokugawa shogunate, growing into Japan's largest city." },
        { era: "Meiji Restoration (1868)", description: "Renamed Tokyo ('Eastern Capital') and became the imperial capital." },
        { era: "Modern Era (1868-1945)", description: "Rapid westernization and industrialization, interrupted by the Great Kanto Earthquake (1923) and WWII bombings." },
        { era: "Post-War Boom (1945-1990)", description: "Remarkable reconstruction and economic growth, hosting the 1964 Olympics." },
        { era: "Contemporary Tokyo (1990-Present)", description: "Global financial center and technological hub, hosting 2020 Olympics." }
      ]
    },
    attractions: [
      {
        name: "Senso-ji Temple",
        description: "Tokyo's oldest Buddhist temple in the historic Asakusa district",
        location: "Asakusa, Taito City",
        hours: "6:00 AM - 5:00 PM",
        cost: "Free entry",
        tips: "Visit early morning to avoid crowds and experience morning prayers"
      },
      {
        name: "Tokyo Skytree",
        description: "World's second-tallest structure offering panoramic city views",
        location: "Sumida City",
        hours: "8:00 AM - 10:00 PM",
        cost: "¥2,100-3,400 depending on deck level",
        tips: "Book online for discounts and skip-the-line access"
      },
      {
        name: "Meiji Shrine",
        description: "Shinto shrine dedicated to Emperor Meiji and Empress Shoken",
        location: "Shibuya City",
        hours: "5:00 AM - 6:00 PM (varies by season)",
        cost: "Free entry",
        tips: "Combine with a visit to nearby Harajuku and Omotesando"
      }
    ],
    dayTrips: [
      {
        name: "Mount Fuji & Hakone",
        description: "Japan's iconic mountain and hot spring resort area",
        distance: "100 km",
        duration: "2 hours by train",
        cost: "¥5,000-8,000 for transportation",
        highlights: ["Mount Fuji views", "Lake Ashi", "Hakone Hot Springs", "Owakudani Valley"]
      },
      {
        name: "Nikko",
        description: "UNESCO World Heritage site with shrines and natural beauty",
        distance: "150 km",
        duration: "2 hours by train",
        cost: "¥2,800-4,000 for transportation",
        highlights: ["Toshogu Shrine", "Kegon Falls", "Lake Chuzenji", "Traditional ryokan"]
      }
    ],
    transportation: [
      {
        type: "JR Yamanote Line",
        description: "Circular train line connecting major stations in Tokyo",
        cost: "¥160-320 per trip",
        tips: "Get a JR Pass for unlimited travel on JR lines"
      },
      {
        type: "Tokyo Metro",
        description: "Extensive subway network covering the entire city",
        cost: "¥170-320 per trip",
        tips: "Download Tokyo Metro app for navigation and real-time updates"
      },
      {
        type: "Taxi",
        description: "Clean and efficient but expensive option",
        cost: "¥730 starting fare + ¥320 per km",
        tips: "Doors open automatically, no tipping required"
      }
    ],
    airport: {
      name: "Narita International Airport / Haneda Airport",
      code: "NRT / HND",
      description: "Tokyo is served by two major international airports",
      distance: "Narita: 60 km, Haneda: 20 km from city center",
      transportOptions: ["Narita Express (¥3,020)", "Airport Limousine (¥1,000)", "Keisei Skyliner (¥2,520)"]
    },
    currency: {
      name: "Japanese Yen",
      code: "JPY",
      symbol: "¥",
      denominations: ["¥1,000, ¥2,000, ¥5,000, ¥10,000 notes", "¥1, ¥5, ¥10, ¥50, ¥100, ¥500 coins"],
      exchangeTips: ["Cash-based society", "7-Eleven ATMs accept foreign cards", "IC cards for transportation"]
    },
    climate: {
      overview: "Humid subtropical climate with four distinct seasons",
      seasons: [
        { season: "Spring (March-May)", temperature: "15-25°C", description: "Cherry blossom season, mild and pleasant" },
        { season: "Summer (June-August)", temperature: "25-35°C", description: "Hot and humid with rainy season in June-July" },
        { season: "Autumn (September-November)", temperature: "15-25°C", description: "Cool and comfortable with beautiful fall colors" },
        { season: "Winter (December-February)", temperature: "0-10°C", description: "Cold and dry with occasional snow" }
      ],
      rainfall: "1,520 mm annually, concentrated in June-July",
      clothing: ["Light layers in spring/autumn", "Breathable fabrics in summer", "Warm coat in winter", "Umbrella during rainy season"]
    },
    festivals: [
      { name: "Cherry Blossom Festival", month: "March-April", description: "Hanami celebrations throughout the city", duration: "2-3 weeks" },
      { name: "Kanda Festival", month: "May (odd years)", description: "One of Tokyo's three great festivals", duration: "3 days" },
      { name: "Tanabata Festival", month: "July", description: "Star festival with colorful decorations", duration: "1 week" },
      { name: "Autumn Leaves Festival", month: "November", description: "Momiji viewing in parks and temples", duration: "1 month" }
    ]
  },
  mumbai: {
    cityName: "Mumbai",
    country: "India",
    heroImage: "/src/assets/mumbai-destination.jpg",
    history: {
      overview: "Mumbai, formerly known as Bombay, is India's financial capital and the largest city in the country. Originally a collection of seven islands, it has grown into a bustling metropolis that blends colonial heritage with modern Bollywood glamour.",
      periods: [
        { era: "Ancient Period (Before 1348)", description: "Originally inhabited by fishing communities called Kolis." },
        { era: "Portuguese Rule (1534-1661)", description: "Portuguese colonizers named it 'Bom Bahia' (Good Bay)." },
        { era: "British Colonial Era (1661-1947)", description: "British developed it into a major trading port and textile hub." },
        { era: "Independence & Growth (1947-1990)", description: "Became India's commercial capital and Bollywood center." },
        { era: "Modern Mumbai (1990-Present)", description: "Global financial center and technology hub." }
      ]
    },
    attractions: [
      {
        name: "Gateway of India",
        description: "Iconic monument built to commemorate the visit of King George V",
        location: "Apollo Bunder, Colaba",
        hours: "24 hours",
        cost: "Free entry",
        tips: "Best visited in the evening when it's beautifully lit up"
      },
      {
        name: "Marine Drive",
        description: "Famous promenade known as the 'Queen's Necklace'",
        location: "Netaji Subhashchandra Bose Road",
        hours: "24 hours",
        cost: "Free",
        tips: "Visit during sunset for the most spectacular views"
      },
      {
        name: "Dharavi Slum",
        description: "Asia's largest slum, offering insight into local life and industries",
        location: "Dharavi, Mumbai",
        hours: "9:00 AM - 5:00 PM (guided tours)",
        cost: "₹1,000-2,000 for guided tours",
        tips: "Only visit with a reputable tour guide for safety and respect"
      }
    ],
    dayTrips: [
      {
        name: "Elephanta Caves",
        description: "UNESCO World Heritage rock-cut caves dedicated to Lord Shiva",
        distance: "10 km by ferry",
        duration: "1 hour ferry + 3 hours exploration",
        cost: "₹40 ferry + ₹40 entry",
        highlights: ["Ancient sculptures", "Trimurti sculpture", "Island views", "Rock-cut architecture"]
      },
      {
        name: "Lonavala & Khandala",
        description: "Hill stations perfect for nature lovers and monsoon getaways",
        distance: "80 km",
        duration: "2 hours by train",
        cost: "₹100-300 by train",
        highlights: ["Karla Caves", "Bhushi Dam", "Tiger's Leap", "Local chikki sweets"]
      }
    ],
    transportation: [
      {
        type: "Local Trains",
        description: "Lifeline of Mumbai connecting the entire metropolitan area",
        cost: "₹5-50 depending on distance",
        tips: "Avoid rush hours (8-11 AM, 6-9 PM), buy a local pass for multiple journeys"
      },
      {
        type: "Mumbai Metro",
        description: "Modern metro system covering key routes",
        cost: "₹10-60 per trip",
        tips: "Faster than local trains, air-conditioned and comfortable"
      },
      {
        type: "BEST Buses",
        description: "Extensive bus network covering the entire city",
        cost: "₹8-30 per trip",
        tips: "Download the app for real-time tracking and routes"
      }
    ],
    airport: {
      name: "Chhatrapati Shivaji Maharaj International Airport",
      code: "BOM",
      description: "One of India's busiest airports with domestic and international terminals",
      distance: "30 km from city center",
      transportOptions: ["Metro (₹85)", "Taxi (₹500-800)", "Airport bus (₹50)", "Uber/Ola (₹400-600)"]
    },
    currency: {
      name: "Indian Rupee",
      code: "INR",
      symbol: "₹",
      denominations: ["₹10, ₹20, ₹50, ₹100, ₹200, ₹500, ₹2000 notes", "₹1, ₹2, ₹5, ₹10, ₹20 coins"],
      exchangeTips: ["ATMs everywhere", "Cards widely accepted", "Keep cash for street food and local transport"]
    },
    climate: {
      overview: "Tropical climate with distinct wet and dry seasons",
      seasons: [
        { season: "Winter (November-February)", temperature: "15-30°C", description: "Pleasant and ideal for tourism" },
        { season: "Summer (March-May)", temperature: "25-35°C", description: "Hot and humid, but manageable" },
        { season: "Monsoon (June-October)", temperature: "24-30°C", description: "Heavy rainfall, city transforms beautifully" }
      ],
      rainfall: "2,200 mm annually, mostly during monsoon",
      clothing: ["Light cotton clothes", "Umbrella during monsoon", "Comfortable walking shoes", "Breathable fabrics"]
    },
    festivals: [
      { name: "Ganesh Chaturthi", month: "August/September", description: "Massive festival honoring Lord Ganesha", duration: "11 days" },
      { name: "Navratri", month: "September/October", description: "Nine nights of dance and celebration", duration: "9 days" },
      { name: "Mumbai Festival", month: "January", description: "Cultural festival showcasing Mumbai's arts", duration: "1 week" },
      { name: "Kala Ghoda Arts Festival", month: "February", description: "Major arts and culture festival", duration: "10 days" }
    ]
  },
  paris: {
    cityName: "Paris",
    country: "France",
    heroImage: "/src/assets/paris-destination.jpg",
    history: {
      overview: "Paris, the 'City of Light,' has been France's capital for over 1,000 years. From medieval Lutetia to a center of art, fashion, and culture, Paris has shaped world civilization through revolution, artistic movements, and architectural marvels.",
      periods: [
        { era: "Roman Era (52 BC-508 AD)", description: "Founded as Lutetia by the Celtic Parisii tribe, later conquered by Romans." },
        { era: "Medieval Period (508-1500)", description: "Became capital of France, construction of Notre-Dame and the Louvre began." },
        { era: "Renaissance & Classical (1500-1789)", description: "Royal residences built, became center of European culture and learning." },
        { era: "Revolution & Empire (1789-1870)", description: "French Revolution started here, Napoleon's grand urban planning." },
        { era: "Modern Paris (1870-Present)", description: "Haussmann's renovation, Belle Époque, artistic capital of the world." }
      ]
    },
    attractions: [
      {
        name: "Eiffel Tower",
        description: "Iconic iron lattice tower and symbol of Paris",
        location: "Champ de Mars, 7th arrondissement",
        hours: "9:30 AM - 11:45 PM",
        cost: "€29.40 for top level, €18.60 for 2nd level",
        tips: "Book online to skip lines, visit at sunset for magical views"
      },
      {
        name: "Louvre Museum",
        description: "World's largest art museum housing the Mona Lisa",
        location: "Rue de Rivoli, 1st arrondissement",
        hours: "9:00 AM - 6:00 PM (closed Tuesdays)",
        cost: "€17, free for EU residents under 26",
        tips: "Book timed entry tickets, focus on specific wings to avoid overwhelm"
      },
      {
        name: "Notre-Dame Cathedral",
        description: "Gothic masterpiece currently under restoration",
        location: "Île de la Cité, 4th arrondissement",
        hours: "Currently closed for restoration",
        cost: "Free (when reopened)",
        tips: "Visit Sainte-Chapelle nearby for stunning stained glass"
      }
    ],
    dayTrips: [
      {
        name: "Palace of Versailles",
        description: "Opulent royal palace with magnificent gardens",
        distance: "20 km",
        duration: "1 hour by RER C train",
        cost: "€27 palace + gardens, €7.30 train ticket",
        highlights: ["Hall of Mirrors", "Royal Apartments", "Gardens", "Marie Antoinette's Estate"]
      },
      {
        name: "Château de Fontainebleau",
        description: "Historic royal residence surrounded by beautiful forest",
        distance: "55 km",
        duration: "1 hour by train",
        cost: "€14 palace entry, €9.75 train ticket",
        highlights: ["Napoleon's apartments", "Renaissance architecture", "Forest walks", "Chinese Museum"]
      }
    ],
    transportation: [
      {
        type: "Metro",
        description: "Extensive subway system covering all of Paris",
        cost: "€2.15 per trip, €16.90 for 10-trip carnet",
        tips: "Buy weekly Navigo pass for €30, validate tickets before boarding"
      },
      {
        type: "Bus",
        description: "Comprehensive bus network with scenic routes",
        cost: "€2.15 per trip",
        tips: "Line 29 offers great sightseeing, night buses run until 2 AM"
      },
      {
        type: "Vélib'",
        description: "City bike-sharing system with 1,800 stations",
        cost: "€8.30 for day pass",
        tips: "Perfect for short trips, first 30 minutes free with subscription"
      }
    ],
    airport: {
      name: "Charles de Gaulle Airport / Orly Airport",
      code: "CDG / ORY",
      description: "Two major airports serving Paris and international destinations",
      distance: "CDG: 35 km, Orly: 20 km from city center",
      transportOptions: ["RER B train (€11.40)", "Roissybus (€16.20)", "Taxi (€55-70)", "Uber (€35-55)"]
    },
    currency: {
      name: "Euro",
      code: "EUR",
      symbol: "€",
      denominations: ["€5, €10, €20, €50, €100, €200, €500 notes", "1c, 2c, 5c, 10c, 20c, 50c, €1, €2 coins"],
      exchangeTips: ["ATMs widely available", "Cards accepted everywhere", "Tipping 10% appreciated but not mandatory"]
    },
    climate: {
      overview: "Temperate oceanic climate with mild temperatures year-round",
      seasons: [
        { season: "Spring (March-May)", temperature: "10-20°C", description: "Perfect weather, blooming gardens and trees" },
        { season: "Summer (June-August)", temperature: "15-25°C", description: "Warm and pleasant, peak tourist season" },
        { season: "Autumn (September-November)", temperature: "8-18°C", description: "Beautiful fall colors, fewer crowds" },
        { season: "Winter (December-February)", temperature: "3-8°C", description: "Cool and occasionally rainy, festive atmosphere" }
      ],
      rainfall: "650 mm annually, distributed throughout the year",
      clothing: ["Layers for changing weather", "Comfortable walking shoes", "Light jacket year-round", "Umbrella for rain"]
    },
    festivals: [
      { name: "Bastille Day", month: "July", description: "National holiday with fireworks and parades", duration: "1 day" },
      { name: "Nuit Blanche", month: "October", description: "All-night cultural festival with free events", duration: "1 night" },
      { name: "Paris Fashion Week", month: "March & September", description: "World's premier fashion event", duration: "1 week each" },
      { name: "Fête de la Musique", month: "June", description: "Free concerts throughout the city", duration: "1 day" }
    ]
  },
  bangkok: {
    cityName: "Bangkok",
    country: "Thailand",
    heroImage: "/src/assets/bangkok-destination.jpg",
    history: {
      overview: "Bangkok, known locally as Krung Thep, has been Thailand's capital since 1782. Built on a network of canals, it transformed from a small trading post into Southeast Asia's most vibrant metropolis, blending ancient Thai culture with modern urban energy.",
      periods: [
        { era: "Early Settlement (15th century)", description: "Started as a small trading post on the Chao Phraya River." },
        { era: "Ayutthaya Period (1351-1767)", description: "Part of the great Siamese kingdom based in nearby Ayutthaya." },
        { era: "Thonburi Period (1767-1782)", description: "Brief capital period across the river from present-day Bangkok." },
        { era: "Rattanakosin Era (1782-1932)", description: "Established as capital by King Rama I, major temple and palace construction." },
        { era: "Modern Bangkok (1932-Present)", description: "Constitutional monarchy era, rapid modernization and urban expansion." }
      ]
    },
    attractions: [
      {
        name: "Grand Palace",
        description: "Former royal residence with stunning Thai architecture and Wat Phra Kaew",
        location: "Na Phra Lan Road, Phra Nakhon",
        hours: "8:30 AM - 3:30 PM",
        cost: "₿500 (includes Wat Phra Kaew)",
        tips: "Dress modestly - cover shoulders and knees, avoid tour touts outside"
      },
      {
        name: "Wat Pho Temple",
        description: "Home to the famous 46-meter reclining Buddha and traditional massage school",
        location: "2 Sanamchai Road, Phra Nakhon",
        hours: "8:00 AM - 6:30 PM",
        cost: "₿200",
        tips: "Stay for a traditional Thai massage, early morning visits are less crowded"
      },
      {
        name: "Chatuchak Weekend Market",
        description: "Massive market with over 15,000 stalls selling everything imaginable",
        location: "Kamphaeng Phet 2 Road, Chatuchak",
        hours: "Saturday-Sunday 9:00 AM - 6:00 PM",
        cost: "Free entry, bring cash for purchases",
        tips: "Go early to beat the heat, negotiate prices, try the amazing street food"
      }
    ],
    dayTrips: [
      {
        name: "Ayutthaya",
        description: "Ancient capital with impressive temple ruins and historical significance",
        distance: "80 km",
        duration: "1.5 hours by train or bus",
        cost: "₿20-100 for transport, ₿220 for historical park pass",
        highlights: ["Wat Mahathat", "Wat Phra Si Sanphet", "Wat Chaiwatthanaram", "Bicycle temple tours"]
      },
      {
        name: "Floating Markets",
        description: "Traditional markets on boats at Damnoen Saduak or Amphawa",
        distance: "100 km to Damnoen Saduak",
        duration: "2 hours by bus + boat",
        cost: "₿150-300 for tour including transport",
        highlights: ["Boat vendors", "Fresh tropical fruits", "Local snacks", "Traditional way of life"]
      }
    ],
    transportation: [
      {
        type: "BTS Skytrain",
        description: "Elevated train system covering central Bangkok",
        cost: "₿16-59 depending on distance",
        tips: "Buy a Rabbit Card for convenience, connects to MRT at several stations"
      },
      {
        type: "MRT Subway",
        description: "Underground metro system connecting major areas",
        cost: "₿17-42 per trip",
        tips: "Air-conditioned and efficient, connects to BTS at interchange stations"
      },
      {
        type: "Tuk-tuk",
        description: "Iconic three-wheeled vehicles for short trips",
        cost: "₿50-200 depending on distance and negotiation",
        tips: "Agree on price before starting, avoid during rush hour traffic"
      }
    ],
    airport: {
      name: "Suvarnabhumi Airport / Don Mueang Airport",
      code: "BKK / DMK",
      description: "Two airports serving Bangkok - BKK for international, DMK for budget airlines",
      distance: "BKK: 30 km, DMK: 25 km from city center",
      transportOptions: ["Airport Rail Link (₿45)", "Airport Bus (₿60)", "Taxi (₿300-500)", "Grab (₿250-400)"]
    },
    currency: {
      name: "Thai Baht",
      code: "THB",
      symbol: "₿",
      denominations: ["₿20, ₿50, ₿100, ₿500, ₿1000 notes", "₿1, ₿2, ₿5, ₿10 coins"],
      exchangeTips: ["Exchange at banks for best rates", "ATMs charge ₿220 fee", "Keep small bills for street vendors"]
    },
    climate: {
      overview: "Tropical climate with three distinct seasons and high humidity year-round",
      seasons: [
        { season: "Cool Season (November-February)", temperature: "20-32°C", description: "Most pleasant time to visit, lower humidity" },
        { season: "Hot Season (March-May)", temperature: "25-40°C", description: "Very hot and humid, seek air-conditioned spaces" },
        { season: "Rainy Season (June-October)", temperature: "24-33°C", description: "High humidity with daily afternoon showers" }
      ],
      rainfall: "1,500 mm annually, concentrated in rainy season",
      clothing: ["Light, breathable fabrics", "Umbrella for rain", "Modest dress for temples", "Comfortable sandals"]
    },
    festivals: [
      { name: "Songkran", month: "April", description: "Thai New Year water festival", duration: "3 days" },
      { name: "Loy Krathong", month: "November", description: "Festival of floating lanterns and banana leaf boats", duration: "1 day" },
      { name: "Royal Ploughing Ceremony", month: "May", description: "Ancient ceremony marking start of rice planting season", duration: "1 day" },
      { name: "Golden Mount Fair", month: "November", description: "Temple fair at Wat Saket with traditional performances", duration: "1 week" }
    ]
  },
  barcelona: {
    cityName: "Barcelona",
    country: "Spain",
    heroImage: "/src/assets/barcelona-destination.jpg",
    history: {
      overview: "Barcelona, the capital of Catalonia, has over 2,000 years of history. From Roman Barcino to a medieval trading powerhouse to a modern cultural capital, it beautifully preserves its past while embracing innovation.",
      periods: [
        { era: "Roman Era (15 BC-5th century)", description: "Founded as Barcino, remnants of Roman walls still visible in Gothic Quarter." },
        { era: "Medieval Period (5th-15th century)", description: "Became a major Mediterranean trading center under the Crown of Aragon." },
        { era: "Industrial Revolution (19th century)", description: "Rapid growth and urban expansion, creation of the Eixample district." },
        { era: "Modernist Era (1888-1936)", description: "Architectural boom featuring Gaudí's masterpieces and Modernist buildings." },
        { era: "Contemporary Barcelona (1975-Present)", description: "Democratic transition, 1992 Olympics transformation, and cultural renaissance." }
      ]
    },
    attractions: [
      {
        name: "Sagrada Família",
        description: "Gaudí's unfinished basilica and UNESCO World Heritage masterpiece",
        location: "Eixample district",
        hours: "9:00 AM - 6:00 PM (varies by season)",
        cost: "€26-36 depending on access level",
        tips: "Book online in advance, audio guide highly recommended"
      },
      {
        name: "Park Güell",
        description: "Whimsical park designed by Gaudí with panoramic city views",
        location: "Gràcia district",
        hours: "8:00 AM - 6:30 PM (varies by season)",
        cost: "€10 for monumental zone, free areas available",
        tips: "Visit early morning or late afternoon for best lighting"
      },
      {
        name: "Gothic Quarter",
        description: "Medieval heart of Barcelona with narrow streets and historic buildings",
        location: "Ciutat Vella",
        hours: "Always accessible",
        cost: "Free to explore",
        tips: "Join a free walking tour to discover hidden history"
      }
    ],
    dayTrips: [
      {
        name: "Montserrat",
        description: "Sacred mountain with monastery and breathtaking rock formations",
        distance: "60 km",
        duration: "1 hour by train + cable car",
        cost: "€22-36 for transportation package",
        highlights: ["Montserrat Monastery", "Black Madonna", "Hiking trails", "Cable car views"]
      },
      {
        name: "Girona",
        description: "Medieval city with well-preserved Jewish Quarter and colorful houses",
        distance: "100 km",
        duration: "1.5 hours by high-speed train",
        cost: "€15-20 for train ticket",
        highlights: ["Game of Thrones filming locations", "Cathedral", "Arab Baths", "River Onyar"]
      }
    ],
    transportation: [
      {
        type: "Metro",
        description: "Efficient subway system covering the entire city",
        cost: "€2.40 per trip, €11.35 for 10-trip card",
        tips: "Buy T-10 card for savings, operates until midnight (2 AM weekends)"
      },
      {
        type: "Bus",
        description: "Extensive bus network complementing metro coverage",
        cost: "€2.40 per trip",
        tips: "Night buses (NitBus) run after metro closes"
      },
      {
        type: "Bicing",
        description: "City bike-sharing system with 400+ stations",
        cost: "€47.16 annual subscription",
        tips: "Great for short trips, download the app for station locations"
      }
    ],
    airport: {
      name: "Barcelona-El Prat Airport",
      code: "BCN",
      description: "Major international gateway located southwest of the city",
      distance: "12 km from city center",
      transportOptions: ["Aerobus (€5.90)", "Metro Line 9 (€4.60)", "Taxi (€30-40)", "Train R2 (€4.60)"]
    },
    currency: {
      name: "Euro",
      code: "EUR",
      symbol: "€",
      denominations: ["€5, €10, €20, €50, €100, €200, €500 notes", "1c, 2c, 5c, 10c, 20c, 50c, €1, €2 coins"],
      exchangeTips: ["ATMs widely available", "Cards accepted almost everywhere", "Small purchases may require cash"]
    },
    climate: {
      overview: "Mediterranean climate with mild winters and warm summers",
      seasons: [
        { season: "Spring (March-May)", temperature: "15-22°C", description: "Perfect weather for sightseeing and outdoor activities" },
        { season: "Summer (June-August)", temperature: "24-28°C", description: "Hot and sunny, ideal for beaches but crowded" },
        { season: "Autumn (September-November)", temperature: "16-23°C", description: "Warm and pleasant with occasional rain" },
        { season: "Winter (December-February)", temperature: "8-16°C", description: "Mild with occasional rain, fewer crowds" }
      ],
      rainfall: "640 mm annually, mostly in autumn",
      clothing: ["Light summer clothes", "Light jacket for evenings", "Comfortable walking shoes", "Swimwear for beaches"]
    },
    festivals: [
      { name: "Sant Jordi", month: "April", description: "Catalonia's patron saint day, books and roses tradition", duration: "1 day" },
      { name: "La Mercè", month: "September", description: "Barcelona's biggest festival with concerts and human towers", duration: "5 days" },
      { name: "Festa Major de Gràcia", month: "August", description: "Neighborhood festival with decorated streets", duration: "1 week" },
      { name: "Primavera Sound", month: "May/June", description: "International music festival", duration: "3 days" }
    ]
  }
};