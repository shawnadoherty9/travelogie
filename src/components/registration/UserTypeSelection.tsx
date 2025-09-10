import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Languages, Users, Calendar } from "lucide-react";

interface UserTypeSelectionProps {
  onSelectType: (type: string) => void;
}

const UserTypeSelection = ({ onSelectType }: UserTypeSelectionProps) => {
  const userTypes = [
    {
      type: 'traveler',
      title: 'Traveler',
      description: 'Discover authentic local experiences and connect with locals worldwide',
      icon: Plane,
      features: ['Find local experiences', 'Connect with locals', 'Plan dream trips', 'Share travel stories']
    },
    {
      type: 'tour_operator',
      title: 'Tour Operator',
      description: 'Share your local knowledge and create unforgettable experiences for travelers',
      icon: MapPin,
      features: ['Create tour offerings', 'Set availability', 'Manage bookings', 'Earn from your expertise']
    },
    {
      type: 'language_teacher',
      title: 'Language Teacher',
      description: 'Teach your native language and help others communicate across cultures',
      icon: Languages,
      features: ['Offer language lessons', 'Create learning content', 'Record sessions', 'Build student base']
    },
    {
      type: 'cultural_experience',
      title: 'Cultural Experience Guide',
      description: 'Share your cultural heritage through immersive experiences',
      icon: Users,
      features: ['Cultural workshops', 'Traditional experiences', 'Online & in-person', 'Share heritage']
    },
    {
      type: 'event_venue',
      title: 'Event Venue',
      description: 'Host travelers and locals for memorable cultural events',
      icon: Calendar,
      features: ['List your venue', 'Host events', 'Manage bookings', 'Build community']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Join the Travelogie Community
        </h1>
        <p className="text-xl text-muted-foreground">
          Choose your role and start connecting with people around the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userTypes.map((userType) => {
          const IconComponent = userType.icon;
          return (
            <Card key={userType.type} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{userType.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">{userType.description}</p>
                <ul className="space-y-2">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onSelectType(userType.type)}
                  className="w-full mt-4"
                  variant="default"
                >
                  Get Started as {userType.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserTypeSelection;