import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { TourCard } from "@/components/tours/TourCard";
import { AttractionsGrid } from "@/components/tours/AttractionsGrid";
import { ActivitiesGrid } from "@/components/tours/ActivitiesGrid";
import { useTours } from "@/hooks/useTours";
import { useTourOperators } from "@/hooks/useTourOperators";
import { PersonalizedTourWorkflow } from "@/components/tours/PersonalizedTourWorkflow";
import { getTourGuidesByCity } from "@/data/tourGuides";

// New refactored components
import { TourHeroSection } from "@/components/tours/TourHeroSection";
import { TourModeSelection } from "@/components/tours/TourModeSelection";
import { PersonalizedTourForm } from "@/components/tours/PersonalizedTourForm";
import { TourGuidesGrid } from "@/components/tours/TourGuidesGrid";
import { LanguageInstructorsSection } from "@/components/tours/LanguageInstructorsSection";

// Import profile images for instructors
import mayaPatelProfile from "@/assets/maya-patel-profile.jpg";
import carlosRodriguezProfile from "@/assets/carlos-rodriguez-profile.jpg";
import yukiTanakaProfile from "@/assets/yuki-tanaka-profile.jpg";
import amaraOkaforProfile from "@/assets/amara-okafor-profile.jpg";

// Import lesson images
import englishHotelLesson from "@/assets/english-hotel-lesson.jpg";
import hindiKumbhMelaLesson from "@/assets/hindi-kumbh-mela-lesson.jpg";
import japaneseStreetFoodLesson from "@/assets/japanese-street-food-lesson.jpg";
import frenchCafeLesson from "@/assets/french-cafe-lesson.jpg";
import spanishDanceLesson from "@/assets/spanish-dance-lesson.jpg";

