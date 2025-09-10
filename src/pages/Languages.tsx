import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Label } from "@/components/ui/label";

// Import images
import osakaStreetFoodBackground from "@/assets/osaka-street-food-background.jpg";
import languageInstructorsBackground from "@/assets/language-instructors-background.jpg";
import englishHotelLesson from "@/assets/english-hotel-lesson.jpg";
import hindiKumbhMelaLesson from "@/assets/hindi-kumbh-mela-lesson.jpg";
import japaneseStreetFoodLesson from "@/assets/japanese-street-food-lesson.jpg";
import frenchCafeLesson from "@/assets/french-cafe-lesson.jpg";
import spanishDanceLesson from "@/assets/spanish-dance-lesson.jpg";

// Import instructor profile images
import mayaPatelProfile from "@/assets/maya-patel-profile.jpg";
import carlosRodriguezProfile from "@/assets/carlos-rodriguez-profile.jpg";
import yukiTanakaProfile from "@/assets/yuki-tanaka-profile.jpg";
import amaraOkaforProfile from "@/assets/amara-okafor-profile.jpg";

const Languages = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const languages = ["English", "Hindi", "Japanese", "French", "Spanish"];

  const languageInstructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: mayaPatelProfile,
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
      name: "Priya Sharma",
      avatar: carlosRodriguezProfile,
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
      id: 3,
      name: "Takeshi Yamamoto",
      avatar: yukiTanakaProfile,
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
      id: 4,
      name: "Marie Dubois",
      avatar: amaraOkaforProfile,
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
      id: 5,
      name: "Carlos Mendez",
      avatar: carlosRodriguezProfile,
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
    }
  ];

  const sampleLessons = [
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
    {
      id: 2,
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
    {
      id: 3,
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
    {
      id: 4,
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
    {
      id: 5,
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
    }
  ];

  const filteredInstructors = selectedLanguage 
    ? languageInstructors.filter(instructor => instructor.languages.includes(selectedLanguage))
    : languageInstructors;

  const filteredLessons = selectedLanguage 
    ? sampleLessons.filter(lesson => lesson.language === selectedLanguage)
    : sampleLessons;

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
              <Badge variant="secondary" className="text-lg px-4 py-2">20+ Languages</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Native Speakers</Badge>
            </div>
          </div>
        </section>

        {/* Language Selector */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Label htmlFor="language-select" className="block text-center mb-4 text-lg font-semibold">
                Choose a language to learn:
              </Label>
              <select
                id="language-select"
                className="w-full p-4 border rounded-lg bg-background text-lg"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Sample Lessons */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              {selectedLanguage ? `${selectedLanguage} Lessons` : 'Popular Lessons'}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Start with these practical lessons designed to help you communicate confidently in real-world situations
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="hover:travel-shadow transition-all duration-300">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={lesson.image} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{lesson.level}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{lesson.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      with {lesson.instructor}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {lesson.students.toLocaleString()} students
                      </div>
                      <Badge variant="secondary">{lesson.language}</Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <Label className="text-xs font-semibold">Key Vocabulary:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lesson.vocabulary.slice(0, 3).map((word, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {word}
                            </Badge>
                          ))}
                          {lesson.vocabulary.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{lesson.vocabulary.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold">Sample Phrase:</Label>
                        <p className="text-sm italic text-travel-ocean mt-1">
                          "{lesson.phrases[0]}"
                        </p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-gradient-wanderlust hover:opacity-90">
                      Start Free Lesson
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
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