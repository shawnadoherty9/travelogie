import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Camera } from "lucide-react";

interface Attraction {
  id: string;
  name: string;
  short_description: string;
  description: string;
  price_from: number;
  price_to?: number;
  duration_hours: number;
  rating: number;
  review_count: number;
  image_urls: string[];
  tags: string[];
  currency: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AttractionsGridProps {
  attractions: Attraction[];
  onBookAttraction: (attractionId: string) => void;
}

export const AttractionsGrid = ({ attractions, onBookAttraction }: AttractionsGridProps) => {
  const formatPrice = (attraction: Attraction) => {
    const symbol = attraction.currency === 'USD' ? '$' : attraction.currency;
    if (attraction.price_to && attraction.price_to !== attraction.price_from) {
      return `${symbol}${attraction.price_from}-${attraction.price_to}`;
    }
    return `from ${symbol}${attraction.price_from}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {attractions.map((attraction) => (
        <Card key={attraction.id} className="hover:travel-shadow transition-all duration-300 overflow-hidden">
          <div className="relative">
            <img 
              src={attraction.image_urls[0]} 
              alt={attraction.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-white/90 text-foreground">
                <Camera className="w-3 h-3 mr-1" />
                Attraction
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{attraction.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-travel-sunset text-travel-sunset" />
                <span className="font-medium">{attraction.rating}</span>
                <span className="text-muted-foreground">({attraction.review_count})</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm line-clamp-3">
              {attraction.short_description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{attraction.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {attraction.duration_hours}h
              </div>
            </div>

            {attraction.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {attraction.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {attraction.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{attraction.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold text-travel-ocean">
                {formatPrice(attraction)}
              </div>
              <Button 
                onClick={() => onBookAttraction(attraction.id)} 
                className="bg-gradient-wanderlust hover:opacity-90"
              >
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};