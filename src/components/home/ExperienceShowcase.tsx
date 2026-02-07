import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import cultureImage from "@/assets/culture-experiences.jpg";
import baganImage from "@/assets/bagan-balloons.jpg";
import montBlancImage from "@/assets/mont-blanc-paragliding.jpg";
import baliImage from "@/assets/bali-monkey-forest.jpg";
import varanasiImage from "@/assets/varanasi-temples.jpg";
import laplandImage from "@/assets/lapland-northern-lights.jpg";
import whaleSharkImage from "@/assets/whale-shark-swimming.jpg";

const ExperienceShowcase = () => {
  const experiences = [
    {
      id: 1,
      title: "Hot Air Ballooning Above Ancient Bagan",
      location: "Bagan, Myanmar",
      host: "Thant Zin",
      rating: 5.0,
      reviews: 342,
      duration: "3 hours",
      groupSize: "2-8 people",
      price: "$295",
      tags: ["Adventure", "Sunrise", "Ancient Temples"],
      description: "Float above thousands of ancient pagodas at sunrise in one of the world's most magical hot air balloon experiences.",
      image: baganImage
    },
    {
      id: 2,
      title: "Paragliding Above Mont Blanc",
      location: "Chamonix, France",
      host: "Pierre Dubois",
      rating: 4.9,
      reviews: 178,
      duration: "2 hours",
      groupSize: "1-2 people",
      price: "$385",
      tags: ["Extreme Sports", "Alps", "Adventure"],
      description: "Soar through the clouds above Europe's highest peak with breathtaking alpine views that will leave you speechless.",
      image: montBlancImage
    },
    {
      id: 3,
      title: "Sacred Monkey Forest Temple Trek",
      location: "Ubud, Bali",
      host: "Kadek Sari",
      rating: 4.8,
      reviews: 267,
      duration: "2.5 hours",
      groupSize: "2-10 people",
      price: "$45",
      tags: ["Wildlife", "Temples", "Spiritual"],
      description: "Journey through mystical temples inhabited by playful macaques while learning about Balinese Hindu traditions.",
      image: baliImage
    },
    {
      id: 4,
      title: "Sacred Temple Tours at Sunrise",
      location: "Varanasi, India",
      host: "Raj Sharma",
      rating: 5.0,
      reviews: 421,
      duration: "4 hours",
      groupSize: "2-12 people",
      price: "$35",
      tags: ["Spiritual", "Ancient", "Culture"],
      description: "Experience the spiritual heart of India with guided tours of ancient temples along the sacred Ganges River.",
      image: varanasiImage
    },
    {
      id: 5,
      title: "Northern Lights Reindeer Adventure",
      location: "Lapland, Finland",
      host: "Aino Virtanen",
      rating: 4.9,
      reviews: 156,
      duration: "6 hours",
      groupSize: "2-6 people",
      price: "$425",
      tags: ["Aurora", "Arctic", "Wildlife"],
      description: "Chase the magical Northern Lights while learning traditional Sami reindeer herding in the pristine Arctic wilderness.",
      image: laplandImage
    },
    {
      id: 6,
      title: "Swimming with Whale Sharks",
      location: "Palawan, Philippines",
      host: "Miguel Santos",
      rating: 5.0,
      reviews: 298,
      duration: "5 hours",
      groupSize: "2-8 people",
      price: "$195",
      tags: ["Marine Life", "Underwater", "Conservation"],
      description: "Dive into crystal clear waters for an unforgettable encounter with the gentle giants of the ocean.",
      image: whaleSharkImage
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
            Authentic Cultural Experiences
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Immerse yourself in local traditions and create memories that last a lifetime
          </p>
        </div>

        {/* Featured Experience - Mobile optimized */}
        <div className="relative mb-8 sm:mb-12 md:mb-16 rounded-xl sm:rounded-2xl overflow-hidden travel-shadow">
          <img 
            src={cultureImage} 
            alt="Cultural experiences collage" 
            className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/95 via-yellow-50/80 to-transparent sm:from-amber-100/90 sm:via-yellow-50/70" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-lg space-y-3 sm:space-y-4 md:space-y-6">
                <Badge variant="secondary" className="bg-travel-sunset/20 text-travel-sunset border-travel-sunset/30 text-xs sm:text-sm">
                  Featured Experience
                </Badge>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  Sacred River Ceremony with Hindu Monk
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 sm:line-clamp-none">
                  Join Pandit Sharma for a spiritual journey along the Ganges, 
                  learning ancient rituals and meditation practices at sunrise.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-travel-ocean" />
                    <span className="text-xs sm:text-sm">Varanasi, India</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-travel-sunset fill-current" />
                    <span className="text-xs sm:text-sm font-medium">5.0 (156)</span>
                  </div>
                </div>
                <Button variant="wanderlust" size="default" className="w-full sm:w-auto">
                  Book This Experience
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {experiences.map((experience) => (
            <Card key={experience.id} className="group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-border hover:border-travel-ocean/50">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={experience.image} 
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-semibold text-lg mb-2">{experience.title}</h4>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{experience.location}</span>
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

                <Button className="w-full bg-gradient-to-r from-travel-ocean to-travel-sky text-white border-0 hover:from-travel-ocean/90 hover:to-travel-sky/90">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="journey" size="lg" asChild>
            <Link to="/tours">Explore All Experiences</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExperienceShowcase;