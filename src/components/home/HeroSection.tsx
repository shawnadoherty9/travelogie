import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Globe, Calendar, Users, Compass, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-travel.jpg";
import InteractiveTravelMap from "./InteractiveTravelMap";
const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExploreMap = () => {
    navigate("/destinations");
  };

  const handleBookExperience = () => {
    navigate("/experiences");
  };

  const handleMeetLocals = () => {
    navigate("/tours");
  };

  const handleStartJourney = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Cultural travel experiences around the world" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 via-amber-300/60 to-orange-200/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Discover the World
              <span className="text-gradient block">Travelogie</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">Connect with locals for personalized tours, language lessons, and cultural authentic experiences that transform travelers into storytellers.</p>
          </div>

          {/* Discover & Share Travel Gems section */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-travel-ocean/20 travel-shadow inline-block max-w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
                Discover & Share Travel Gems
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our interactive world map to discover hidden travel gems shared by fellow adventurers.
                <span className="hidden sm:inline"> Click anywhere to add your own travel suggestions!</span>
              </p>
            </div>
          </div>

          {/* Interactive Travel Map - Responsive height */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] rounded-lg overflow-hidden travel-shadow mb-8 sm:mb-16">
            <InteractiveTravelMap />
            {/* Add Your Pin button positioned over map */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-[5000]">
              <Button 
                variant="default" 
                size="sm"
                className="animate-pulse bg-blue-600 hover:bg-blue-700 text-white sm:text-base"
              >
                <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline ml-2">Add Your Pin</span>
                <span className="sm:hidden ml-1">Add Pin</span>
              </Button>
            </div>
          </div>

          {/* Where do you want to explore section */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-travel-ocean/20 travel-shadow w-full max-w-2xl mx-auto">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">Where do you want to explore?</h3>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input placeholder="Search destinations..." className="pl-10 h-10 sm:h-12 text-sm sm:text-lg border-travel-ocean/30 focus:border-travel-ocean" />
                </div>

                {/* Quick Actions - Stack on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                  <Button variant="journey" className="h-12 sm:h-14 flex items-center justify-center gap-2">
                    <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Find Tours</span>
                  </Button>
                  <Button variant="cultural" className="h-12 sm:h-14 flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Learn Languages</span>
                  </Button>
                  <Button variant="explorer" className="h-12 sm:h-14 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Book Experiences</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 sm:pt-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-travel-ocean">50K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Local Guides</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-travel-sunset">200+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-travel-earth">1M+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Experiences</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;