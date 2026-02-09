import { useState, useMemo, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Users, BookOpen, Trophy, Search, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DragDropLesson } from "@/components/language/DragDropLesson";
import { useLanguageLessons } from "@/hooks/useLanguageLessons";
import { getLessonThumbnail } from "@/data/lessonThumbnails";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useLessonProgress } from "@/hooks/useLessonProgress";

// Import images
import osakaStreetFoodBackground from "@/assets/osaka-street-food-background.jpg";
import languageInstructorsBackground from "@/assets/language-instructors-background.jpg";
import englishHotelLesson from "@/assets/english-hotel-lesson.jpg";
import hindiKumbhMelaLesson from "@/assets/hindi-kumbh-mela-lesson.jpg";
import japaneseStreetFoodLesson from "@/assets/japanese-street-food-lesson.jpg";
import frenchCafeLesson from "@/assets/french-cafe-lesson.jpg";
import spanishDanceLesson from "@/assets/spanish-dance-lesson.jpg";
import thaiMarketLesson from "@/assets/thai-market-lesson.jpg";
import khmerTempleLesson from "@/assets/khmer-temple-lesson.jpg";
import chineseTeaLesson from "@/assets/chinese-tea-lesson.jpg";
import arabicSoukLesson from "@/assets/arabic-souk-lesson.jpg";
import hebrewMarketLesson from "@/assets/hebrew-market-lesson.jpg";
import italianPiazzaLesson from "@/assets/italian-piazza-lesson.jpg";
import portugueseCafeLesson from "@/assets/portuguese-cafe-lesson.jpg";

// Import instructor profile images
import sarahJohnsonProfile from "@/assets/sarah-johnson-profile.jpg";
import jamesWilsonProfile from "@/assets/james-wilson-profile.jpg";
import carlosMendezProfile from "@/assets/carlos-mendez-profile.jpg";
import isabellaGarciaProfile from "@/assets/isabella-garcia-profile.jpg";
import marieDuboisProfile from "@/assets/marie-dubois-profile.jpg";
import jeanPierreLaurentProfile from "@/assets/jean-pierre-laurent-profile.jpg";
import marcoRossiProfile from "@/assets/marco-rossi-profile.jpg";
import giuliaFerrariProfile from "@/assets/giulia-ferrari-profile.jpg";
import anaSantosProfile from "@/assets/ana-santos-profile.jpg";
import brunoSilvaProfile from "@/assets/bruno-silva-profile.jpg";
import takeshiYamamotoProfile from "@/assets/takeshi-yamamoto-profile.jpg";
import sakuraTanakaProfile from "@/assets/sakura-tanaka-profile.jpg";
import liWeiProfile from "@/assets/li-wei-profile.jpg";
import zhangMeiProfile from "@/assets/zhang-mei-profile.jpg";
import ploySiriwanProfile from "@/assets/ploy-siriwan-profile.jpg";
import somchaiPongpatProfile from "@/assets/somchai-pongpat-profile.jpg";
import sopheaChannProfile from "@/assets/sophea-chann-profile.jpg";
import daraVichekaProfile from "@/assets/dara-vicheka-profile.jpg";
import priyaSharmaProfile from "@/assets/priya-sharma-profile.jpg";
import rajPatelProfile from "@/assets/raj-patel-profile.jpg";
import omarAlRashidProfile from "@/assets/omar-al-rashid-profile.jpg";
import fatimaAlZahraProfile from "@/assets/fatima-al-zahra-profile.jpg";
import davidCohenProfile from "@/assets/david-cohen-profile.jpg";
import sarahGoldbergProfile from "@/assets/sarah-goldberg-profile.jpg";

const Languages = () => {
  const { lessons: dbLessons, languages: dbLanguages, isLoading: lessonsLoading } = useLanguageLessons();
  const { completedLessonIds, completeLesson, isAuthenticated } = useLessonProgress();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState<"language" | "level" | "title">("language");

  // Combine DB languages with instructor languages for complete list
  const instructorLanguages = ["English", "Spanish", "French", "Italian", "Portuguese", "Japanese", "Chinese", "Thai", "Khmer", "Hindi", "Arabic", "Hebrew"];
  const languages = [...new Set([...dbLanguages, ...instructorLanguages])].sort();

  const languageInstructors = [
    // English Instructors
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: sarahJohnsonProfile,
      rating: 4.9,
      reviews: 342,
      location: "London, UK",
      languages: ["English"],
      expertise: "Advanced Business English",
      specializations: ["Hotel & Travel English", "Business Communication", "Cultural Etiquette"],
      interests: ["Travel", "Photography", "Cultural Exchange"],
      hourlyRate: "$25-45",
      experience: "8 years",
      verified: true,
      about: "Native English speaker with hospitality background, specializing in practical travel English.",
      studentsCount: 1240,
      availability: "Available today"
    },
    {
      id: 2,
      name: "James Wilson",
      avatar: jamesWilsonProfile,
      rating: 4.8,
      reviews: 298,
      location: "New York, USA",
      languages: ["English"],
      expertise: "American English & Culture",
      specializations: ["Conversational English", "American Idioms", "Business English"],
      interests: ["Sports", "Music", "Technology"],
      hourlyRate: "$30-50",
      experience: "6 years",
      verified: true,
      about: "American English teacher focusing on practical conversation and cultural nuances.",
      studentsCount: 967,
      availability: "Available next 2 hours"
    },
    
    // Spanish Instructors
    {
      id: 3,
      name: "Carlos Mendez",
      avatar: carlosMendezProfile,
      rating: 4.7,
      reviews: 189,
      location: "Barcelona, Spain",
      languages: ["Spanish", "Catalan", "English"],
      expertise: "Spanish Dance & Culture",
      specializations: ["Flamenco Culture", "Dance Vocabulary", "Cultural Expressions"],
      interests: ["Dance", "Music", "History"],
      hourlyRate: "$20-40",
      experience: "7 years",
      verified: true,
      about: "Professional dancer and Spanish teacher integrating language learning with cultural movement.",
      studentsCount: 934,
      availability: "Available next 3 hours"
    },
    {
      id: 4,
      name: "Isabella Garcia",
      avatar: isabellaGarciaProfile,
      rating: 4.9,
      reviews: 234,
      location: "Mexico City, Mexico",
      languages: ["Spanish", "English"],
      expertise: "Mexican Spanish & Traditions",
      specializations: ["Mexican Culture", "Street Spanish", "Cooking Vocabulary"],
      interests: ["Cooking", "Art", "Traditions"],
      hourlyRate: "$18-35",
      experience: "9 years",
      verified: true,
      about: "Mexican Spanish teacher sharing authentic culture through language and culinary traditions.",
      studentsCount: 1456,
      availability: "Available tomorrow"
    },

    // French Instructors
    {
      id: 5,
      name: "Marie Dubois",
      avatar: marieDuboisProfile,
      rating: 4.9,
      reviews: 203,
      location: "Paris, France",
      languages: ["French", "English"],
      expertise: "French Culture & Cuisine",
      specializations: ["Café Culture", "French Cuisine", "Travel French"],
      interests: ["Cooking", "Art", "Literature"],
      hourlyRate: "$35-55",
      experience: "10 years",
      verified: true,
      about: "Parisian chef and language teacher combining French language with culinary traditions.",
      studentsCount: 723,
      availability: "Available tomorrow"
    },
    {
      id: 6,
      name: "Jean-Pierre Laurent",
      avatar: jeanPierreLaurentProfile,
      rating: 4.8,
      reviews: 167,
      location: "Lyon, France",
      languages: ["French", "English"],
      expertise: "Business French",
      specializations: ["Professional French", "Wine Culture", "French Etiquette"],
      interests: ["Wine", "Business", "Travel"],
      hourlyRate: "$40-60",
      experience: "12 years",
      verified: true,
      about: "Business French specialist with expertise in professional communication and French culture.",
      studentsCount: 589,
      availability: "Available in 4 hours"
    },

    // Italian Instructors
    {
      id: 7,
      name: "Marco Rossi",
      avatar: marcoRossiProfile,
      rating: 4.8,
      reviews: 156,
      location: "Rome, Italy",
      languages: ["Italian", "English"],
      expertise: "Italian Culture & Cuisine",
      specializations: ["Food Culture", "Travel Italian", "Art History"],
      interests: ["Cooking", "History", "Art"],
      hourlyRate: "$28-45",
      experience: "8 years",
      verified: true,
      about: "Roman chef and cultural guide teaching Italian through food and ancient history.",
      studentsCount: 812,
      availability: "Available today"
    },
    {
      id: 8,
      name: "Giulia Ferrari",
      avatar: giuliaFerrariProfile,
      rating: 4.9,
      reviews: 198,
      location: "Florence, Italy",
      languages: ["Italian", "English"],
      expertise: "Renaissance Art & Italian",
      specializations: ["Art Vocabulary", "Cultural Italian", "Travel Phrases"],
      interests: ["Art", "Museums", "Culture"],
      hourlyRate: "$32-48",
      experience: "11 years",
      verified: true,
      about: "Art historian teaching Italian through Renaissance culture and artistic heritage.",
      studentsCount: 675,
      availability: "Available next 1 hour"
    },

    // Portuguese Instructors
    {
      id: 9,
      name: "Ana Santos",
      avatar: anaSantosProfile,
      rating: 4.7,
      reviews: 143,
      location: "Lisbon, Portugal",
      languages: ["Portuguese", "English", "Spanish"],
      expertise: "European Portuguese",
      specializations: ["Portuguese Culture", "Fado Music", "Travel Portuguese"],
      interests: ["Music", "History", "Travel"],
      hourlyRate: "$22-38",
      experience: "7 years",
      verified: true,
      about: "Lisbon native teaching Portuguese through traditional music and coastal culture.",
      studentsCount: 534,
      availability: "Available in 2 hours"
    },
    {
      id: 10,
      name: "Bruno Silva",
      avatar: brunoSilvaProfile,
      rating: 4.8,
      reviews: 176,
      location: "Rio de Janeiro, Brazil",
      languages: ["Portuguese", "English"],
      expertise: "Brazilian Portuguese",
      specializations: ["Brazilian Culture", "Carnival Traditions", "Beach Culture"],
      interests: ["Dance", "Football", "Music"],
      hourlyRate: "$20-35",
      experience: "9 years",
      verified: true,
      about: "Carioca teacher sharing Brazilian culture through language, music, and traditions.",
      studentsCount: 987,
      availability: "Available today"
    },

    // Japanese Instructors
    {
      id: 11,
      name: "Takeshi Yamamoto",
      avatar: takeshiYamamotoProfile,
      rating: 4.8,
      reviews: 256,
      location: "Tokyo, Japan",
      languages: ["Japanese", "English"],
      expertise: "Conversational Japanese",
      specializations: ["Food Culture", "Street Communication", "Daily Conversations"],
      interests: ["Cooking", "Manga", "Traditional Arts"],
      hourlyRate: "$30-50",
      experience: "6 years",
      verified: true,
      about: "Tokyo native passionate about sharing Japanese food culture and everyday communication.",
      studentsCount: 1567,
      availability: "Available in 1 hour"
    },
    {
      id: 12,
      name: "Sakura Tanaka",
      avatar: sakuraTanakaProfile,
      rating: 4.9,
      reviews: 189,
      location: "Kyoto, Japan",
      languages: ["Japanese", "English"],
      expertise: "Traditional Japanese Culture",
      specializations: ["Tea Ceremony", "Traditional Arts", "Keigo (Honorific Japanese)"],
      interests: ["Tea Ceremony", "Calligraphy", "Traditional Music"],
      hourlyRate: "$35-55",
      experience: "13 years",
      verified: true,
      about: "Kyoto tea ceremony master teaching Japanese through traditional cultural practices.",
      studentsCount: 743,
      availability: "Available tomorrow"
    },

    // Chinese Instructors
    {
      id: 13,
      name: "Li Wei",
      avatar: liWeiProfile,
      rating: 4.8,
      reviews: 234,
      location: "Beijing, China",
      languages: ["Chinese", "English"],
      expertise: "Mandarin & Chinese Culture",
      specializations: ["Business Chinese", "Tea Culture", "Traditional Medicine"],
      interests: ["Tea", "Philosophy", "Traditional Medicine"],
      hourlyRate: "$25-42",
      experience: "10 years",
      verified: true,
      about: "Beijing language teacher specializing in Mandarin through traditional Chinese culture.",
      studentsCount: 1123,
      availability: "Available in 3 hours"
    },
    {
      id: 14,
      name: "Zhang Mei",
      avatar: zhangMeiProfile,
      rating: 4.9,
      reviews: 167,
      location: "Shanghai, China",
      languages: ["Chinese", "English"],
      expertise: "Modern Chinese & Business",
      specializations: ["Business Chinese", "Technology Vocabulary", "Modern Culture"],
      interests: ["Technology", "Business", "Modern Art"],
      hourlyRate: "$28-45",
      experience: "8 years",
      verified: true,
      about: "Shanghai business professional teaching modern Chinese for contemporary communication.",
      studentsCount: 892,
      availability: "Available today"
    },

    // Thai Instructors
    {
      id: 15,
      name: "Ploy Siriwan",
      avatar: ploySiriwanProfile,
      rating: 4.7,
      reviews: 145,
      location: "Bangkok, Thailand",
      languages: ["Thai", "English"],
      expertise: "Thai Culture & Traditions",
      specializations: ["Market Thai", "Buddhist Culture", "Street Food Vocabulary"],
      interests: ["Buddhism", "Cooking", "Traditional Dance"],
      hourlyRate: "$18-30",
      experience: "6 years",
      verified: true,
      about: "Bangkok native sharing Thai culture through market experiences and Buddhist traditions.",
      studentsCount: 678,
      availability: "Available next 2 hours"
    },
    {
      id: 16,
      name: "Somchai Pongpat",
      avatar: somchaiPongpatProfile,
      rating: 4.8,
      reviews: 198,
      location: "Chiang Mai, Thailand",
      languages: ["Thai", "English"],
      expertise: "Northern Thai Culture",
      specializations: ["Hill Tribe Culture", "Traditional Crafts", "Rural Thai"],
      interests: ["Handicrafts", "Nature", "Meditation"],
      hourlyRate: "$16-28",
      experience: "9 years",
      verified: true,
      about: "Chiang Mai cultural guide teaching Thai through traditional crafts and hill tribe culture.",
      studentsCount: 456,
      availability: "Available in 1 hour"
    },

    // Khmer Instructors
    {
      id: 17,
      name: "Sophea Chann",
      avatar: sopheaChannProfile,
      rating: 4.6,
      reviews: 87,
      location: "Siem Reap, Cambodia",
      languages: ["Khmer", "English"],
      expertise: "Khmer History & Culture",
      specializations: ["Angkor History", "Traditional Dance", "Buddhist Teachings"],
      interests: ["History", "Dance", "Archaeology"],
      hourlyRate: "$15-25",
      experience: "5 years",
      verified: true,
      about: "Siem Reap guide teaching Khmer through ancient Angkor history and traditional culture.",
      studentsCount: 234,
      availability: "Available today"
    },
    {
      id: 18,
      name: "Dara Vicheka",
      avatar: daraVichekaProfile,
      rating: 4.7,
      reviews: 112,
      location: "Phnom Penh, Cambodia",
      languages: ["Khmer", "French", "English"],
      expertise: "Modern Khmer & Urban Life",
      specializations: ["Urban Khmer", "Modern Culture", "Business Phrases"],
      interests: ["Urban Culture", "Business", "French Culture"],
      hourlyRate: "$18-32",
      experience: "7 years",
      verified: true,
      about: "Phnom Penh professional teaching modern Khmer for urban communication and business.",
      studentsCount: 345,
      availability: "Available tomorrow"
    },

    // Hindi Instructors
    {
      id: 19,
      name: "Priya Sharma",
      avatar: priyaSharmaProfile,
      rating: 5.0,
      reviews: 178,
      location: "Varanasi, India",
      languages: ["Hindi", "English"],
      expertise: "Cultural Hindi & Traditions",
      specializations: ["Festival Traditions", "Spiritual Practices", "Cultural Customs"],
      interests: ["Spirituality", "Traditional Arts", "History"],
      hourlyRate: "$15-30",
      experience: "12 years",
      verified: true,
      about: "Cultural historian and Hindi teacher specializing in Indian festivals and spiritual traditions.",
      studentsCount: 890,
      availability: "Available next 2 hours"
    },
    {
      id: 20,
      name: "Raj Patel",
      avatar: rajPatelProfile,
      rating: 4.8,
      reviews: 234,
      location: "Mumbai, India",
      languages: ["Hindi", "English", "Gujarati"],
      expertise: "Bollywood Hindi",
      specializations: ["Film Culture", "Modern Hindi", "Mumbai Street Language"],
      interests: ["Cinema", "Music", "Street Culture"],
      hourlyRate: "$18-35",
      experience: "8 years",
      verified: true,
      about: "Mumbai film industry professional teaching Hindi through Bollywood culture and street language.",
      studentsCount: 1234,
      availability: "Available in 4 hours"
    },

    // Arabic Instructors
    {
      id: 21,
      name: "Omar Al-Rashid",
      avatar: omarAlRashidProfile,
      rating: 4.8,
      reviews: 156,
      location: "Cairo, Egypt",
      languages: ["Arabic", "English"],
      expertise: "Egyptian Arabic & Culture",
      specializations: ["Egyptian Dialect", "Middle Eastern Culture", "Islamic Heritage"],
      interests: ["History", "Islamic Art", "Literature"],
      hourlyRate: "$22-38",
      experience: "9 years",
      verified: true,
      about: "Cairo historian teaching Egyptian Arabic through ancient culture and Islamic heritage.",
      studentsCount: 567,
      availability: "Available next 3 hours"
    },
    {
      id: 22,
      name: "Fatima Al-Zahra",
      avatar: fatimaAlZahraProfile,
      rating: 4.9,
      reviews: 198,
      location: "Dubai, UAE",
      languages: ["Arabic", "English"],
      expertise: "Gulf Arabic & Business",
      specializations: ["Business Arabic", "Gulf Culture", "Modern Arabic"],
      interests: ["Business", "Modern Culture", "Technology"],
      hourlyRate: "$30-50",
      experience: "7 years",
      verified: true,
      about: "Dubai business professional teaching Gulf Arabic for modern communication and business.",
      studentsCount: 789,
      availability: "Available today"
    },

    // Hebrew Instructors
    {
      id: 23,
      name: "David Cohen",
      avatar: davidCohenProfile,
      rating: 4.7,
      reviews: 134,
      location: "Tel Aviv, Israel",
      languages: ["Hebrew", "English"],
      expertise: "Modern Hebrew & Israeli Culture",
      specializations: ["Tech Hebrew", "Israeli Slang", "Modern Culture"],
      interests: ["Technology", "Startup Culture", "Mediterranean Life"],
      hourlyRate: "$28-45",
      experience: "6 years",
      verified: true,
      about: "Tel Aviv tech professional teaching modern Hebrew through startup culture and Mediterranean lifestyle.",
      studentsCount: 445,
      availability: "Available in 2 hours"
    },
    {
      id: 24,
      name: "Sarah Goldberg",
      avatar: sarahGoldbergProfile,
      rating: 4.8,
      reviews: 167,
      location: "Jerusalem, Israel",
      languages: ["Hebrew", "English"],
      expertise: "Biblical Hebrew & History",
      specializations: ["Religious Hebrew", "Historical Context", "Traditional Culture"],
      interests: ["History", "Religion", "Archaeology"],
      hourlyRate: "$25-40",
      experience: "11 years",
      verified: true,
      about: "Jerusalem scholar teaching Hebrew through biblical history and traditional Jewish culture.",
      studentsCount: 623,
      availability: "Available tomorrow"
    }
  ];

  /* Commented out old sample lessons data - now using interactive languageLessons
  const oldSampleLessons = [
    // English Lessons
    {
      id: 1,
      title: "Hotel Check-in in English",
      language: "English",
      level: "Beginner",
      duration: "30 minutes",
      instructor: "Sarah Johnson",
      image: englishHotelLesson,
      students: 2847,
      vocabulary: ["reservation", "check-in", "passport", "room key", "receipt"],
      phrases: [
        "I have a reservation under [name]",
        "Could I have a room with a view?",
        "What time is checkout?",
        "Is breakfast included?",
        "Could you call a taxi for me?"
      ],
      culturalNotes: "In English-speaking countries, it's polite to say 'please' and 'thank you' frequently during hotel interactions."
    },

    // Spanish Lessons
    {
      id: 2,
      title: "Spanish Dance Expressions",
      language: "Spanish",
      level: "Intermediate",
      duration: "40 minutes",
      instructor: "Carlos Mendez",
      image: spanishDanceLesson,
      students: 967,
      vocabulary: ["baile", "flamenco", "compás", "palmas", "zapateado"],
      phrases: [
        "¿Sabes bailar flamenco?",
        "El ritmo es muy importante",
        "Siente la música",
        "¡Qué arte tienes!",
        "Vamos a practicar juntos"
      ],
      culturalNotes: "Flamenco is deeply emotional. Each movement tells a story, and improvisation is valued over perfection."
    },

    // French Lessons
    {
      id: 3,
      title: "French Café Conversations",
      language: "French",
      level: "Beginner",
      duration: "35 minutes",
      instructor: "Marie Dubois",
      image: frenchCafeLesson,
      students: 1892,
      vocabulary: ["café", "croissant", "addition", "terrasse", "bonjour"],
      phrases: [
        "Un café, s'il vous plaît",
        "L'addition, s'il vous plaît",
        "C'est délicieux!",
        "Pourriez-vous recommander quelque chose?",
        "Merci beaucoup"
      ],
      culturalNotes: "French café culture values taking time to enjoy your drink. It's common to sit for hours with just one coffee."
    },

    // Italian Lessons
    {
      id: 4,
      title: "Ordering Gelato in Italian",
      language: "Italian",
      level: "Beginner",
      duration: "25 minutes",
      instructor: "Marco Rossi",
      image: italianPiazzaLesson,
      students: 1456,
      vocabulary: ["gelato", "gusto", "cono", "coppa", "piccolo"],
      phrases: [
        "Vorrei un gelato, per favore",
        "Che gusti avete?",
        "Posso assaggiare?",
        "Quanto costa?",
        "È delizioso!"
      ],
      culturalNotes: "Gelato is an art form in Italy. It's normal to ask for a taste before choosing your flavor."
    },

    // Portuguese Lessons
    {
      id: 5,
      title: "Portuguese Beach Culture",
      language: "Portuguese",
      level: "Intermediate",
      duration: "40 minutes",
      instructor: "Ana Santos",
      image: portugueseCafeLesson,
      students: 734,
      vocabulary: ["praia", "sol", "mar", "areia", "onda"],
      phrases: [
        "Vamos à praia?",
        "O sol está muito forte",
        "A água está perfeita",
        "Onde posso alugar uma prancha?",
        "Que vista maravilhosa!"
      ],
      culturalNotes: "Portuguese beach culture is relaxed and social. Sharing food and drinks with new friends is common."
    },

    // Japanese Lessons
    {
      id: 6,
      title: "Ordering Street Food in Japanese",
      language: "Japanese",
      level: "Beginner",
      duration: "25 minutes",
      instructor: "Takeshi Yamamoto",
      image: japaneseStreetFoodLesson,
      students: 3456,
      vocabulary: ["ラーメン (raamen)", "やきとり (yakitori)", "おいしい (oishii)", "ください (kudasai)", "いくら (ikura)"],
      phrases: [
        "ラーメンをください (Raamen wo kudasai)",
        "辛くないですか？ (Karakunai desu ka?)",
        "おいしいです (Oishii desu)",
        "いくらですか？ (Ikura desu ka?)",
        "ありがとうございます (Arigatou gozaimasu)"
      ],
      culturalNotes: "Bowing slightly when ordering and saying 'itadakimasu' before eating shows respect for the food and chef."
    },

    // Chinese Lessons
    {
      id: 7,
      title: "Chinese Tea Ceremony",
      language: "Chinese",
      level: "Intermediate",
      duration: "45 minutes",
      instructor: "Li Wei",
      image: chineseTeaLesson,
      students: 1234,
      vocabulary: ["茶 (chá)", "功夫茶 (gōngfū chá)", "茶杯 (chábēi)", "茶壶 (cháhú)", "品茶 (pǐn chá)"],
      phrases: [
        "请喝茶 (Qǐng hē chá)",
        "这茶很香 (Zhè chá hěn xiāng)",
        "茶艺很美 (Cháyì hěn měi)",
        "谢谢您的招待 (Xièxie nín de zhāodài)",
        "我很喜欢中国茶 (Wǒ hěn xǐhuān Zhōngguó chá)"
      ],
      culturalNotes: "Chinese tea ceremony is about respect, mindfulness, and harmony. Each movement has meaning and purpose."
    },

    // Thai Lessons
    {
      id: 8,
      title: "Thai Market Bargaining",
      language: "Thai",
      level: "Beginner",
      duration: "30 minutes",
      instructor: "Ploy Siriwan",
      image: thaiMarketLesson,
      students: 892,
      vocabulary: ["ตลาด (dtàlàat)", "ราคา (raa-khaa)", "ถูก (thùuk)", "แพง (phaeng)", "ลด (lót)"],
      phrases: [
        "ราคาเท่าไร (Raa-khaa thâo-rai?)",
        "แพงไป (Phaeng pai)",
        "ลดราคาได้ไหม (Lót raa-khaa dâai mái?)",
        "เอาอันนี้ (Ao an níi)",
        "ขอบคุณครับ/ค่ะ (Khòp-khun khráp/khâ)"
      ],
      culturalNotes: "Bargaining in Thai markets is expected and fun! Smile and be friendly - it's part of the social interaction."
    },

    // Khmer Lessons
    {
      id: 9,
      title: "Angkor Temple History in Khmer",
      language: "Khmer",
      level: "Intermediate",
      duration: "50 minutes",
      instructor: "Sophea Chann",
      image: khmerTempleLesson,
      students: 456,
      vocabulary: ["ប្រាសាទ (brasat)", "អង្គរ (angkor)", "ប្រវត្តិ (bravoattei)", "ខ្មែរ (khmer)", "វប្បធម៌ (voppothoam)"],
      phrases: [
        "ប្រាសាទនេះចាស់ណាស់ (Brasat nih jas nas)",
        "សង់នៅសតវត្សទី១២ (Sang nov satavatsa tii 12)",
        "វាស្អាតណាស់ (Vea saat nas)",
        "ស្ថាបត្យកម្មខ្មែរ (Sthabatyakam khmer)",
        "ខ្ញុំចង់រៀនបន្ថែម (Khnom jong rien bantheam)"
      ],
      culturalNotes: "Angkor represents the height of Khmer civilization. Show respect when visiting and learning about these sacred sites."
    },

    // Hindi Lessons
    {
      id: 10,
      title: "Kumbh Mela Festival Traditions",
      language: "Hindi",
      level: "Intermediate",
      duration: "45 minutes",
      instructor: "Priya Sharma",
      image: hindiKumbhMelaLesson,
      students: 1234,
      vocabulary: ["स्नान (snaan)", "पूजा (pooja)", "साधु (sadhu)", "मेला (mela)", "तीर्थ (teerth)"],
      phrases: [
        "कुंभ मेला कब है? (Kumbh mela kab hai?)",
        "स्नान का समय क्या है? (Snaan ka samay kya hai?)",
        "यह बहुत पवित्र है (Yah bahut pavitra hai)",
        "गंगा आरती देखना है (Ganga aarti dekhna hai)"
      ],
      culturalNotes: "Kumbh Mela is the world's largest peaceful gathering. Respect for elders and spiritual leaders is paramount."
    },

    // Arabic Lessons
    {
      id: 11,
      title: "Arabic Souk Shopping",
      language: "Arabic",
      level: "Beginner",
      duration: "35 minutes",
      instructor: "Omar Al-Rashid",
      image: arabicSoukLesson,
      students: 678,
      vocabulary: ["سوق (souq)", "سعر (si'r)", "غالي (ghali)", "رخيص (rakhees)", "شكراً (shukran)"],
      phrases: [
        "كم السعر؟ (Kam as-si'r?)",
        "هذا غالي جداً (Hadha ghali jiddan)",
        "هل يمكن تخفيض السعر؟ (Hal yumkin takhfeed as-si'r?)",
        "سآخذ هذا (Sa-akhudh hadha)",
        "شكراً لك (Shukran lak)"
      ],
      culturalNotes: "Bargaining in Arab markets is an art form and social interaction. Building relationships is as important as the transaction."
    },

    // Hebrew Lessons
    {
      id: 12,
      title: "Hebrew Market Conversations",
      language: "Hebrew",
      level: "Beginner",
      duration: "30 minutes",
      instructor: "David Cohen",
      image: hebrewMarketLesson,
      students: 543,
      vocabulary: ["שוק (shuk)", "מחיר (mechir)", "יקר (yakar)", "זול (zol)", "תודה (toda)"],
      phrases: [
        "כמה זה עולה? (Kama ze ole?)",
        "זה יקר מדי (Ze yakar midai)",
        "אפשר הנחה? (Efshar hanakha?)",
        "אני אקח את זה (Ani ekach et ze)",
        "תודה רבה (Toda raba)"
      ],
      culturalNotes: "Israeli markets are lively and social. Direct communication is appreciated, and haggling is expected in traditional markets."
    }
  ]; */

  const filteredInstructors = selectedLanguage 
    ? languageInstructors.filter(instructor => instructor.languages.includes(selectedLanguage))
    : languageInstructors.slice(0, 8); // Show first 8 if no language selected

  // Transform DB lessons to DragDropLesson format
  const transformedLessons = dbLessons.map(lesson => ({
    id: lesson.id,
    language: lesson.language,
    title: lesson.title,
    level: lesson.level,
    vocabularyItems: (lesson.vocabulary_items || []).map(v => ({
      id: v.id,
      word: v.word,
      phonetic: v.phonetic,
      translation: v.translation,
      category: v.category,
    })),
    targetSentence: lesson.target_sentence,
    targetPhonetic: lesson.target_phonetic,
    targetTranslation: lesson.target_translation,
    culturalNote: lesson.cultural_note,
  }));

  const filteredLessons = useMemo(() => {
    let result = transformedLessons;
    
    if (selectedLanguage) {
      result = result.filter(l => l.language === selectedLanguage);
    }
    if (selectedLevel) {
      result = result.filter(l => l.level === selectedLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.language.toLowerCase().includes(q) ||
        l.targetTranslation.toLowerCase().includes(q) ||
        l.culturalNote.toLowerCase().includes(q)
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === "language") return a.language.localeCompare(b.language);
      if (sortBy === "level") {
        const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
        return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
      }
      return a.title.localeCompare(b.title);
    });
    
    return result;
  }, [transformedLessons, selectedLanguage, selectedLevel, searchQuery, sortBy]);

  const handleLessonComplete = useCallback(async (lessonId: string) => {
    setActiveLesson(null);
    if (isAuthenticated) {
      try {
        await completeLesson(lessonId);
        toast.success("Lesson completed and progress saved! 🎉");
      } catch {
        toast.error("Could not save progress. Please log in.");
      }
    } else {
      toast.success("Lesson completed! Log in to save your progress.");
    }
  }, [isAuthenticated, completeLesson]);

  const startLesson = (lessonId: string) => {
    setActiveLesson(lessonId);
    toast.info("Starting lesson...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section 
          className="py-20 bg-gradient-wanderlust text-white relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(32, 130, 180, 0.8), rgba(220, 95, 75, 0.8)), url(${osakaStreetFoodBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Languages with Locals
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Master essential phrases and cultural nuances with native speakers who understand the heart of their language
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">5,000+ Students</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">12+ Languages</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Native Speakers</Badge>
            </div>
          </div>
        </section>

        {/* Language Selector & Filters */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search lessons by title, language, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              
              {/* Filter Row */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                </div>
                
                <select
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                
                <select
                  className="px-3 py-2 border rounded-lg bg-background text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "language" | "level" | "title")}
                >
                  <option value="language">Sort by Language</option>
                  <option value="level">Sort by Level</option>
                  <option value="title">Sort by Title</option>
                </select>
                
                <span className="text-sm text-muted-foreground ml-auto">
                  {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Language Lessons */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">
              {selectedLanguage ? `${selectedLanguage} Interactive Lessons` : 'Interactive Language Lessons'}
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Practice real conversations with drag-and-drop vocabulary lessons designed by native speakers
            </p>

            {lessonsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : activeLesson ? (
              <div className="mb-8">
                <DragDropLesson
                  key={activeLesson}
                  language={filteredLessons.find(l => l.id === activeLesson)?.language || ''}
                  lessonTitle={filteredLessons.find(l => l.id === activeLesson)?.title || ''}
                  vocabularyItems={filteredLessons.find(l => l.id === activeLesson)?.vocabularyItems || []}
                  targetSentence={filteredLessons.find(l => l.id === activeLesson)?.targetSentence || ''}
                  targetPhonetic={filteredLessons.find(l => l.id === activeLesson)?.targetPhonetic || ''}
                  targetTranslation={filteredLessons.find(l => l.id === activeLesson)?.targetTranslation || ''}
                   onComplete={() => handleLessonComplete(activeLesson)}
                   onMarkComplete={() => handleLessonComplete(activeLesson)}
                 />
                <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveLesson(null)}
                    className="px-8"
                  >
                    Back to Lessons
                  </Button>
                </div>
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No lessons found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedLanguage(""); setSelectedLevel(""); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <Card key={lesson.id} className="hover:travel-shadow transition-all duration-300 overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30">
                      <img
                        src={getLessonThumbnail(lesson.language, lesson.title)}
                        alt={`${lesson.language} lesson`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge className="bg-background/90 text-foreground">{lesson.language}</Badge>
                        <Badge variant="outline" className="bg-background/90 text-foreground">{lesson.level}</Badge>
                      </div>
                      {completedLessonIds.includes(lesson.id) && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-primary-foreground">
                            <Trophy className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-bold text-base mb-2 line-clamp-1">{lesson.title}</h3>
                      
                      <div className="space-y-2 mb-3">
                        <p className="text-sm font-medium text-primary line-clamp-1">
                          {lesson.targetSentence}
                        </p>
                        <p className="text-xs text-muted-foreground italic line-clamp-1">
                          "{lesson.targetTranslation}"
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {lesson.vocabularyItems.slice(0, 3).map((item) => (
                            <Badge key={item.id} variant="secondary" className="text-xs">
                              {item.word}
                            </Badge>
                          ))}
                          {lesson.vocabularyItems.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lesson.vocabularyItems.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-wanderlust hover:opacity-90 flex items-center gap-2"
                        size="sm"
                        onClick={() => startLesson(lesson.id)}
                        disabled={completedLessonIds.includes(lesson.id)}
                      >
                        <BookOpen className="w-4 h-4" />
                        {completedLessonIds.includes(lesson.id) ? 'Completed' : 'Start Lesson'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Language Instructors */}
        <section 
          className="py-16 relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${languageInstructorsBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-bold text-center mb-4">
              {selectedLanguage ? `${selectedLanguage} Instructors` : 'Meet Your Instructors'}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Learn from passionate native speakers who bring their culture and expertise to every lesson
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {filteredInstructors.map((instructor) => (
                <Card key={instructor.id} className="hover:travel-shadow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-xl">{instructor.name}</h3>
                          {instructor.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{instructor.rating}</span>
                            <span className="text-muted-foreground text-sm">
                              ({instructor.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {instructor.location}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{instructor.about}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs font-semibold">Expertise</Label>
                            <p className="text-sm text-travel-ocean">{instructor.expertise}</p>
                          </div>
                          
                          <div>
                            <Label className="text-xs font-semibold">Specializations</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {instructor.specializations.map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <Label className="text-xs font-semibold">Rate</Label>
                              <p className="text-travel-sunset font-semibold">{instructor.hourlyRate}/hr</p>
                            </div>
                            <div>
                              <Label className="text-xs font-semibold">Students</Label>
                              <p>{instructor.studentsCount.toLocaleString()}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-semibold">Status</Label>
                              <p className="text-green-600 text-xs">{instructor.availability}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="flex-1 bg-gradient-wanderlust hover:opacity-90">
                              Book Session
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Languages;