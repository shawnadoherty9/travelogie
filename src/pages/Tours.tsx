import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Calendar, Users, Heart, Camera, Mountain, Utensils, Building, Globe, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TourCard } from "@/components/tours/TourCard";
import { AttractionsGrid } from "@/components/tours/AttractionsGrid";
import { ActivitiesGrid } from "@/components/tours/ActivitiesGrid";
import { useTours } from "@/hooks/useTours";
import { useTourOperators } from "@/hooks/useTourOperators";
import { PersonalizedTourWorkflow } from "@/components/tours/PersonalizedTourWorkflow";
import { getTourGuidesByCity } from "@/data/tourGuides";

// Import tour images
import tokyoFoodTour from "@/assets/tokyo-food-tour.jpg";
import barcelonaArchitectureTour from "@/assets/barcelona-architecture-tour.jpg";
import mumbaiPhotographyTour from "@/assets/mumbai-photography-tour.jpg";

// Import profile images
import mayaPatelProfile from "@/assets/maya-patel-profile.jpg";
import carlosRodriguezProfile from "@/assets/carlos-rodriguez-profile.jpg";
import yukiTanakaProfile from "@/assets/yuki-tanaka-profile.jpg";
import amaraOkaforProfile from "@/assets/amara-okafor-profile.jpg";

// Import background images
import toursHeroBackground from "@/assets/tours-hero-background.jpg";
import culturalGuidesBackground from "@/assets/cultural-guides-background.jpg";
import languageInstructorsBackground from "@/assets/language-instructors-background.jpg";

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
  const [personalizedTour, setPersonalizedTour] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showLanguageSection, setShowLanguageSection] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const {
    toast
  } = useToast();
  const {
    tours,
    attractions,
    activities,
    loading,
    bookTour,
    bookAttraction,
    bookActivity
  } = useTours();
  
  // Use secure tour operators hook for database data
  const { 
    operators: dbTourOperators, 
    loading: operatorsLoading,
    getTourOperatorContact 
  } = useTourOperators();
  const languageInstructors = [{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }];
  const sampleLessons = [{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }];
  const languages = ["English", "Hindi", "Japanese", "French", "Spanish"];
  // Get one diverse guide from each country for multicultural showcase
  const getDisplayGuides = () => {
    if (!location) {
      // Show one guide from each country for maximum diversity
      const internationalGuides = [
        ...getTourGuidesByCity('tokyo').slice(0, 1),      // Japan
        ...getTourGuidesByCity('mumbai').slice(0, 1),     // India  
        ...getTourGuidesByCity('bangkok').slice(0, 1),    // Thailand
        ...getTourGuidesByCity('bali').slice(0, 1),       // Indonesia
        ...getTourGuidesByCity('new-york').slice(0, 1),   // USA
        ...getTourGuidesByCity('delhi').slice(0, 1),      // India (different city for variety)
        ...getTourGuidesByCity('chiang-mai').slice(0, 1), // Thailand (northern culture)
        ...getTourGuidesByCity('ubud').slice(0, 1)        // Indonesia (arts focus)
      ];
      // Filter to ensure one per country by taking first from each unique country
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
    
    // If no guides found for the specific city, show one from each country
    if (cityGuides.length === 0) {
      const fallbackGuides = [
        getTourGuidesByCity('tokyo')[0],      // Japan
        getTourGuidesByCity('mumbai')[0],     // India  
        getTourGuidesByCity('bangkok')[0],    // Thailand
        getTourGuidesByCity('bali')[0]        // Indonesia
      ].filter(Boolean);
      return fallbackGuides;
    }
    
    return cityGuides.slice(0, 8);
  };

  const displayGuides = getDisplayGuides();
  
  // Convert tour guides to the format expected by the UI
  const tourOperators = displayGuides.map(guide => ({
    id: guide.id,
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
  }));
  const interestIcons = {
    "Cultural Heritage": Building,
    "Street Food": Utensils,
    "Photography": Camera,
    "Architecture": Mountain,
    "History": Globe,
    "Local Gastronomy": Utensils,
    "Traditional Arts": Heart,
    "Tea Ceremony": Utensils,
    "Temple Tours": Building,
    "Music & Dance": Heart,
    "Local Markets": Globe,
    "Cultural Stories": Globe
  };
  const handlePersonalizedRequest = () => {
    if (!location || !interests) {
      toast({
        title: "Please fill all fields",
        description: "Location and interests are required for personalized tours.",
        variant: "destructive"
      });
      return;
    }

    // Start the new workflow
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
      // In a real implementation, you might open a modal with contact info
      // or redirect to a booking page
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-wanderlust text-white relative overflow-hidden" style={{
        backgroundImage: `linear-gradient(rgba(32, 130, 180, 0.8), rgba(220, 95, 75, 0.8)), url(${toursHeroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect Tour
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with passionate local guides for authentic cultural experiences
            </p>
          </div>
        </section>

        {/* Tour Mode Selection */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Adventure Style</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${selectedMode === 'personalized' ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedMode('personalized')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Heart className="w-6 h-6 text-travel-sunset" />
                    Personalized Tours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Let our AI agent create a unique experience tailored to your interests, 
                    schedule, and preferences. Perfect for travelers seeking authentic, 
                    off-the-beaten-path adventures.
                  </p>
                  <Badge variant="secondary">AI-Powered Customization</Badge>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${selectedMode === 'preorganized' ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedMode('preorganized')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-travel-ocean" />
                    Pre-Organized Tours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Browse curated experiences created by local experts. 
                    Ready-to-book tours with set itineraries, perfect for 
                    travelers who prefer structured adventures.
                  </p>
                  <Badge variant="outline">Expert-Curated</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Multicultural Tour Guides Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Connect with Local Cultural Guides
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Meet passionate locals who will share their city's hidden gems, cultural traditions, 
                and authentic experiences. Each guide brings unique perspectives and deep local knowledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {tourOperators.map((guide) => (
                <Card key={guide.id} className="group hover:travel-shadow transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage 
                          src={guide.avatar} 
                          alt={guide.name}
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <AvatarFallback className="w-full h-full rounded-none text-2xl bg-gradient-to-br from-travel-ocean to-travel-sky text-white">
                          {guide.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {guide.verified && (
                      <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{guide.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {guide.location}
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-travel-sunset fill-current mr-1" />
                          <span className="font-medium">{guide.rating}</span>
                          <span className="text-sm text-muted-foreground ml-1">({guide.reviews})</span>
                        </div>
                        <div className="text-sm font-semibold text-travel-ocean">
                          {guide.priceRange}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {guide.about}
                    </p>

                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">SPECIALTIES</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialties.slice(0, 2).map((specialty) => {
                            const IconComponent = interestIcons[specialty as keyof typeof interestIcons] || Globe;
                            return (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                <IconComponent className="w-3 h-3 mr-1" />
                                {specialty}
                              </Badge>
                            );
                          })}
                          {guide.specialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{guide.specialties.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">LANGUAGES</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((language) => (
                            <Badge key={language} variant="outline" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-travel-ocean to-travel-sky text-white">
                      <Users className="w-4 h-4 mr-2" />
                      Connect with Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="wanderlust" size="lg">
                <Globe className="w-5 h-5 mr-2" />
                Discover More Guides Worldwide
              </Button>
            </div>
          </div>
        </section>

        {/* Personalized Tour Form */}
        {selectedMode === 'personalized' && <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Tell Us About Your Dream Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="location">Where would you like to explore?</Label>
                    <Input id="location" placeholder="e.g., Tokyo, Paris, or anywhere in Southeast Asia" value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                  
                  <div>
                    <Label htmlFor="interests">What are your interests?</Label>
                    <Textarea id="interests" placeholder="e.g., traditional cooking, ancient history, street art, local music, spiritual practices, sustainable living..." value={interests} onChange={e => setInterests(e.target.value)} rows={4} />
                  </div>

                  <Button onClick={handlePersonalizedRequest} size="lg" className="w-full bg-gradient-wanderlust hover:opacity-90 bg-sky-600 hover:bg-sky-500">
                    Create My Personalized Tour
                  </Button>

                  {showWorkflow && <div className="mt-6">
                      <PersonalizedTourWorkflow location={location} interests={interests} onComplete={() => setShowWorkflow(false)} />
                    </div>}
                </CardContent>
              </Card>
            </div>
          </section>}

        {/* Tours, Attractions & Activities Section */}
        {selectedMode === 'preorganized' && <section className="py-12">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold text-center mb-8">Discover Amazing Experiences</h3>
              
              <Tabs defaultValue="tours" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="tours" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Tours
                  </TabsTrigger>
                  <TabsTrigger value="attractions" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Attractions
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Activities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tours" className="space-y-6">
                  {loading ? <div className="text-center py-8">Loading tours...</div> : tours.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tours.map(tour => <TourCard key={tour.id} tour={{
                  ...tour,
                  city: "City",
                  // TODO: Join with cities table
                  attractions: [],
                  activities: []
                }} onBookTour={bookTour} />)}
                    </div> : <div className="text-center py-8 text-muted-foreground">
                      No tours available at the moment.
                    </div>}
                </TabsContent>

                <TabsContent value="attractions" className="space-y-6">
                  {loading ? <div className="text-center py-8">Loading attractions...</div> : attractions.length > 0 ? <AttractionsGrid attractions={attractions} onBookAttraction={bookAttraction} /> : <div className="text-center py-8 text-muted-foreground">
                      No attractions available at the moment.
                    </div>}
                </TabsContent>

                <TabsContent value="activities" className="space-y-6">
                  {loading ? <div className="text-center py-8">Loading activities...</div> : activities.length > 0 ? <ActivitiesGrid activities={activities} onBookActivity={bookActivity} /> : <div className="text-center py-8 text-muted-foreground">
                      No activities available at the moment.
                    </div>}
                </TabsContent>
              </Tabs>
            </div>
          </section>}

        {/* Local Tour Operators - Always visible on Tours page */}
        {selectedMode && <section className="py-12 bg-muted/30 relative overflow-hidden" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${culturalGuidesBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
            <div className="container mx-auto px-4 relative z-10">
              <h3 className="text-3xl font-bold text-center mb-8">
                Meet Your Local Cultural Guides
              </h3>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Connect with verified local experts who are passionate about sharing their culture, 
                stories, and hidden gems with fellow travelers.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {tourOperators.map(operator => <Card key={operator.id} className="hover:travel-shadow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={operator.avatar} alt={operator.name} />
                          <AvatarFallback>{operator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg">{operator.name}</h4>
                            {operator.verified && <Badge variant="secondary" className="text-xs">
                                ✓ Verified
                              </Badge>}
                          </div>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{operator.rating}</span>
                              <span className="text-muted-foreground text-sm">
                                ({operator.reviews} reviews)
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {operator.location}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">{operator.about}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-semibold">Specialties</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {operator.specialties.map((specialty, index) => {
                            const IconComponent = interestIcons[specialty] || Globe;
                            return <Badge key={index} variant="outline" className="text-xs">
                                      <IconComponent className="w-3 h-3 mr-1" />
                                      {specialty}
                                    </Badge>;
                          })}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs font-semibold">Languages</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {operator.languages.map((language, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                    <Globe className="w-3 h-3 mr-1" />
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-semibold text-travel-ocean">{operator.priceRange}</span>
                              </div>
                              <div className="text-muted-foreground">
                                <Calendar className="w-3 h-3 inline mr-1" />
                                {operator.availability}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                View Profile
                              </Button>
                              <Button size="sm" className="flex-1 bg-gradient-wanderlust hover:opacity-90">
                                Contact Guide
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </div>
          </section>}

      </main>
      <Footer />
    </div>;
};
export default Tours;