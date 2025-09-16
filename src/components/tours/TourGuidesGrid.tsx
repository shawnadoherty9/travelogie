import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Languages, CheckCircle } from "lucide-react";

interface TourGuide {
  id: string | number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  location: string;
  specialties: string[];
  languages: string[];
  priceRange: string;
  verified: boolean;
  about: string;
  availability: string;
}

interface TourGuidesGridProps {
  guides: TourGuide[];
  onContactGuide?: (guideId: string) => void;
  title?: string;
  subtitle?: string;
}

export const TourGuidesGrid = ({ 
  guides, 
  onContactGuide, 
  title = "Connect with Local Cultural Guides",
  subtitle = "Meet passionate locals who will share their city's hidden gems, cultural traditions, and authentic experiences. Each guide brings unique perspectives and deep local knowledge."
}: TourGuidesGridProps) => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {guides.map((guide) => (
            <Card 
              key={guide.id} 
              className="group hover:travel-shadow transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-square overflow-hidden">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage 
                      src={guide.avatar} 
                      alt={guide.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <AvatarFallback className="w-full h-full rounded-none text-2xl bg-gradient-to-br from-travel-ocean to-travel-sky text-white">
                      {guide.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {guide.verified && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-travel-forest bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-travel-ocean transition-colors">
                    {guide.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {guide.location}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-travel-sunset text-travel-sunset" />
                    <span className="font-medium">{guide.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({guide.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {guide.specialties.slice(0, 2).map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {guide.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{guide.specialties.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <Languages className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {guide.languages.slice(0, 2).join(', ')}
                    {guide.languages.length > 2 && ` +${guide.languages.length - 2}`}
                  </span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium text-travel-ocean mb-2">
                    {guide.priceRange}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-travel-ocean to-travel-sky hover:opacity-90"
                    onClick={() => onContactGuide?.(guide.id.toString())}
                  >
                    Connect Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};