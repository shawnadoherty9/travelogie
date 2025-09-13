import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Backpack, Camera, GraduationCap, Heart, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
const UserTypeSelection = () => {
  const {
    user
  } = useAuth();
  const userTypes = [{
    type: "traveler",
    title: "Traveler",
    description: "Explore authentic local experiences and connect with culture",
    icon: Backpack,
    features: ["Personalized tours", "Local connections", "Cultural immersion", "Travel planning"],
    color: "travel-ocean"
  }, {
    type: "guide",
    title: "Tour Operator",
    description: "Share your local knowledge and create memorable experiences",
    icon: Camera,
    features: ["Create custom tours", "Set your schedule", "Earn income", "Share culture"],
    color: "travel-sunset"
  }, {
    type: "teacher",
    title: "Language Teacher",
    description: "Teach your native language to curious travelers",
    icon: GraduationCap,
    features: ["Online lessons", "Cultural exchange", "Flexible hours", "Global students"],
    color: "travel-earth"
  }, {
    type: "cultural",
    title: "Cultural Experience",
    description: "Offer unique cultural workshops and authentic experiences",
    icon: Heart,
    features: ["Workshop hosting", "Cultural sharing", "Skill teaching", "Community building"],
    color: "accent"
  }, {
    type: "venue",
    title: "Event Venue",
    description: "List your venue for cultural events and gatherings",
    icon: MapPin,
    features: ["Event hosting", "Venue management", "Bookings", "Local partnerships"],
    color: "travel-sky"
  }];
  return <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Join Our Global Community
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Whether you're seeking adventure or sharing your culture, 
            there's a place for you in the Travelogie family.
          </p>
        </div>

        {/* Responsive grid: 1 col on mobile, 2 cols on sm, 3 cols on lg, 5 cols on xl+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-4 max-w-7xl mx-auto items-stretch">
          {userTypes.map(userType => {
          const IconComponent = userType.icon;
          return <Card key={userType.type} className="group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border-border hover:border-travel-ocean/50 cultural-shadow h-full flex flex-col animate-fade-in">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-${userType.color}/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-${userType.color}/20 transition-colors`}>
                    <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 text-${userType.color}`} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
                    {userType.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 flex-grow flex flex-col justify-between p-4 sm:p-6 pt-0">
                  <ul className="space-y-2">
                    {userType.features.map((feature, index) => <li key={index} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-travel-ocean mr-2 sm:mr-3 flex-shrink-0" />
                        {feature}
                      </li>)}
                  </ul>
                  
                  <Button className="w-full mt-4 text-sm sm:text-base bg-gradient-to-r from-travel-ocean to-travel-sky text-white border-0 hover:from-travel-ocean/90 hover:to-travel-sky/90 hover-scale" asChild>
                    <Link to={user ? "/registration" : "/auth"}>
                      <span className="hidden sm:inline">Get Started as {userType.title}</span>
                      <span className="sm:hidden">Join as {userType.title.split(' ')[0]}</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Community Stats - Responsive */}
        <div className="mt-12 sm:mt-16 text-center px-4">
          
        </div>
      </div>
    </section>;
};
export default UserTypeSelection;