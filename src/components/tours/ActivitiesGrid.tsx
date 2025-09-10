import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Activity } from "lucide-react";

interface ActivityItem {
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

interface ActivitiesGridProps {
  activities: ActivityItem[];
  onBookActivity: (activityId: string) => void;
}

export const ActivitiesGrid = ({ activities, onBookActivity }: ActivitiesGridProps) => {
  const formatPrice = (activity: ActivityItem) => {
    const symbol = activity.currency === 'USD' ? '$' : activity.currency;
    if (activity.price_to && activity.price_to !== activity.price_from) {
      return `${symbol}${activity.price_from}-${activity.price_to}`;
    }
    return `from ${symbol}${activity.price_from}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:travel-shadow transition-all duration-300 overflow-hidden">
          <div className="relative">
            <img 
              src={activity.image_urls[0]} 
              alt={activity.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-white/90 text-foreground">
                <Activity className="w-3 h-3 mr-1" />
                Activity
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-travel-sunset text-travel-sunset" />
                <span className="font-medium">{activity.rating}</span>
                <span className="text-muted-foreground">({activity.review_count})</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm line-clamp-3">
              {activity.short_description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{activity.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activity.duration_hours}h
              </div>
            </div>

            {activity.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activity.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {activity.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{activity.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-lg font-bold text-travel-ocean">
                {formatPrice(activity)}
              </div>
              <Button 
                onClick={() => onBookActivity(activity.id)} 
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