import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Wifi, WifiOff } from "lucide-react";
import ExperienceFilters, { FilterState } from "./ExperienceFilters";
import cultureImage from "@/assets/culture-experiences.jpg";
import baganImage from "@/assets/bagan-balloons.jpg";
import montBlancImage from "@/assets/mont-blanc-paragliding.jpg";
import baliImage from "@/assets/bali-monkey-forest.jpg";
import varanasiImage from "@/assets/varanasi-temples.jpg";
import laplandImage from "@/assets/lapland-northern-lights.jpg";
import whaleSharkImage from "@/assets/whale-shark-swimming.jpg";
import italianNonnaCookingImage from "@/assets/italian-nonna-cooking-class.jpg";
import japaneseTeaCeremonyImage from "@/assets/japanese-tea-ceremony.jpg";

const FilterableExperienceShowcase = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: 'all',
    category: 'all',
    type: 'all',
    startDate: undefined,
    endDate: undefined
  });

  const experiences = [
    {
      id: 1,
      title: "Hot Air Ballooning Above Ancient Bagan",
      location: "Bagan, Myanmar",
      country: "Myanmar",
      host: "Thant Zin",
      rating: 5.0,
      reviews: 342,
      duration: "3 hours",
      groupSize: "2-8 people",
      price: "$295",
      tags: ["Adventure", "Sunrise", "Ancient Temples"],
      categories: ["Adventure", "Ancient"],
      description: "Float above thousands of ancient pagodas at sunrise in one of the world's most magical hot air balloon experiences.",
      image: baganImage,
      type: "offline",
      availableDates: ["2024-12-01", "2024-12-15", "2025-01-10", "2025-02-05"]
    },
    {
      id: 2,
      title: "Paragliding Above Mont Blanc",
      location: "Chamonix, France",
      country: "France",
      host: "Pierre Dubois",
      rating: 4.9,
      reviews: 178,
      duration: "2 hours",
      groupSize: "1-2 people",
      price: "$385",
      tags: ["Extreme Sports", "Alps", "Adventure"],
      categories: ["Extreme Sports", "Adventure"],
      description: "Soar through the clouds above Europe's highest peak with breathtaking alpine views that will leave you speechless.",
      image: montBlancImage,
      type: "offline",
      availableDates: ["2024-11-20", "2024-12-05", "2025-01-15", "2025-03-01"]
    },
    {
      id: 3,
      title: "Sacred Monkey Forest Temple Trek",
      location: "Ubud, Bali",
      country: "Indonesia",
      host: "Kadek Sari",
      rating: 4.8,
      reviews: 267,
      duration: "2.5 hours",
      groupSize: "2-10 people",
      price: "$45",
      tags: ["Wildlife", "Temples", "Spiritual"],
      categories: ["Wildlife", "Spiritual", "Temples"],
      description: "Journey through mystical temples inhabited by playful macaques while learning about Balinese Hindu traditions.",
      image: baliImage,
      type: "offline",
      availableDates: ["2024-11-25", "2024-12-10", "2025-01-05", "2025-02-20"]
    },
    {
      id: 4,
      title: "Sacred Temple Tours at Sunrise",
      location: "Varanasi, India",
      country: "India",
      host: "Raj Sharma",
      rating: 5.0,
      reviews: 421,
      duration: "4 hours",
      groupSize: "2-12 people",
      price: "$35",
      tags: ["Spiritual", "Ancient", "Culture"],
      categories: ["Spiritual", "Ancient", "Cultural"],
      description: "Experience the spiritual heart of India with guided tours of ancient temples along the sacred Ganges River.",
      image: varanasiImage,
      type: "offline",
      availableDates: ["2024-12-01", "2024-12-20", "2025-01-08", "2025-02-12"]
    },
    {
      id: 5,
      title: "Northern Lights Reindeer Adventure",
      location: "Lapland, Finland",
      country: "Finland",
      host: "Aino Virtanen",
      rating: 4.9,
      reviews: 156,
      duration: "6 hours",
      groupSize: "2-6 people",
      price: "$425",
      tags: ["Aurora", "Arctic", "Wildlife"],
      categories: ["Aurora", "Wildlife"],
      description: "Chase the magical Northern Lights while learning traditional Sami reindeer herding in the pristine Arctic wilderness.",
      image: laplandImage,
      type: "offline",
      availableDates: ["2024-12-15", "2025-01-01", "2025-01-20", "2025-02-05"]
    },
    {
      id: 6,
      title: "Swimming with Whale Sharks",
      location: "Palawan, Philippines",
      country: "Philippines",
      host: "Miguel Santos",
      rating: 5.0,
      reviews: 298,
      duration: "5 hours",
      groupSize: "2-8 people",
      price: "$195",
      tags: ["Marine Life", "Underwater", "Conservation"],
      categories: ["Marine Life"],
      description: "Dive into crystal clear waters for an unforgettable encounter with the gentle giants of the ocean.",
      image: whaleSharkImage,
      type: "offline",
      availableDates: ["2024-11-30", "2024-12-12", "2025-01-18", "2025-03-05"]
    },
    {
      id: 7,
      title: "Virtual Cooking Class with Italian Nonna",
      location: "Online from Tuscany, Italy",
      country: "Italy",
      host: "Nonna Maria",
      rating: 4.7,
      reviews: 89,
      duration: "2 hours",
      groupSize: "1-20 people",
      price: "$45",
      tags: ["Food & Drink", "Cultural", "Online"],
      categories: ["Food & Drink", "Cultural"],
      description: "Learn authentic Italian recipes from a real Italian grandmother in this interactive online cooking experience.",
      image: italianNonnaCookingImage,
      type: "online",
      availableDates: ["2024-11-22", "2024-12-03", "2025-01-12", "2025-02-15"]
    },
    {
      id: 8,
      title: "Japanese Tea Ceremony Workshop",
      location: "Online from Kyoto, Japan",
      country: "Japan",
      host: "Sakura Tanaka",
      rating: 4.9,
      reviews: 134,
      duration: "1.5 hours",
      groupSize: "1-15 people",
      price: "$35",
      tags: ["Cultural", "Spiritual", "Online"],
      categories: ["Cultural", "Spiritual"],
      description: "Discover the meditative art of Japanese tea ceremony from a traditional tea master in Kyoto.",
      image: japaneseTeaCeremonyImage,
      type: "online",
      availableDates: ["2024-11-28", "2024-12-08", "2025-01-25", "2025-02-10"]
    }
  ];

  const filterExperiences = () => {
    return experiences.filter(experience => {
      // Search filter
      if (filters.search && !experience.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !experience.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !experience.location.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all' && !experience.country.includes(filters.location)) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && !experience.categories.includes(filters.category)) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && experience.type !== filters.type) {
        return false;
      }

      // Date filter (simplified - checking if any available date falls within range)
      if (filters.startDate || filters.endDate) {
        const hasMatchingDate = experience.availableDates.some(dateStr => {
          const date = new Date(dateStr);
          if (filters.startDate && date < filters.startDate) return false;
          if (filters.endDate && date > filters.endDate) return false;
          return true;
        });
        if (!hasMatchingDate) return false;
      }

      return true;
    });
  };

  const filteredExperiences = filterExperiences();

  const clearFilters = () => {
    setFilters({
      search: '',
      location: 'all',
      category: 'all',
      type: 'all',
      startDate: undefined,
      endDate: undefined
    });
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8">
          <ExperienceFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredExperiences.length} of {experiences.length} experiences
          </p>
        </div>

        {/* Featured Experience */}
        <div className="relative mb-16 rounded-2xl overflow-hidden travel-shadow">
          <img 
            src={cultureImage} 
            alt="Cultural experiences collage" 
            className="w-full h-80 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/90 via-yellow-50/70 to-transparent" />
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
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden border-border hover:border-travel-ocean/50">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={experience.image} 
                    alt={experience.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    {experience.type === 'online' ? (
                      <Badge className="bg-green-500/90 text-white">
                        <Wifi className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/90 text-white">
                        <WifiOff className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    )}
                  </div>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No experiences match your current filters</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="journey" size="lg">
            Load More Experiences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FilterableExperienceShowcase;