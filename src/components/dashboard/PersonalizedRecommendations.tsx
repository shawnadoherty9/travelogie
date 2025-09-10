import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MapPin, 
  Star, 
  Heart, 
  Clock, 
  Users,
  Camera,
  Music,
  Utensils,
  Palette,
  Mountain,
  Waves,
  Building,
  BookOpen,
  Compass
} from "lucide-react";

interface PersonalizedRecommendationsProps {
  userInterests: string[];
  customInterests: string[];
  userLocation?: string;
  visitedPlaces: Array<{
    place_name: string;
    country: string;
  }>;
}

interface Recommendation {
  id: string;
  title: string;
  type: 'experience' | 'destination' | 'activity';
  description: string;
  location: string;
  rating: number;
  price: string;
  duration: string;
  tags: string[];
  image: string;
  matchedInterests: string[];
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  userInterests,
  customInterests,
  userLocation,
  visitedPlaces
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const getIconForInterest = (interest: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'photography': <Camera className="w-4 h-4" />,
      'music': <Music className="w-4 h-4" />,
      'food': <Utensils className="w-4 h-4" />,
      'art': <Palette className="w-4 h-4" />,
      'hiking': <Mountain className="w-4 h-4" />,
      'water sports': <Waves className="w-4 h-4" />,
      'architecture': <Building className="w-4 h-4" />,
      'history': <BookOpen className="w-4 h-4" />,
      'adventure': <Compass className="w-4 h-4" />,
    };
    return iconMap[interest.toLowerCase()] || <Star className="w-4 h-4" />;
  };

  useEffect(() => {
    generateRecommendations();
  }, [userInterests, customInterests, userLocation, visitedPlaces]);

  const generateRecommendations = async () => {
    setLoading(true);
    
    // Mock recommendations based on user interests
    // In a real app, this would be an AI-powered recommendation engine
    const allInterests = [...userInterests, ...customInterests];
    
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Street Photography Tour in Tokyo',
        type: 'experience',
        description: 'Capture the essence of Tokyo with a local photographer guide through hidden neighborhoods.',
        location: 'Tokyo, Japan',
        rating: 4.9,
        price: '$85',
        duration: '4 hours',
        tags: ['photography', 'culture', 'walking'],
        image: '/assets/tokyo-photography.jpg',
        matchedInterests: allInterests.filter(i => ['photography', 'culture', 'art'].includes(i.toLowerCase()))
      },
      {
        id: '2',
        title: 'Traditional Cooking Class in Tuscany',
        type: 'experience',
        description: 'Learn authentic Italian recipes from a local nonna in her family kitchen.',
        location: 'Florence, Italy',
        rating: 4.8,
        price: '$120',
        duration: '3 hours',
        tags: ['food', 'culture', 'cooking'],
        image: '/assets/tuscany-cooking.jpg',
        matchedInterests: allInterests.filter(i => ['food', 'cooking', 'culture'].includes(i.toLowerCase()))
      },
      {
        id: '3',
        title: 'Flamenco Experience in Seville',
        type: 'experience',
        description: 'Immerse yourself in passionate flamenco with local dancers and musicians.',
        location: 'Seville, Spain',
        rating: 4.7,
        price: '$65',
        duration: '2 hours',
        tags: ['music', 'dance', 'culture'],
        image: '/assets/flamenco-seville.jpg',
        matchedInterests: allInterests.filter(i => ['music', 'dance', 'culture', 'art'].includes(i.toLowerCase()))
      },
      {
        id: '4',
        title: 'Calligraphy Workshop in Kyoto',
        type: 'experience',
        description: 'Master the ancient art of Japanese calligraphy with a traditional sensei.',
        location: 'Kyoto, Japan',
        rating: 4.9,
        price: '$95',
        duration: '2.5 hours',
        tags: ['art', 'culture', 'traditional'],
        image: '/assets/kyoto-calligraphy.jpg',
        matchedInterests: allInterests.filter(i => ['art', 'culture', 'history'].includes(i.toLowerCase()))
      },
      {
        id: '5',
        title: 'Adventure Hiking in Norwegian Fjords',
        type: 'destination',
        description: 'Explore breathtaking landscapes and challenge yourself with Nordic adventures.',
        location: 'Bergen, Norway',
        rating: 4.8,
        price: '$200',
        duration: 'Full day',
        tags: ['hiking', 'adventure', 'nature'],
        image: '/assets/norway-fjords.jpg',
        matchedInterests: allInterests.filter(i => ['hiking', 'adventure', 'nature', 'photography'].includes(i.toLowerCase()))
      }
    ];

    // Filter recommendations based on user interests
    const relevantRecommendations = mockRecommendations.filter(rec => 
      rec.matchedInterests.length > 0
    ).slice(0, 4);

    setRecommendations(relevantRecommendations);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Personalized for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No recommendations yet</p>
            <p className="text-sm text-muted-foreground">
              Complete your profile with interests to get personalized recommendations!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommended for You
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Based on your interests:</span>
            <div className="flex gap-1">
              {userInterests.slice(0, 3).map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {getIconForInterest(interest)}
                  <span className="ml-1">{interest}</span>
                </Badge>
              ))}
              {userInterests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{userInterests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <div key={rec.id} className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between text-white">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {rec.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{rec.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {rec.location}
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {rec.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.duration}
                    </span>
                    <span className="font-medium text-foreground">{rec.price}</span>
                  </div>
                  <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details
                  </Button>
                </div>
                
                {rec.matchedInterests.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Matches:</span>
                    {rec.matchedInterests.slice(0, 2).map((interest, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                    {rec.matchedInterests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{rec.matchedInterests.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="w-full">
            <Compass className="w-4 h-4 mr-2" />
            Explore More Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};