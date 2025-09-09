import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";
import cultureImage from "@/assets/culture-experiences.jpg";

const ExperienceShowcase = () => {
  const experiences = [
    {
      id: 1,
      title: "Traditional Cooking with Nonna Maria",
      location: "Tuscany, Italy",
      host: "Maria Rossi",
      rating: 4.9,
      reviews: 127,
      duration: "3 hours",
      groupSize: "2-6 people",
      price: "$89",
      tags: ["Cooking", "Traditional", "Family Recipe"],
      description: "Learn authentic Italian recipes passed down through generations in Maria's family kitchen."
    },
    {
      id: 2,
      title: "Sunrise Fishing with Local Fishermen",
      location: "Gili Islands, Indonesia",
      host: "Wayan Surya",
      rating: 5.0,
      reviews: 89,
      duration: "4 hours",
      groupSize: "1-4 people",
      price: "$65",
      tags: ["Fishing", "Sunrise", "Traditional"],
      description: "Experience traditional Indonesian fishing methods and enjoy fresh catch for breakfast."
    },
    {
      id: 3,
      title: "Calligraphy Art Workshop",
      location: "Kyoto, Japan",
      host: "Hiroshi Tanaka",
      rating: 4.8,
      reviews: 203,
      duration: "2 hours",
      groupSize: "1-8 people",
      price: "$75",
      tags: ["Art", "Traditional", "Mindfulness"],
      description: "Master the ancient art of Japanese calligraphy in a traditional tea house setting."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Authentic Cultural Experiences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in local traditions and create memories that last a lifetime
          </p>
        </div>

        {/* Featured Experience */}
        <div className="relative mb-16 rounded-2xl overflow-hidden travel-shadow">
          <img 
            src={cultureImage} 
            alt="Cultural experiences collage" 
            className="w-full h-80 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-lg space-y-6">
                <Badge variant="secondary" className="bg-travel-sunset/20 text-travel-sunset border-travel-sunset/30">
                  Featured Experience
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  Sacred River Ceremony with Hindu Monk
                </h3>
                <p className="text-muted-foreground">
                  Join Pandit Sharma for a spiritual journey along the Ganges, 
                  learning ancient rituals and meditation practices at sunrise.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-travel-ocean" />
                    <span className="text-sm">Varanasi, India</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-travel-sunset fill-current" />
                    <span className="text-sm font-medium">5.0 (156)</span>
                  </div>
                </div>
                <Button variant="wanderlust" size="lg">
                  Book This Experience
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((experience) => (
            <Card key={experience.id} className="group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-border hover:border-travel-ocean/50">
              <div className="aspect-video bg-gradient-to-br from-travel-sky to-travel-ocean relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <h4 className="font-semibold text-lg mb-2">{experience.title}</h4>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{experience.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-travel-sunset fill-current" />
                    <span className="text-sm font-medium">{experience.rating}</span>
                    <span className="text-xs text-muted-foreground">({experience.reviews})</span>
                  </div>
                  <span className="font-semibold text-travel-ocean">{experience.price}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {experience.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{experience.groupSize}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {experience.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="cultural" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="journey" size="lg">
            Explore All Experiences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceShowcase;