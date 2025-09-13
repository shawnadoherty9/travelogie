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

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Cultural travel experiences around the world" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 via-amber-300/60 to-orange-200/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Discover the World
              <span className="text-gradient block">Travelogie</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Connect with locals for personalized tours, language lessons, and cultural authentic experiences that transform travelers into storytellers.</p>
          </div>

          <div className="text-center mb-16">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-8 border border-travel-ocean/20 travel-shadow inline-block">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Discover & Share Travel Gems
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our interactive world map to discover hidden travel gems shared by fellow adventurers.
                Click anywhere to add your own travel suggestions!
              </p>
            </div>
          </div>

          {/* Interactive Travel Map */}
          <div className="relative h-96 rounded-lg overflow-hidden travel-shadow">
            <InteractiveTravelMap />
            <div className="absolute top-4 left-4 z-[5000]">
              <Button 
                variant="default" 
                size="lg" 
                className="animate-pulse bg-blue-600 hover:bg-blue-700 text-white"
              >
                <MapPin className="w-6 h-6" />
                Add Your Pin
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 pt-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-travel-ocean">50K+</div>
              <div className="text-sm text-muted-foreground">Local Guides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-travel-sunset">200+</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-travel-earth">1M+</div>
              <div className="text-sm text-muted-foreground">Experiences</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;