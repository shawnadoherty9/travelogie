import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Backpack, 
  Camera, 
  GraduationCap, 
  Heart, 
  MapPin, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserTypeSelection = () => {
  const { user } = useAuth();
  const userTypes = [
    {
      type: "traveler",
      title: "Traveler",
      description: "Explore authentic local experiences and connect with culture",
      icon: Backpack,
      features: ["Personalized tours", "Local connections", "Cultural immersion", "Travel planning"],
      color: "travel-ocean"
    },
    {
      type: "guide",
      title: "Tour Operator",
      description: "Share your local knowledge and create memorable experiences",
      icon: Camera,
      features: ["Create custom tours", "Set your schedule", "Earn income", "Share culture"],
      color: "travel-sunset"
    },
    {
      type: "teacher",
      title: "Language Teacher",
      description: "Teach your native language to curious travelers",
      icon: GraduationCap,
      features: ["Online lessons", "Cultural exchange", "Flexible hours", "Global students"],
      color: "travel-earth"
    },
    {
      type: "cultural",
      title: "Cultural Experience",
      description: "Offer unique cultural workshops and authentic experiences",
      icon: Heart,
      features: ["Workshop hosting", "Cultural sharing", "Skill teaching", "Community building"],
      color: "accent"
    },
    {
      type: "venue",
      title: "Event Venue",
      description: "List your venue for cultural events and gatherings",
      icon: MapPin,
      features: ["Event hosting", "Venue management", "Bookings", "Local partnerships"],
      color: "travel-sky"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Join Our Global Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're seeking adventure or sharing your culture, 
            there's a place for you in the Travelogie family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {userTypes.map((userType) => {
            const IconComponent = userType.icon;
            return (
              <Card 
                key={userType.type} 
                className="group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border-border hover:border-travel-ocean/50 cultural-shadow"
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${userType.color}/10 flex items-center justify-center mb-4 group-hover:bg-${userType.color}/20 transition-colors`}>
                    <IconComponent className={`w-8 h-8 text-${userType.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {userType.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {userType.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-travel-ocean mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant="cultural" 
                    className="w-full mt-4"
                    asChild
                  >
                    <Link to={user ? "/dashboard" : "/auth"}>
                      Get Started as {userType.title}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Community Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-background rounded-full px-6 py-3 travel-shadow">
            <Users className="w-5 h-5 text-travel-ocean" />
            <span className="text-sm font-medium text-foreground">
              Join 50,000+ locals and travelers worldwide
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTypeSelection;