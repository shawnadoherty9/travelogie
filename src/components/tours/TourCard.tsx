import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Users, Heart } from "lucide-react";
import { useState } from "react";

interface Attraction {
  id: string;
  name: string;
  type: string;
  duration_hours?: number;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  duration_hours?: number;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  price_from: number;
  price_to?: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  city: string;
  attractions: Attraction[];
  activities: Activity[];
}

interface TourCardProps {
  tour: Tour;
  onBookTour: (tourId: string) => void;
}

export const TourCard = ({ tour, onBookTour }: TourCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const formatPrice = () => {
    const symbol = tour.currency === 'USD' ? '$' : tour.currency;
    if (tour.price_to && tour.price_to !== tour.price_from) {
      return `${symbol}${tour.price_from}-${tour.price_to}`;
    }
    return `${symbol}${tour.price_from}`;
  };

  return (
    <Card className="hover:travel-shadow transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img 
          src={tour.image_urls[0]} 
          alt={tour.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{tour.name}</CardTitle>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-travel-sunset text-travel-sunset" />
            <span className="font-medium">{tour.rating}</span>
            <span className="text-muted-foreground">({tour.review_count})</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {tour.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {tour.city}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {tour.duration_hours}h
          </div>
        </div>

        {/* Attractions */}
        {tour.attractions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Includes Attractions:</h4>
            <div className="flex flex-wrap gap-1">
              {tour.attractions.slice(0, 3).map((attraction) => (
                <Badge key={attraction.id} variant="secondary" className="text-xs">
                  {attraction.name}
                </Badge>
              ))}
              {tour.attractions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tour.attractions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Activities */}
        {tour.activities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Activities:</h4>
            <div className="flex flex-wrap gap-1">
              {tour.activities.slice(0, 3).map((activity) => (
                <Badge key={activity.id} variant="outline" className="text-xs">
                  {activity.name}
                </Badge>
              ))}
              {tour.activities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{tour.activities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-lg font-bold text-travel-ocean">
            {formatPrice()}
          </div>
          <Button onClick={() => onBookTour(tour.id)} className="bg-gradient-wanderlust hover:opacity-90">
            Book Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};