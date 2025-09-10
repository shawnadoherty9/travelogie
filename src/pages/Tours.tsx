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
import { Star, MapPin, Calendar, Users, Heart, Camera, Mountain, Utensils, Building, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import tour images
import tokyoFoodTour from "@/assets/tokyo-food-tour.jpg";
import barcelonaArchitectureTour from "@/assets/barcelona-architecture-tour.jpg";
import mumbaiPhotographyTour from "@/assets/mumbai-photography-tour.jpg";

// Import profile images
import mayaPatelProfile from "@/assets/maya-patel-profile.jpg";
import carlosRodriguezProfile from "@/assets/carlos-rodriguez-profile.jpg";
import yukiTanakaProfile from "@/assets/yuki-tanaka-profile.jpg";
import amaraOkaforProfile from "@/assets/amara-okafor-profile.jpg";

const Tours = () => {
  const [selectedMode, setSelectedMode] = useState<'personalized' | 'preorganized' | null>(null);
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [personalizedTour, setPersonalizedTour] = useState("");
  const { toast } = useToast();

  const tourOperators = [
    {
      id: 1,
      name: "Maya Patel",
      avatar: mayaPatelProfile,
      rating: 4.9,
      reviews: 156,
      location: "Mumbai, India",
      specialties: ["Cultural Heritage", "Street Food", "Photography"],
      languages: ["English", "Hindi", "Gujarati"],
      priceRange: "$45-85/day",
      verified: true,
      about: "Local photographer and cultural guide with 8 years experience showcasing authentic Mumbai.",
      availability: "Available next 7 days"
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      avatar: carlosRodriguezProfile,
      rating: 4.8,
      reviews: 203,
      location: "Barcelona, Spain",
      specialties: ["Architecture", "History", "Local Gastronomy"],
      languages: ["Spanish", "English", "Catalan"],
      priceRange: "$60-120/day",
      verified: true,
      about: "Architecture historian passionate about sharing Barcelona's hidden gems and culinary secrets.",
      availability: "Available in 3 days"
    },
    {
      id: 3,
      name: "Yuki Tanaka",
      avatar: yukiTanakaProfile,
      rating: 5.0,
      reviews: 89,
      location: "Kyoto, Japan",
      specialties: ["Traditional Arts", "Tea Ceremony", "Temple Tours"],
      languages: ["Japanese", "English"],
      priceRange: "$80-150/day",
      verified: true,
      about: "Traditional arts master offering authentic cultural experiences in ancient Kyoto.",
      availability: "Available next 14 days"
    },
    {
      id: 4,
      name: "Amara Okafor",
      avatar: amaraOkaforProfile,
      rating: 4.9,
      reviews: 127,
      location: "Lagos, Nigeria",
      specialties: ["Music & Dance", "Local Markets", "Cultural Stories"],
      languages: ["English", "Yoruba", "Igbo"],
      priceRange: "$35-70/day",
      verified: true,
      about: "Cultural storyteller and musician sharing Nigeria's vibrant traditions and rhythms.",
      availability: "Available next 10 days"
    }
  ];

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
        variant: "destructive",
      });
      return;
    }

    // Simulate AI agent processing
    toast({
      title: "Creating your personalized tour",
      description: "Our AI agent is crafting a unique experience based on your preferences...",
    });

    // Simulate tour generation
    setTimeout(() => {
      setPersonalizedTour(`Based on your interest in ${interests} and location ${location}, here's your personalized tour:

🗓️ 3-Day Cultural Immersion Experience
📍 Starting point: ${location}

Day 1: Authentic Local Life
- Morning: Traditional breakfast with local family
- Afternoon: Guided neighborhood walk focusing on ${interests}
- Evening: Sunset viewing at hidden local spot

Day 2: Deep Cultural Dive
- Morning: Hands-on workshop related to ${interests}
- Afternoon: Visit to local artisans and craftspeople
- Evening: Traditional dinner and cultural performance

Day 3: Personal Connection
- Morning: One-on-one time with local expert
- Afternoon: Create something to take home
- Evening: Reflection and farewell ceremony

💡 This tour can be customized further based on your specific needs and the available local guides below.`);
      
      toast({
        title: "Your personalized tour is ready!",
        description: "Scroll down to see your custom itinerary and available local guides.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-wanderlust text-white">
          <div className="container mx-auto px-4 text-center">
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
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${
                  selectedMode === 'personalized' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMode('personalized')}
              >
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

              <Card 
                className={`cursor-pointer transition-all duration-300 hover:travel-shadow ${
                  selectedMode === 'preorganized' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMode('preorganized')}
              >
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

        {/* Personalized Tour Form */}
        {selectedMode === 'personalized' && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Tell Us About Your Dream Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="location">Where would you like to explore?</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Tokyo, Paris, or anywhere in Southeast Asia"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="interests">What are your interests?</Label>
                    <Textarea
                      id="interests"
                      placeholder="e.g., traditional cooking, ancient history, street art, local music, spiritual practices, sustainable living..."
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handlePersonalizedRequest}
                    className="w-full bg-gradient-wanderlust hover:opacity-90"
                    size="lg"
                  >
                    Create My Personalized Tour
                  </Button>

                  {personalizedTour && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-travel-ocean">Your Personalized Tour</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {personalizedTour}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Pre-organized Tours Section */}
        {selectedMode === 'preorganized' && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold text-center mb-8">Popular Curated Experiences</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    title: "Tokyo Food & Culture Walking Tour",
                    location: "Tokyo, Japan",
                    duration: "6 hours",
                    price: "$120",
                    rating: 4.9,
                    image: tokyoFoodTour
                  },
                  {
                    title: "Barcelona Architecture & History",
                    location: "Barcelona, Spain", 
                    duration: "4 hours",
                    price: "$85",
                    rating: 4.8,
                    image: barcelonaArchitectureTour
                  },
                  {
                    title: "Mumbai Street Photography Tour",
                    location: "Mumbai, India",
                    duration: "5 hours", 
                    price: "$65",
                    rating: 4.9,
                    image: mumbaiPhotographyTour
                  }
                ].map((tour, index) => (
                  <Card key={index} className="hover:travel-shadow transition-all duration-300">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <img 
                        src={tour.image} 
                        alt={tour.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{tour.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        {tour.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-travel-ocean">{tour.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{tour.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Local Tour Operators */}
        {selectedMode && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h3 className="text-3xl font-bold text-center mb-8">
                Meet Your Local Cultural Guides
              </h3>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Connect with verified local experts who are passionate about sharing their culture, 
                stories, and hidden gems with fellow travelers.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                {tourOperators.map((operator) => (
                  <Card key={operator.id} className="hover:travel-shadow transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={operator.avatar} alt={operator.name} />
                          <AvatarFallback>{operator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg">{operator.name}</h4>
                            {operator.verified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Verified
                              </Badge>
                            )}
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
                                  return (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      <IconComponent className="w-3 h-3 mr-1" />
                                      {specialty}
                                    </Badge>
                                  );
                                })}
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
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Tours;