const Tours = () => {
  const [selectedMode, setSelectedMode] = useState<'personalized' | 'preorganized' | null>(null);
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showWorkflow, setShowWorkflow] = useState(false);
  const { toast } = useToast();

  const {
    tours,
    attractions,
    activities,
    loading,
    bookTour,
    bookAttraction,
    bookActivity
  } = useTours();
  
  const { 
    operators: dbTourOperators, 
    loading: operatorsLoading,
    getTourOperatorContact 
  } = useTourOperators();

  // Memoized data to improve performance
  const languageInstructors = useMemo(() => [
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
      about: "Native English speaker with hospitality background, specializing in practical travel English."
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
      about: "Cultural historian and Hindi teacher specializing in Indian festivals and spiritual traditions."
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
      about: "Tokyo native passionate about sharing Japanese food culture and everyday communication."
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
      about: "Parisian chef and language teacher combining French language with culinary traditions."
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
      about: "Professional dancer and Spanish teacher integrating language learning with cultural movement."
    }
  ], []);

  const sampleLessons = useMemo(() => [
    {
      id: 1,
      title: "Hotel Check-in in English",
      language: "English",
      level: "Beginner",
      duration: "30 minutes",
      instructor: "Sarah Johnson",
      image: englishHotelLesson,
      vocabulary: ["reservation", "check-in", "passport", "room key", "receipt"],
      phrases: ["I have a reservation under [name]", "Could I have a room with a view?", "What time is checkout?", "Is breakfast included?", "Could you call a taxi for me?"],
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
      vocabulary: ["स्नान (snaan)", "पूजा (pooja)", "साधु (sadhu)", "मेला (mela)", "तीर्थ (teerth)"],
      phrases: ["कुंभ मेला कब है? (Kumbh mela kab hai?)", "स्नान का समय क्या है? (Snaan ka samay kya hai?)", "यह बहुत पवित्र है (Yah bahut pavitra hai)", "गंगा आरती देखना है (Ganga aarti dekhna hai)"],
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
      vocabulary: ["ラーメン (raamen)", "やきとり (yakitori)", "おいしい (oishii)", "ください (kudasai)", "いくら (ikura)"],
      phrases: ["ラーメンをください (Raamen wo kudasai)", "辛くないですか？ (Karakunai desu ka?)", "おいしいです (Oishii desu)", "いくらですか？ (Ikura desu ka?)", "ありがとうございます (Arigatou gozaimasu)"],
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
      vocabulary: ["café", "croissant", "addition", "terrasse", "bonjour"],
      phrases: ["Un café, s'il vous plaît", "L'addition, s'il vous plaît", "C'est délicieux!", "Pourriez-vous recommander quelque chose?", "Merci beaucoup"],
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
      vocabulary: ["baile", "flamenco", "compás", "palmas", "zapateado"],
      phrases: ["¿Sabes bailar flamenco?", "El ritmo es muy importante", "Siente la música", "¡Qué arte tienes!", "Vamos a practicar juntos"],
      culturalNotes: "Flamenco is deeply emotional. Each movement tells a story, and improvisation is valued over perfection."
    }
  ], []);

  const languages = ["English", "Hindi", "Japanese", "French", "Spanish"];

  // Memoized tour guides for better performance
  const displayGuides = useMemo(() => {
    if (!location) {
      // Show one guide from each country for maximum diversity
      const uniqueCountryGuides = [
        getTourGuidesByCity('tokyo')[0],      // Japan
        getTourGuidesByCity('mumbai')[0],     // India  
        getTourGuidesByCity('bangkok')[0],    // Thailand
        getTourGuidesByCity('bali')[0],       // Indonesia
        getTourGuidesByCity('new-york')[0]    // USA
      ].filter(Boolean);
      return uniqueCountryGuides;
    }
    
    const cityId = location.toLowerCase().replace(/\s+/g, '-');
    const cityGuides = getTourGuidesByCity(cityId);
    
    if (cityGuides.length === 0) {
      const fallbackGuides = [
        getTourGuidesByCity('tokyo')[0],
        getTourGuidesByCity('mumbai')[0],
        getTourGuidesByCity('bangkok')[0],
        getTourGuidesByCity('bali')[0]
      ].filter(Boolean);
      return fallbackGuides;
    }
    
    return cityGuides.slice(0, 8);
  }, [location]);

  // Convert tour guides to the format expected by the UI
  const tourOperators = useMemo(() => 
    displayGuides.map(guide => ({
      id: Number(guide.id),
      name: guide.name,
      avatar: guide.avatar,
      rating: guide.rating,
      reviews: guide.reviews,
      location: `${guide.cityId.charAt(0).toUpperCase() + guide.cityId.slice(1).replace(/-/g, ' ')}`,
      specialties: guide.specialties,
      languages: guide.languages,
      priceRange: `$${guide.dailyRate - 20}-${guide.dailyRate}/day`,
      verified: true,
      about: guide.about,
      availability: "Available next 7 days"
    }))
  , [displayGuides]);

  const handlePersonalizedRequest = () => {
    if (!location || !interests) {
      toast({
        title: "Please fill all fields",
        description: "Location and interests are required for personalized tours.",
        variant: "destructive"
      });
      return;
    }

    setShowWorkflow(true);
    toast({
      title: "Creating your personalized tour",
      description: "Generating customized recommendations based on your preferences..."
    });
  };

  const handleContactTourOperator = async (operatorId: string) => {
    const contactInfo = await getTourOperatorContact(operatorId);
    if (contactInfo) {
      toast({
        title: "Contact Information Retrieved",
        description: "You can now contact the tour operator for booking.",
      });
    }
  };

  if (showWorkflow) {
    return <PersonalizedTourWorkflow location={location} interests={interests} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <TourHeroSection />
        
        <TourModeSelection 
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
        />

        {selectedMode === 'personalized' && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <PersonalizedTourForm
                location={location}
                interests={interests}
                onLocationChange={setLocation}
                onInterestsChange={setInterests}
                onSubmit={handlePersonalizedRequest}
              />
            </div>
          </section>
        )}

        <TourGuidesGrid 
          guides={tourOperators}
          onContactGuide={handleContactTourOperator}
        />

        <LanguageInstructorsSection
          instructors={languageInstructors}
          sampleLessons={sampleLessons}
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
          languages={languages}
        />

        {selectedMode === 'preorganized' && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="tours" className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Browse Pre-Organized Experiences</h2>
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                    <TabsTrigger value="tours">Tours</TabsTrigger>
                    <TabsTrigger value="attractions">Attractions</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="tours" className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">Loading tours...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tours.map((tour) => (
                        <TourCard
                          key={tour.id}
                          tour={{...tour, city: 'Unknown City'}}
                          onBookTour={() => bookTour(tour.id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="attractions">
                  {loading ? (
                    <div className="text-center py-8">Loading attractions...</div>
                  ) : (
                    <AttractionsGrid
                      attractions={attractions}
                      onBookAttraction={bookAttraction}
                    />
                  )}
                </TabsContent>

                <TabsContent value="activities">
                  {loading ? (
                    <div className="text-center py-8">Loading activities...</div>
                  ) : (
                    <ActivitiesGrid
                      activities={activities}
                      onBookActivity={bookActivity}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tours;