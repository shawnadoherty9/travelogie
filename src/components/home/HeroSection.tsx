import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Globe, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";
import worldMapImage from "@/assets/world-map-hero.jpg";
const HeroSection = () => {
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
              Discover the World Through
              <span className="text-gradient block">Travelogie</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">Connect with locals for personalized tours, language lessons, and cultural authentic experiences that transform travelers into storytellers.</p>
          </div>

          {/* Search Interface */}
          <Card className="p-6 bg-background/95 backdrop-blur-sm border-travel-ocean/20 travel-shadow">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Where do you want to explore?</h3>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="Search destinations, experiences, or locals..." className="pl-10 h-12 text-lg border-travel-ocean/30 focus:border-travel-ocean" />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="journey" className="h-12">
                  <MapPin className="w-5 h-5" />
                  Explore Map
                </Button>
                <Button variant="cultural" className="h-12">
                  <Calendar className="w-5 h-5" />
                  Book Experience
                </Button>
                <Button variant="explorer" className="h-12">
                  <Users className="w-5 h-5" />
                  Meet Locals
                </Button>
              </div>
            </div>
          </Card>

          {/* Interactive World Map Teaser */}
          <div className="relative">
            <img src={worldMapImage} alt="Interactive world map with travel destinations" className="w-full max-w-3xl mx-auto rounded-lg travel-shadow opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button variant="wanderlust" size="lg" className="animate-pulse">
                <Globe className="w-6 h-6" />
                Start Your Journey
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